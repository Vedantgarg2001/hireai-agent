from fastapi import APIRouter
from models.schemas import EvaluateRequest
from agents.evaluator_agent import evaluate_output

router = APIRouter()


@router.post("/evaluate")
async def evaluate(req: EvaluateRequest):
    return evaluate_output(req.resume or {}, req.jd or "", req.questions or {})
