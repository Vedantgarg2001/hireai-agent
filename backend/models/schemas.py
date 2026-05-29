from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class MatchRequest(BaseModel):
    resume: Dict[str, Any]
    jd: str


class QGenRequest(BaseModel):
    resume: Dict[str, Any]
    jd: str
    match: Optional[Dict[str, Any]] = None


class EvaluateRequest(BaseModel):
    resume: Optional[Dict[str, Any]] = None
    jd: Optional[str] = None
    questions: Optional[Dict[str, Any]] = None
