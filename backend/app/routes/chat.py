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
    
    # Extract goal/intent directly from the question
    question_lower = request.question.lower()
    stopwords = {"i", "want", "to", "become", "a", "an", "the", "in", "and", "have", "know", "per", "week", "hours", "hour", "my", "is", "for", "with", "get", "what", "which", "how", "are", "help", "related"}
    words = [w.strip("?,.!") for w in question_lower.split() if w.strip("?,.!")]
    keywords = [w for w in words if w not in stopwords and len(w) > 2]
    
    inferred_goal = " ".join(keywords) if keywords else profile_data.get("goal", "AI Engineer")
    
    student = StudentProfile(
        goal=inferred_goal,
        interests=profile_data.get("interests", []) + [k.capitalize() for k in keywords],
        skills=profile_data.get("skills", []),
        available_hours_per_week=float(profile_data.get("available_hours_per_week", 6.0))
    )

    # Genie response
    genie_resp = await genie_service.ask_genie(request.question, request.student_profile)

    # Structured recommendations matching the student's question/inferred goal
    recommendations = (await recommendation_service.get_recommendations(student))[:4]

    return {
        "answer": genie_resp["answer"],
        "recommendations": [rec.model_dump() for rec in recommendations],
        "conversation_id": genie_resp["conversation_id"],
        "sources": genie_resp["sources"],
        "query_executed": genie_resp.get("query_executed")
    }
