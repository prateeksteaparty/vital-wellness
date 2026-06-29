from fastapi import FastAPI
from pydantic import BaseModel, Field
import pandas as pd
import json
import re
import nltk
import numpy as np
import requests
import os
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from fastapi.middleware.cors import CORSMiddleware

# ============================================================
# BASIC SETUP
# ============================================================
nltk.download("wordnet")
nltk.download("omw-1.4")

BACKEND_URL = "http://backend:5000"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Optional LLM (no dotenv, no crash)
client = None
if OPENAI_API_KEY:
    from openai import OpenAI
    client = OpenAI(api_key=OPENAI_API_KEY)

# ============================================================
# FASTAPI APP
# ============================================================
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# LOAD STATIC DATA
# ============================================================
df_original = pd.read_csv("vital_data.csv")
df_original.columns = df_original.columns.str.strip().str.lower()

with open("synonym_dict.json") as f:
    synonym_dict = json.load(f)

lemmatizer = WordNetLemmatizer()

# ============================================================
# FOOD / ALLERGY KNOWLEDGE
# ============================================================
ANIMAL = ["meat", "fish", "chicken", "beef", "pork", "lamb", "seafood"]
DAIRY = ["milk", "cheese", "butter", "ghee", "curd", "yogurt"]
EGGS = ["egg", "eggs"]

ALLERGY_MAP = {
    "dairy": DAIRY,
    "eggs": EGGS,
    "nuts": ["almond", "cashew", "peanut", "walnut"]
}

# ============================================================
# NLP HELPERS
# ============================================================
def normalize(text: str) -> str:
    # Preserve alphanumeric characters, hyphens, and spaces to retain B12, D3, omega-3, etc.
    return re.sub(r"[^a-z0-9\s-]", "", text.lower())

def expand(text: str, exact_boost_factor: int = 3) -> str:
    """
    Expands query terms using synonym dictionary while synthetically boosting
    the exact user input terms to prevent semantic query dilution.
    """
    words = text.split()
    expanded_tokens = []
    
    for w in words:
        # Boost the user's literal query term to retain its mathematical weight
        expanded_tokens.extend([w] * exact_boost_factor)
        
        # Pull synonyms from the synonym dictionary
        syns = synonym_dict.get(w, [])
        if isinstance(syns, list):
            expanded_tokens.extend([str(s).lower().strip() for s in syns])
        elif isinstance(syns, str):
            expanded_tokens.extend([s.strip().lower() for s in syns.split(",")])
            
    return " ".join(expanded_tokens)

# ============================================================
# TF-IDF (BUILT ONCE WITH ADAPTIVE PRESETS)
# ============================================================
df_original["semantic_text"] = (
    df_original["symptom_keywords"].fillna("") + " " +
    df_original["cause_tags"].fillna("") + " " +
    df_original["description"].fillna("")
)

# Custom token pattern preserves single characters (Vitamins A, C, D) and hyphens (omega-3)
custom_token_pattern = r"(?u)\b\w[\w-]*\w\b|\b\w\b"

vectorizer = TfidfVectorizer(
    token_pattern=custom_token_pattern,
    sublinear_tf=True,
    stop_words="english"
)
nutrient_vectors = vectorizer.fit_transform(df_original["semantic_text"])

intent_vectorizer = TfidfVectorizer(
    token_pattern=custom_token_pattern,
    sublinear_tf=True,
    stop_words="english"
)
intent_vectors = intent_vectorizer.fit_transform(
    df_original["symptom_keywords"].fillna("") + " " +
    df_original["cause_tags"].fillna("")
)

# ============================================================
# SCHEMAS
# ============================================================
class UserDetails(BaseModel):
    userId: str
    gender: str
    dietPreference: str
    lifestyle: str
    allergies: list[str]

class Feedback(BaseModel):
    nutrientName: str
    scoreAdjustment: float

class IssueRequest(BaseModel):
    text: str
    userDetails: UserDetails
    feedbacks: list[Feedback] = Field(default_factory=list)

# ============================================================
# FEEDBACK (STATEFUL STATE ALIGNMENT)
# ============================================================
def fetch_user_feedback(user_id: str) -> dict:
    feedback_map = {}
    if not user_id:
        return feedback_map

    try:
        r = requests.get(f"{BACKEND_URL}/api/feedback/{user_id}", timeout=5)
        if r.status_code == 200:
            for f in r.json():
                name = f["nutrientName"].lower()
                feedback_map[name] = feedback_map.get(name, 0) + f["scoreAdjustment"]
    except Exception as e:
        print("Feedback fetch failed:", e)

    return feedback_map

def feedback_multiplier(name: str, feedback_map: dict) -> float:
    v = feedback_map.get(name.lower(), 0)
    if v < 0:
        return 0.3   # push DOWN
    elif v > 0:
        return 2.0   # push UP
    return 1.0

# ============================================================
# MULTIPLICATIVE RELEVANCE MODIFIERS (SOFT METADATA SCALING)
# ============================================================
def diet_multiplier(row, diet: str) -> float:
    diet = diet.lower().strip()
    if not diet or diet in ["all", "nonveg"]:
        return 1.0

    # 1. Primary check against explicit diet compatibility tags
    compat_field = str(row.get("diet_compatibility", "")).lower()
    compat_tags = [t.strip() for t in compat_field.split("|")] if compat_field else []

    # 2. Backup check based on food ingredient analysis
    foods = str(row.get("food_sources", "")).lower()
    contains_animal = any(x in foods for x in ANIMAL)
    contains_dairy = any(x in foods for x in DAIRY)
    contains_eggs = any(x in foods for x in EGGS)

    if diet == "vegan":
        if compat_tags and "vegan" not in compat_tags:
            return 0.0
        if contains_animal or contains_dairy or contains_eggs:
            return 0.0
            
    elif diet == "veg":
        if compat_tags and "veg" not in compat_tags and "vegan" not in compat_tags:
            return 0.0
        if contains_animal:
            return 0.0

    return 1.0

def allergy_multiplier(row, allergies: list[str]) -> float:
    foods = str(row.get("food_sources", "")).lower()
    name = str(row.get("name", "")).lower()
    description = str(row.get("description", "")).lower()
    
    for a in allergies:
        a_clean = a.lower().strip()
        if not a_clean:
            continue
            
        mapped_terms = ALLERGY_MAP.get(a_clean, [a_clean])
        # Eliminate item entirely (0.0 multiplier) if an allergen matches food ingredients, name, or description
        if any(term in foods or term in name or term in description for term in mapped_terms):
            return 0.0
            
    return 1.0

def gender_multiplier(row, gender: str) -> float:
    gender = gender.lower().strip()
    if not gender or gender == "all":
        return 1.0

    gender_tags = str(row.get("gender_tags", "all")).lower().strip()
    if gender_tags!= "all" and gender_tags!= gender:
        return 0.1  # Apply a soft penalty instead of a hard filter
        
    return 1.0

def lifestyle_multiplier(row, lifestyle: str) -> float:
    lifestyle = lifestyle.lower().strip()
    if not lifestyle or lifestyle == "all":
        return 1.0

    lifestyle_tags = str(row.get("lifestyle_tags", "all")).lower().strip()
    if lifestyle_tags == "all":
        return 1.0

    tags = [t.strip() for t in lifestyle_tags.split("|")]
    if lifestyle not in tags:
        return 0.7  # Gentle soft penalty for lifestyle mismatch
        
    return 1.0

# ============================================================
# CORE ML ENDPOINT
# ============================================================
# ============================================================
# CORE ML ENDPOINT
# ============================================================
@app.post("/predict")
def predict(data: IssueRequest):

    # Empty input
    if not data.text.strip():
        return {
            "recommendations": [],
            "message": "Please enter your symptoms."
        }

    query_text = normalize(data.text)

    # Ignore greetings / junk inputs
    INVALID = {
        "hi", "hello", "hey", "yo", "sup",
        "ok", "okay", "thanks", "thank you",
        "test"
    }

    if query_text in INVALID:
        return {
            "recommendations": [],
            "message": "Please describe your symptoms instead of a greeting."
        }

    user = data.userDetails
    feedback_map = fetch_user_feedback(user.userId)

    # Clean, normalize and expand the query
    query = expand(query_text, exact_boost_factor=3)

    q_vec = vectorizer.transform([query])
    i_vec = intent_vectorizer.transform([query])

    semantic = cosine_similarity(q_vec, nutrient_vectors).flatten()
    intent = cosine_similarity(i_vec, intent_vectors).flatten()

    df = df_original.copy()
    df["semantic"] = semantic
    df["intent"] = intent

    def score(row):

        text_score = (
            0.70 * row["semantic"]
            + 0.30 * row["intent"]
        )

        d_mult = diet_multiplier(row, user.dietPreference)
        a_mult = allergy_multiplier(row, user.allergies)
        g_mult = gender_multiplier(row, user.gender)
        l_mult = lifestyle_multiplier(row, user.lifestyle)
        f_mult = feedback_multiplier(row["name"], feedback_map)

        return (
            text_score
            * d_mult
            * a_mult
            * g_mult
            * l_mult
            * f_mult
        )

    df["final_score"] = df.apply(score, axis=1)

    max_score = df["final_score"].max()
    print(f"Raw max score: {max_score:.4f} | Query: {data.text}")

    # Reject queries with no meaningful match
    if max_score < 0.05:
        return {
            "recommendations": [],
            "message": (
                "We couldn't identify enough symptoms to make reliable recommendations. "
                "Please describe your symptoms in more detail."
            )
        }

    # Normalize confidence
    df["final_score"] = (
        df["final_score"] / max_score
    ) * 100

    df["final_score"] = df["final_score"].clip(upper=95)

    top = (
        df.sort_values(
            "final_score",
            ascending=False
        )
        .head(5)
    )

    return {
        "recommendations": [
            {
                "name": r["name"],
                "type": r["type"],
                "confidence": round(r["final_score"], 2),
                "food_sources": r["food_sources"],
                "description": r["description"],
                "citation": r["citation"]
            }
            for _, r in top.iterrows()
        ]
    }

# ============================================================
# OPTIONAL LLM (EXPLANATION ONLY)
# ============================================================
@app.post("/explain")
def explain(data: IssueRequest):
    result = predict(data)

    if not client:
        return {
            **result,
            "explanation": "LLM disabled (OPENAI_API_KEY not set)."
        }

    prompt = f"""
Explain these nutrition recommendations clearly.
Do NOT add new nutrients.
Do NOT give medical advice.

Symptoms: {data.text}
Profile: diet={data.userDetails.dietPreference}, allergies={data.userDetails.allergies}

Recommendations:
{json.dumps(result["recommendations"], indent=2)}
"""

    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "system", "content": prompt}],
        temperature=0.2
    )

    return {
        **result,
        "explanation": resp.choices[0].message.content
    }

# ============================================================
@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)