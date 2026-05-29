import os, sys
from pathlib import Path

backend_dir = Path(__file__).parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

env_path = backend_dir / ".env"
if env_path.exists():
    from dotenv import load_dotenv
    load_dotenv(env_path)
    key = os.getenv("OPENAI_API_KEY", "").strip()
    if key and key != "your-openai-key-here":
        print(f"✅ Loaded .env — API key set: yes (Live AI Mode)")
    else:
        print("⚠️  .env found but no valid API key — running in demo mode")
else:
    print("⚠️  No .env file found — running in demo mode (dummy data)")

from routers import resume, match, questions, evaluate, memory

app = FastAPI(title="HireAI Agent API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router, prefix="/api")
app.include_router(match.router, prefix="/api")
app.include_router(questions.router, prefix="/api")
app.include_router(evaluate.router, prefix="/api")
app.include_router(memory.router, prefix="/api")

@app.get("/")
def root():
    key = os.getenv("OPENAI_API_KEY", "").strip()
    mode = "live" if key and key != "your-openai-key-here" else "demo"
    return {"status": "ok", "mode": mode}

@app.get("/health")
def health():
    key = os.getenv("OPENAI_API_KEY", "").strip()
    mode = "live" if key and key != "your-openai-key-here" else "demo"
    return {"status": "healthy", "mode": mode}