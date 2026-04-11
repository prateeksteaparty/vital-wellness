from fastapi import FastAPI
from pydantic import BaseModel
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
    return re.sub(r"[^a-z\s]", "", text.lower())

def expand(text: str) -> str:
    words = text.split()
    expanded = []
    for w in words:
        expanded.extend(synonym_dict.get(w, [w]))
    return " ".join(expanded)

# ============================================================
# TF-IDF (BUILT ONCE)
# ============================================================
df_original["semantic_text"] = (
    df_original["symptom_keywords"].fillna("") + " " +
    df_original["cause_tags"].fillna("") + " " +
    df_original["description"].fillna("")
)

vectorizer = TfidfVectorizer(stop_words="english")
nutrient_vectors = vectorizer.fit_transform(df_original["semantic_text"])

intent_vectorizer = TfidfVectorizer(stop_words="english")
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
    feedbacks: list[Feedback] = []

# ============================================================
# FEEDBACK (STATEFUL, THIS WAS THE BUG)
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
# SAFETY RULES
# ============================================================
def diet_score(row, diet):
    foods = str(row["food_sources"]).lower()
    if diet == "vegan" and any(x in foods for x in ANIMAL + DAIRY + EGGS):
        return 0.03
    if diet == "veg" and any(x in foods for x in ANIMAL + EGGS):
        return 0.05
    return 1.0

def allergy_score(row, allergies):
    foods = str(row["food_sources"]).lower()
    for a in allergies:
        if a in ALLERGY_MAP and any(w in foods for w in ALLERGY_MAP[a]):
            return 0.01
    return 1.0

# ============================================================
# CORE ML ENDPOINT
# ============================================================
@app.post("/predict")
def predict(data: IssueRequest):
    user = data.userDetails
    feedback_map = fetch_user_feedback(user.userId)

    query = expand(normalize(data.text))
    q_vec = vectorizer.transform([query])
    i_vec = intent_vectorizer.transform([query])

    semantic = cosine_similarity(q_vec, nutrient_vectors)[0]
    intent = cosine_similarity(i_vec, intent_vectors)[0]

    df = df_original.copy()
    df["semantic"] = semantic
    df["intent"] = intent

    def score(row):
        base = (
            0.55 * row["semantic"] +
            0.20 * row["intent"] +
            0.15 * diet_score(row, user.dietPreference.lower())
                   * allergy_score(row, [a.lower() for a in user.allergies])
        )
        return base * feedback_multiplier(row["name"], feedback_map)

    df["final_score"] = df.apply(score, axis=1)

    if df["final_score"].max() > 0:
        df["final_score"] = (df["final_score"] / df["final_score"].max()) * 100

    df["final_score"] = df["final_score"].clip(upper=95)

    top = df.sort_values("final_score", ascending=False).head(5)

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
