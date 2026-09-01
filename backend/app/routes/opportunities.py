from typing import Optional, List
from fastapi import APIRouter, Query, HTTPException
from app.models.student import StudentProfile
from app.models.opportunity import OpportunityItem
from app.services.recommendation_service import recommendation_service

router = APIRouter(prefix="/api/opportunities", tags=["opportunities"])

@router.get("", response_model=List[OpportunityItem])
async def list_opportunities(
    type: Optional[str] = Query(None),
    skill: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    max_hours: Optional[float] = Query(None)
):
    student = StudentProfile()
    all_opps = await recommendation_service.get_recommendations(student)

    filtered = []
    for opp in all_opps:
        if type and type.lower() not in opp.type.lower():
            continue
        if skill and not any(skill.lower() in s.lower() for s in opp.skills_developed):
            continue
        if difficulty and difficulty.lower() not in opp.difficulty.lower():
            continue
        if max_hours and opp.hours_per_week > max_hours:
            continue
        filtered.append(opp)

    return filtered

@router.get("/{id}", response_model=OpportunityItem)
async def get_opportunity_detail(id: str):
    student = StudentProfile()
    all_opps = await recommendation_service.get_recommendations(student)
    for opp in all_opps:
        if opp.id.lower() == id.lower():
            return opp
    raise HTTPException(status_code=404, detail=f"Opportunity '{id}' not found")
