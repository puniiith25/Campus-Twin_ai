from typing import List, Optional
from pydantic import BaseModel

class OpportunityItem(BaseModel):
    id: str
    name: str
    type: str  # Course, Club, Event, Research, Opportunity, Facility, CityEvent
    description: str
    hours_per_week: float
    skills_developed: List[str] = []
    prerequisites: List[str] = []
    difficulty: str = "Intermediate"
    score: float = 0.0
    match_reasons: List[str] = []
    category_or_department: Optional[str] = None
    faculty_or_organizer: Optional[str] = None
    location: Optional[str] = None
