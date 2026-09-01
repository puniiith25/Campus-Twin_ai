from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from app.models.opportunity import OpportunityItem
from app.models.path import CampusPath

class RecommendationRequest(BaseModel):
    goal: str
    skills: List[str] = ["Python"]
    available_hours: float = 6.0
    interests: List[str] = ["AI", "Machine Learning"]

class RecommendationResponse(BaseModel):
    goal: str
    available_hours: float
    recommendations: List[OpportunityItem]
    paths: List[CampusPath] = []
    summary: str = ""
