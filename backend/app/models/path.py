from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class PathStep(BaseModel):
    step_id: str
    type: str  # Course, Workshop, Club, Hackathon, Research, Opportunity
    name: str
    description: str
    hours_per_week: float
    duration: str
    skills: List[str] = []
    reason: str
    prerequisites: List[str] = []
    dependencies: List[str] = []

class PathMetrics(BaseModel):
    goal_alignment: float = 0.0
    research_exposure: float = 0.0
    networking_value: float = 0.0
    industry_exposure: float = 0.0
    project_experience: float = 0.0
    faculty_interaction: float = 0.0
    overall_score: float = 0.0

class CampusPath(BaseModel):
    path_id: str
    title: str
    focus_type: str  # Career Focus, Research Focus, Skill Focus, Networking Focus, Entrepreneurship Focus
    description: str
    goal: str
    steps: List[PathStep] = Field(default_factory=list)
    total_hours_per_week: float = 0.0
    available_hours_per_week: float = 6.0
    within_limit: bool = True
    skills_gained: List[str] = Field(default_factory=list)
    metrics: PathMetrics = Field(default_factory=PathMetrics)
    explanation: str = ""
