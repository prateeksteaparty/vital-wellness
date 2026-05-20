# Vital – Smart Supplement & Nutrition Recommendation System

![Project Banner](https://img.shields.io/badge/AI-Powered-green)
![React](https://img.shields.io/badge/Frontend-React.js-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-orange)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-success)

---

# 📌 Project Overview

**Vital – Smart Supplement & Nutrition Recommendation System** is an AI-powered web application developed to provide personalized supplement and nutrition recommendations based on user health conditions, lifestyle, allergies, dietary preferences, and wellness goals.

The system combines **Machine Learning (ML)** and **Natural Language Processing (NLP)** techniques to analyze user symptoms entered in natural language and generate intelligent recommendations.

This project was developed as a **Final Year Bachelor of Engineering Project** for the Department of Computer Engineering under Savitribai Phule Pune University.

---

# 🎯 Objectives

The primary objectives of the project are:

- To provide personalized supplement and nutrition recommendations
- To process free-text symptom descriptions using NLP
- To implement TF-IDF vectorization and cosine similarity
- To apply allergy and diet-based safety filtering
- To improve recommendations using feedback mechanisms
- To build a scalable AI-based healthcare recommendation platform

---

# 🚀 Features

## ✅ User Features

- User Registration & Login
- Health Profile Management
- Symptom Input in Natural Language
- Personalized Recommendation Generation
- Saved Recommendations
- Feedback Submission
- Recommendation History Tracking

## ✅ AI & ML Features

- NLP-based text preprocessing
- TF-IDF Vectorization
- Cosine Similarity Matching
- Rule-Based Safety Filtering
- Feedback-Based Recommendation Adjustment
- Personalized Ranking System

## ✅ System Features

- REST API Architecture
- Secure MongoDB Storage
- FastAPI ML Service
- Responsive UI using TailwindCSS
- Modular Full-Stack Architecture

---

# 🧠 Technologies Used

| Category | Technology |
|---|---|
| Frontend | React.js, TailwindCSS, Vite |
| Backend | Node.js, Express.js |
| Machine Learning | Python, FastAPI |
| Database | MongoDB Atlas |
| NLP Techniques | TF-IDF, Cosine Similarity |
| Version Control | Git & GitHub |
| API Testing | Postman |

---

# 🏗️ System Architecture

The system follows a **Three-Tier Architecture**:

```text
Frontend (React.js)
        ↓
Backend API (Node.js + Express.js)
        ↓
ML Recommendation Engine (FastAPI + Python)
        ↓
MongoDB Atlas Database
```

## Architecture Modules

### 1. Frontend Layer
- User interaction
- Symptom forms
- Recommendation dashboard

### 2. Backend Layer
- Authentication
- API communication
- Data handling

### 3. Machine Learning Layer
- NLP preprocessing
- Similarity computation
- Recommendation ranking

### 4. Database Layer
- User profiles
- Feedback storage
- Saved recommendations

---

# ⚙️ Working Process

## Step-by-Step Workflow

1. User logs into the system
2. User enters symptoms and health details
3. Backend sends data to FastAPI service
4. NLP preprocessing is applied
5. TF-IDF vectors are generated
6. Cosine similarity is calculated
7. Diet and allergy filters are applied
8. Feedback adjustment modifies ranking
9. Top recommendations are returned
10. Results are stored in MongoDB
11. Recommendations are displayed to user

---

# 🔬 Machine Learning & NLP

## Text Processing Pipeline

- Text Normalization
- Tokenization
- Synonym Expansion
- TF-IDF Vectorization
- Cosine Similarity Matching

## Recommendation Formula

```math
Score =
0.55 × SemanticSimilarity +
0.20 × IntentSimilarity +
0.15 × (DietScore × AllergyScore)
```

The final recommendation score is adjusted using:
- User feedback
- Dietary preferences
- Allergy constraints

---

# 🗂️ Database Collections

## users
Stores:
- Name
- Email
- Gender
- Diet Preference
- Allergies

## savedrecommendations
Stores:
- User recommendations
- Confidence scores
- Recommendation history

## feedbacks
Stores:
- User feedback
- Score adjustments
- Learning improvements

---

# 📂 Project Structure

```bash
Vital/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── assets/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
│
├── ml-service/
│   ├── ml_server.py
│   ├── recommendation_engine.py
│   └── datasets/
│
├── database/
│
├── screenshots/
│
├── README.md
└── package.json
```

---

# 🛠️ Installation Guide

## Prerequisites

Make sure the following are installed:

- Node.js
- Python 3.x
- MongoDB
- Git

---

# ⚡ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# ⚡ Backend Setup

```bash
cd backend
npm install
npm start
```

Backend runs on:

```bash
http://localhost:3000
```

---

# ⚡ ML Service Setup

```bash
cd ml-service
pip install -r requirements.txt
uvicorn ml_server:app --reload
```

ML Service runs on:

```bash
http://localhost:8000
```

---

# 🌐 Environment Variables

Create a `.env` file inside backend directory.

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
ML_SERVICE_URL=http://localhost:8000
```

---

# 📊 Sample Input & Output

## Input Symptoms

```text
Fatigue, Weakness
```

## Generated Recommendation

```text
- Iron
- Vitamin B12
- Magnesium
```

---

# 🧪 Testing

The project includes:

- Unit Testing
- Integration Testing
- Functional Testing
- Validation Testing
- API Testing using Postman

## Sample Test Cases

| Test Case | Expected Result |
|---|---|
| Empty symptom input | Validation error |
| Dairy allergy | Dairy-based recommendations removed |
| Invalid login | Login failed message |
| Fatigue symptoms | Iron & Vitamin B12 suggested |

---

# 🔐 Security Features

- JWT Authentication
- Secure Password Storage
- Input Validation
- API Error Handling
- MongoDB Atlas Cloud Security

---

# 📈 Future Enhancements

- Wearable Device Integration
- Real-Time Health Monitoring
- Advanced Deep Learning Models
- Voice-Based Symptom Input
- Mobile Application
- Doctor Consultation Integration

---

# ⚠️ Disclaimer

This system is designed for educational and recommendation purposes only.

It does **NOT** replace professional medical advice, diagnosis, or treatment. Users should consult healthcare professionals before taking supplements or making health decisions.

---

# 👨‍💻 Authors

### Project Team

- Pratik Shinde
- Om Sonawane
- Ankit Patil
- Pankaj Binnar

### Guide

**Prof. Anmol Budhewar**

Department of Computer Engineering  
Sandip Institute of Technology and Research Center, Nashik

---

# 📚 References

- Research papers on AI-based Nutrition Recommendation Systems
- TF-IDF & Cosine Similarity Algorithms
- FastAPI Documentation
- MongoDB Atlas Documentation
- React.js Documentation

---

# ⭐ Conclusion

The **Vital – Smart Supplement & Nutrition Recommendation System** successfully demonstrates the integration of Artificial Intelligence, Machine Learning, and Natural Language Processing in healthcare recommendation systems.

The platform provides personalized, intelligent, and safe supplement recommendations while maintaining scalability, usability, and modular architecture suitable for future expansion.

---

# 📄 License

This project is developed for academic and educational purposes as a Final Year Engineering Project.

---
