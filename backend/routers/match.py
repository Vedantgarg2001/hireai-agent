from fastapi import APIRouter
from models.schemas import MatchRequest
from agents.matcher_agent import match_jd

router = APIRouter()


@router.post("/match-jd")
async def match_jd_endpoint(req: MatchRequest):
    return match_jd(req.resume, req.jd)
