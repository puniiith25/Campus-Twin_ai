from typing import List, Optional
from pydantic import BaseModel, Field

class StudentSkill(BaseModel):
    name: str
    level: str = "Intermediate"  # Beginner, Intermediate, Advanced

class StudentProfile(BaseModel):
    student_id: str = "demo_student_01"
    name: str = "Alex Morgan"
    goal: str = "AI Engineer"
    interests: List[str] = Field(default_factory=lambda: ["AI", "Machine Learning", "Research"])
    skills: List[StudentSkill] = Field(default_factory=lambda: [StudentSkill(name="Python", level="Intermediate")])
    available_hours_per_week: float = 6.0
    preferred_opportunity_types: List[str] = Field(default_factory=list)
    career_interest_weight: float = 0.4
    research_interest_weight: float = 0.3
    networking_interest_weight: float = 0.3
