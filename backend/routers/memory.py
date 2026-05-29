"""Memory Router — simple in-memory session store for agent logs."""

from fastapi import APIRouter
from typing import Dict, List

router = APIRouter()

# In-memory store: session_id → list of log entries
_store: Dict[str, List[dict]] = {}


@router.get("/memory/{session_id}")
async def get_memory(session_id: str):
    return _store.get(session_id, [])


@router.post("/memory/{session_id}")
async def add_memory(session_id: str, entry: dict):
    if session_id not in _store:
        _store[session_id] = []
    _store[session_id].append(entry)
    return {"ok": True}


@router.delete("/memory/{session_id}")
async def clear_memory(session_id: str):
    _store.pop(session_id, None)
    return {"ok": True}
