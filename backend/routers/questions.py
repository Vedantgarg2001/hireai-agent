from fastapi import APIRouter
from models.schemas import QGenRequest
from agents.qgen_agent import generate_questions

router = APIRouter()


@router.post("/generate-questions")
async def generate_questions_endpoint(req: QGenRequest):
    return generate_questions(req.resume, req.jd, req.match or {})
