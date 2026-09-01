from fastapi import APIRouter
from app.models.student import StudentProfile

router = APIRouter(prefix="/api/profile", tags=["profile"])

# In-memory session store for MVP profile
_current_profile = StudentProfile()

@router.get("", response_model=StudentProfile)
async def get_profile():
    return _current_profile

@router.post("", response_model=StudentProfile)
async def update_profile(profile: StudentProfile):
    global _current_profile
    _current_profile = profile
    return _current_profile
