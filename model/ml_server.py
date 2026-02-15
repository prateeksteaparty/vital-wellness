from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import json
import re
import nltk
import numpy as np
import requests
from datetime import datetime, timedelta
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer, ENGLISH_STOP_WORDS
from sklearn.metrics.pairwise import cosine_similarity
from fastapi.middleware.cors import CORSMiddleware
import copy

nltk.download("wordnet")

# Configuration
BACKEND_URL = "https://vital-wellness.onrender.com"  # Change if your backend runs on different port

# -----------------------------
# App Setup
# -----------------------------
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://vital-wellness.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Load Dataset (ORIGINAL - never modified)
# -----------------------------
df_original = pd.read_csv("vital_data.csv")
df_original.columns = df_original.columns.str.strip().str.lower()

# -----------------------------
# Synonyms
# -----------------------------
with open("synonym_dict.json") as f:
    synonym_dict = json.load(f)

lemmatizer = WordNetLemmatizer()
stopwords = set(ENGLISH_STOP_WORDS)

# -----------------------------
# Food Knowledge Graph
# -----------------------------
ANIMAL = ["meat", "fish", "chicken", "beef", "pork", "lamb", "seafood"]
DAIRY = ["milk", "cheese", "butter", "ghee", "curd", "yogurt"]
EGGS = ["egg", "eggs"]

PLANT_FOODS = [
    "lentils", "beans", "tofu", "spinach",
    "seeds", "nuts", "vegetables", "whole grains"
]

ALLERGY_MAP = {
    "dairy": DAIRY,
    "eggs": EGGS,
    "nuts": ["almond", "cashew", "peanut", "walnut"],
    "soy": ["soy", "soya"],
    "gluten": ["wheat", "barley", "rye"],
    "shellfish": ["shrimp", "prawn", "crab"]
}

# -----------------------------
# Text Preparation
# -----------------------------
def normalize(text):
    text = text.lower()
    text = re.sub(r"[^a-z\s]", "", text)
    return text

def expand(text):
    words = text.split()
    expanded = []
    for w in words:
        expanded += synonym_dict.get(w, [w])
    return " ".join(expanded)

# ============================================
# IMPORTANT: Build vectorizers ONCE at startup
# ============================================
df_original["semantic_text"] = (
    df_original["symptom_keywords"].fillna("") + " " +
    df_original["cause_tags"].fillna("") + " " +
    df_original["description"].fillna("")
)

vectorizer = TfidfVectorizer(stop_words="english")
nutrient_vectors = vectorizer.fit_transform(df_original["semantic_text"])

intent_vectorizer = TfidfVectorizer(stop_words="english")
intent_vectors = intent_vectorizer.fit_transform(
    (df_original["symptom_keywords"].fillna("") + " " + df_original["cause_tags"].fillna(""))
)

# -----------------------------
# Schemas
# -----------------------------
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

# -----------------------------
# Feedback Integration Functions
# -----------------------------
def fetch_user_feedback_from_db(user_id: str) -> dict:
    """
    Fetch all accumulated feedback for a user from MongoDB via backend API
    Returns dict: {nutrient_name: accumulated_score_adjustment}
    """
    accumulated_feedback = {}
    
    if not user_id:
        return accumulated_feedback
    
    try:
        response = requests.get(
            f"{BACKEND_URL}/api/feedback/{user_id}",
            timeout=5
        )
        
        if response.status_code == 200:
            feedback_list = response.json()
            
            # Aggregate feedback by nutrient
            for fb in feedback_list:
                nutrient_name = fb.get("nutrientName", "").lower()
                score_adjustment = fb.get("scoreAdjustment", 0)
                
                # Sum adjustments if same nutrient appears multiple times
                accumulated_feedback[nutrient_name] = (
                    accumulated_feedback.get(nutrient_name, 0) + score_adjustment
                )
                
            print(f"✅ Fetched feedback for user {user_id}: {accumulated_feedback}")
        else:
            print(f"⚠️ Backend returned status {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching feedback from backend: {e}")
    
    return accumulated_feedback

# ============================================
# Scoring Components
# ============================================
def diet_score(row, diet):
    foods = str(row["food_sources"]).lower()
    score = 1.0

    if diet == "vegan":
        if any(x in foods for x in ANIMAL + DAIRY + EGGS):
            score *= 0.03
    elif diet == "veg":
        if any(x in foods for x in ANIMAL + EGGS):
            score *= 0.05
    elif diet == "eggetarian":
        if any(x in foods for x in ANIMAL):
            score *= 0.1

    if any(p in foods for p in PLANT_FOODS):
        score *= 1.2

    return score

def allergy_score(row, allergies):
    foods = str(row["food_sources"]).lower()
    score = 1.0
    for a in allergies:
        if a in ALLERGY_MAP:
            if any(w in foods for w in ALLERGY_MAP[a]):
                score *= 0.01
    return score

def get_feedback_multiplier(nutrient_name: str, feedback_map: dict) -> float:
    """
    ✅ FIXED: Pure multiplier function (no side effects)
    
    Returns:
    - 0.3 if feedback is negative (didn't work)
    - 2.0 if feedback is positive (worked)
    - 1.0 if no feedback
    """
    name = nutrient_name.lower()
    feedback_adjustment = feedback_map.get(name, 0)
    
    if feedback_adjustment < 0:
        # Didn't work: 70% penalty
        return 0.3
    elif feedback_adjustment > 0:
        # Worked: 100% boost
        return 2.0
    else:
        # No feedback
        return 1.0

# ============================================
# API
# ============================================
@app.post("/predict")
def predict(data: IssueRequest):
    """
    Main prediction endpoint with feedback-based personalization
    ✅ FIXED: Each request starts fresh from original data
    """
    
    user_id = data.userDetails.userId
    user_diet = data.userDetails.dietPreference.lower()
    user_allergies = [a.lower() for a in data.userDetails.allergies]

    print(f"\n{'='*60}")
    print(f"📊 NEW PREDICTION REQUEST for user: {user_id}")
    print(f"📝 Symptoms: {data.text}")
    print(f"{'='*60}")

    # ============================================
    # STEP 1: Fetch accumulated feedback from MongoDB
    # ============================================
    accumulated_feedback = fetch_user_feedback_from_db(user_id)
    print(f"📈 Accumulated feedback: {accumulated_feedback}")

    # ============================================
    # STEP 2: Merge with current request feedbacks
    # ============================================
    for feedback_item in data.feedbacks:
        nutrient_name = feedback_item.nutrientName.lower()
        accumulated_feedback[nutrient_name] = (
            accumulated_feedback.get(nutrient_name, 0) + feedback_item.scoreAdjustment
        )

    # ============================================
    # STEP 3: NLP - Semantic & Intent matching
    # ============================================
    query = expand(normalize(data.text))
    print(f"🔍 Normalized query: {query}")
    
    query_vec = vectorizer.transform([query])
    intent_vec = intent_vectorizer.transform([query])

    semantic_sim = cosine_similarity(query_vec, nutrient_vectors)[0]
    intent_sim = cosine_similarity(intent_vec, intent_vectors)[0]

    # ============================================
    # STEP 4: Create fresh copy of original data
    # ✅ CRITICAL: Always work with a fresh copy!
    # ============================================
    df_work = df_original.copy()
    df_work["semantic"] = semantic_sim
    df_work["intent"] = intent_sim

    # ============================================
    # STEP 5: Calculate scores
    # ============================================
    print(f"\n🎯 Calculating personalized scores...")
    
    def calculate_final_score(row):
        """
        Calculate final score with feedback multiplier
        """
        base_score = (
            0.55 * row["semantic"] +
            0.20 * row["intent"] +
            0.15 * diet_score(row, user_diet) * allergy_score(row, user_allergies)
        )
        
        # Get feedback multiplier for this nutrient
        multiplier = get_feedback_multiplier(row["name"], accumulated_feedback)
        
        # Apply multiplier
        final_score = base_score * multiplier
        
        return final_score
    
    df_work["final_score"] = df_work.apply(calculate_final_score, axis=1)

    # ============================================
    # STEP 6: Normalize scores
    # ============================================
    max_score = df_work["final_score"].max()
    if max_score > 0:
        df_work["final_score"] = (df_work["final_score"] / max_score) * 100

    df_work["final_score"] = df_work["final_score"].clip(upper=95)

    # ============================================
    # STEP 7: Get top 5 and log them
    # ============================================
    results = df_work.sort_values("final_score", ascending=False).head(5)
    
    print(f"\n📋 Top 5 Results for '{data.text}':")
    for idx, (_, r) in enumerate(results.iterrows(), 1):
        fb = accumulated_feedback.get(r['name'].lower(), 0)
        fb_status = "✅ Worked" if fb > 0 else "❌ Didn't work" if fb < 0 else "⭕ No feedback"
        print(f"   {idx}. {r['name']}: {r['final_score']:.2f}% [{fb_status}]")
    
    print(f"{'='*60}\n")

    return {
        "message": "Personalized ML recommendations (feedback-aware)",
        "recommendations": [
            {
                "name": r["name"],
                "type": r["type"],
                "description": r["description"],
                "food_sources": r["food_sources"],
                "confidence": round(r["final_score"], 2),
                "citation": r["citation"]
            }
            for _, r in results.iterrows()
        ]
    }

@app.get("/health")
def health_check():
    return {"status": "ML server is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)