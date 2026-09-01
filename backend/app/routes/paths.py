from typing import Optional, Dict, Any, List
from fastapi import APIRouter
from pydantic import BaseModel
from app.models.student import StudentProfile
from app.services.path_service import path_service

router = APIRouter(prefix="/api/path", tags=["paths"])

class PathRequest(BaseModel):
    goal: Optional[str] = "AI Engineer"
    available_hours: Optional[float] = 6.0
    skills: Optional[List[str]] = ["Python"]
    interests: Optional[List[str]] = ["AI", "Machine Learning"]

@router.post("")
async def generate_path_endpoint(request: PathRequest):
    student = StudentProfile(
        goal=request.goal or "AI Engineer",
        available_hours_per_week=request.available_hours or 6.0
    )
    paths = path_service.generate_paths_for_student(student)
    return {
        "paths": [p.model_dump() for p in paths]
    }
