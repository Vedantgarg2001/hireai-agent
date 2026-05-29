# 🤖 HireAI Agent — Resume Screening & Interview Question Generator

A full-stack GenAI system with 5 modular agents: Resume Parser, JD Matcher, Q-Gen, Evaluator, and Memory Agent.

## ✨ Features
- 📄 Upload PDF/DOCX/TXT resumes or use sample candidates
- 🔍 AI-powered resume parsing into structured data
- 🎯 JD matching with 0–100 score and visual breakdown
- 💬 Personalized technical + behavioral interview questions
- 📊 LLM-based output evaluation with ratings
- 🧠 Agent memory log panel
- 🎭 **Full demo mode** — works without an API key

---

## 🗂 Project Structure
```
resume-agent/
├── frontend/          # React + Vite UI
│   └── src/
│       ├── pages/     # UploadPage, ParsedResumePage, JDMatchPage, QuestionsPage, EvaluatorPage
│       ├── components/ # Header, Sidebar, AgentMemoryPanel, Toast
│       ├── utils/     # api.js (with fallback logic)
│       └── data/      # dummyData.js (all fallback data)
└── backend/           # FastAPI
    ├── agents/        # resume_agent, matcher_agent, qgen_agent, evaluator_agent
    ├── routers/       # One router per agent
    └── models/        # Pydantic schemas
```

---

## 🚀 Quick Start

### 1. Start the Backend

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# (Optional) Add your OpenAI API key — app works without it
cp .env.example .env
# Edit .env and set OPENAI_API_KEY=sk-...

# Start server
uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000

### 2. Start the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: http://localhost:5173

---

## 🎭 Demo Mode

If no API key is set (or it's rate-limited), **all agents automatically fall back to rich demo data**. The app never crashes or shows "API limit reached". You'll see a "Demo Mode Active" badge in the header.

---

## 🏗 Agent Architecture

| Agent | Endpoint | Function |
|-------|----------|----------|
| Resume Extractor | `POST /api/parse-resume` | Parses resume → structured JSON |
| JD Matcher | `POST /api/match-jd` | Scores candidate vs JD (0–100) |
| Q-Gen Agent | `POST /api/generate-questions` | Generates technical + behavioral Qs |
| Evaluator Agent | `POST /api/evaluate` | LLM self-evaluation of outputs |
| Memory Agent | `GET/POST /api/memory/{id}` | Session-based agent log store |

---

## 📊 Evaluation Output

The app includes a manual rating table (interactive stars) and LLM-based scoring across:
- Question Quality
- JD Alignment  
- Diversity Score

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite |
| Styling | Pure CSS (custom design system) |
| Backend | FastAPI + Uvicorn |
| LLM | OpenAI GPT-4o-mini (with fallback) |
| Memory | In-memory session store |
