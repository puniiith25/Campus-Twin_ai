from typing import Optional, Dict, Any
from fastapi import APIRouter
from pydantic import BaseModel
from app.models.path import CampusPath
from app.models.student import StudentProfile
from app.services.compare_service import compare_service
from app.services.path_service import path_service

router = APIRouter(prefix="/api/compare", tags=["compare"])

class CompareRequest(BaseModel):
    path_a: Optional[CampusPath] = None
    path_b: Optional[CampusPath] = None
    student_profile: Optional[Dict[str, Any]] = None

@router.post("")
async def compare_endpoint(request: CompareRequest):
    student = StudentProfile()
    if request.student_profile:
        student = StudentProfile(
            goal=request.student_profile.get("goal", "AI Engineer"),
            available_hours_per_week=float(request.student_profile.get("available_hours_per_week", 6.0))
        )

    # Use default paths if not provided
    default_paths = path_service.generate_paths_for_student(student)
    path_a = request.path_a or default_paths[0]
    path_b = request.path_b or default_paths[1]

    return compare_service.compare_paths(path_a, path_b, student)
