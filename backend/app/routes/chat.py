from typing import Optional, Dict, Any, List
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.genie_service import genie_service
from app.services.recommendation_service import recommendation_service
from app.models.student import StudentProfile

router = APIRouter(prefix="/api/chat", tags=["chat"])

class ChatRequest(BaseModel):
    question: str
    student_profile: Optional[Dict[str, Any]] = None
    conversation_id: Optional[str] = None

@router.post("")
async def chat_endpoint(request: ChatRequest):
    # Parse profile
    profile_data = request.student_profile or {}
    student = StudentProfile(
        goal=profile_data.get("goal", "AI Engineer"),
        available_hours_per_week=float(profile_data.get("available_hours_per_week", 6.0))
    )

    # Genie response
    genie_resp = await genie_service.ask_genie(request.question, request.student_profile)

    # Structured recommendations
    recommendations = (await recommendation_service.get_recommendations(student))[:4]

    return {
        "answer": genie_resp["answer"],
        "recommendations": [rec.model_dump() for rec in recommendations],
        "conversation_id": genie_resp["conversation_id"],
        "sources": genie_resp["sources"],
        "query_executed": genie_resp.get("query_executed")
    }
