# Vital – Smart Supplement & Nutrition Recommendation System

![Project Banner](https://img.shields.io/badge/AI-Powered-green)
![React](https://img.shields.io/badge/Frontend-React.js-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-orange)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-success)

---

# 📌 Project Overview

**Vital – Smart Supplement & Nutrition Recommendation System** is an AI-powered web application developed to provide personalized supplement and nutrition recommendations based on user health conditions, lifestyle, allergies, dietary preferences, and wellness goals.

The system uses **Machine Learning (ML)** and **Natural Language Processing (NLP)** techniques to analyze user symptoms entered in natural language and generate intelligent recommendations.

This project was developed as a **Final Year Bachelor of Engineering Project** under the Department of Computer Engineering, Savitribai Phule Pune University.

---

# 🎯 Objectives

The main objectives of the project are:

- Provide personalized supplement and nutrition recommendations
- Process free-text symptoms using NLP
- Implement TF-IDF vectorization and cosine similarity
- Apply allergy and diet-based safety filtering
- Improve recommendations using feedback mechanisms
- Build a scalable AI-powered healthcare recommendation platform

---

# 🚀 Features

## ✅ User Features

- User Registration & Login
- Health Profile Management
- Symptom Input in Natural Language
- Personalized Recommendation Generation
- Saved Recommendations
- Recommendation History
- Feedback Submission

---

## ✅ AI & ML Features

- NLP-based Text Processing
- TF-IDF Vectorization
- Cosine Similarity Matching
- Rule-Based Safety Filtering
- Feedback-Based Recommendation Adjustment
- Personalized Recommendation Ranking

---

## ✅ System Features

- REST API Architecture
- Secure MongoDB Storage
- FastAPI ML Service
- Responsive UI with TailwindCSS
- Dockerized Deployment
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
| Deployment | Docker, Docker Compose |
| Version Control | Git & GitHub |
| API Testing | Postman |

---

# 🏗️ System Architecture

The project follows a **Three-Tier Architecture**:

```text
Frontend (React.js + Vite)
            ↓
Backend API (Node.js + Express.js)
            ↓
ML Recommendation Service (FastAPI + Python)
            ↓
MongoDB Atlas Database
```

---

# ⚙️ Workflow

## System Execution Flow

1. User logs into the platform
2. User enters symptoms and health details
3. Frontend sends data to backend API
4. Backend forwards request to FastAPI ML service
5. NLP preprocessing is performed
6. TF-IDF vectors are generated
7. Cosine similarity is calculated
8. Diet and allergy filters are applied
9. Feedback adjustment modifies scores
10. Top recommendations are generated
11. Results are stored in MongoDB
12. Final recommendations are displayed to the user

---

# 🔬 Machine Learning & NLP

## NLP Pipeline

- Text Normalization
- Tokenization
- Synonym Expansion
- TF-IDF Vectorization
- Cosine Similarity Matching

---

## Recommendation Formula

```math
Score =
0.55 × SemanticSimilarity +
0.20 × IntentSimilarity +
0.15 × (DietScore × AllergyScore)
```

The final recommendation score is further adjusted using:

- User feedback
- Allergy constraints
- Dietary preferences

---

# 📂 Project Structure

```bash
Vital-Smart-Supplement-Recommendation-System/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   ├── server.js
│   └── .env
│
├── frontend/
│   └── vite-project/
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── assets/
│       │   ├── App.jsx
│       │   └── main.jsx
│       │
│       ├── public/
│       ├── package.json
│       ├── vite.config.js
│       └── tailwind.config.js
│
├── model/
│   ├── ml_server.py
│   ├── recommendation_engine.py
│   ├── requirements.txt
│   ├── datasets/
│   └── trained_models/
│
├── .gitignore
├── README.md
├── docker-compose.yml
└── runtime.txt
```

---

# 📌 Folder Description

## 🔹 backend/

Contains backend server logic built using:

- Node.js
- Express.js

Responsibilities:

- API Routes
- Authentication
- Database Communication
- User Management
- Recommendation APIs

---

## 🔹 frontend/vite-project/

Contains frontend application built using:

- React.js
- Vite
- TailwindCSS

Responsibilities:

- User Interface
- Forms & Inputs
- Dashboard
- Recommendation Display

---

## 🔹 model/

Contains Machine Learning & NLP recommendation engine built using:

- Python
- FastAPI
- TF-IDF
- Cosine Similarity

Responsibilities:

- Symptom Processing
- Recommendation Generation
- Similarity Computation
- NLP Operations

---

## 🔹 docker-compose.yml

Used for containerized deployment of frontend, backend, and ML services.

---

## 🔹 runtime.txt

Specifies runtime environment version for deployment platforms.

---

# 🗂️ Database Collections

## users

Stores:

- User profile information
- Gender
- Allergies
- Diet preferences

---

## savedrecommendations

Stores:

- Generated recommendations
- Confidence scores
- Recommendation history

---

## feedbacks

Stores:

- User feedback
- Recommendation adjustments
- Learning improvements

---

# 🛠️ Installation Guide

## Prerequisites

Install the following before setup:

- Node.js
- Python 3.x
- MongoDB Atlas Account
- Git
- Docker (Optional)

---

# ⚡ Frontend Setup

```bash
cd frontend/vite-project
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
cd model
pip install -r requirements.txt
uvicorn ml_server:app --reload
```

ML Service runs on:

```bash
http://localhost:8000
```

---

# 🌐 Environment Variables

Create a `.env` file inside the backend folder.

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
ML_SERVICE_URL=http://localhost:8000
```

---

# 🐳 Docker Deployment

Run the complete project using Docker Compose:

```bash
docker-compose up --build
```

---

# 📊 Sample Input & Output

## Input Symptoms

```text
Fatigue, Weakness
```

## Generated Recommendations

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

---

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
- Deep Learning Recommendation Models
- Voice-Based Symptom Input
- Mobile Application
- Doctor Consultation Integration

---

# ⚠️ Disclaimer

This system is designed for educational and recommendation purposes only.

It does **NOT** replace professional medical advice, diagnosis, or treatment. Users should consult healthcare professionals before taking supplements or making health-related decisions.

---

# 👨‍💻 Authors

## Project Team

- Pratik Shinde
- Om Sonawane
- Ankit Patil
- Pankaj Binnar

---

## Project Guide

**Prof. Anmol Budhewar**

Department of Computer Engineering  
Sandip Institute of Technology and Research Center, Nashik

---

# 📚 References

- Research Papers on AI-based Nutrition Recommendation Systems
- TF-IDF & Cosine Similarity Algorithms
- FastAPI Documentation
- MongoDB Atlas Documentation
- React.js Documentation

---

# ⭐ Conclusion

The **Vital – Smart Supplement & Nutrition Recommendation System** demonstrates the integration of Artificial Intelligence, Machine Learning, and Natural Language Processing in healthcare recommendation systems.

The platform provides intelligent, personalized, and safe supplement recommendations while maintaining scalability, usability, and modular architecture suitable for future enhancements.

---

# 📄 License

This project is developed for academic and educational purposes as a Final Year Engineering Project.

---
