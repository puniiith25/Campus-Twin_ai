import os
import asyncio
from typing import List, Dict, Any
from app.models.student import StudentProfile
from app.models.opportunity import OpportunityItem
from app.services.scoring_service import scoring_service
from app.services.databricks_service import databricks_service

class RecommendationService:
    async def get_recommendations(self, student_profile: StudentProfile) -> List[OpportunityItem]:
        all_items = []

        courses_query = "SELECT * FROM campus_twin.campus.courses"
        clubs_query = "SELECT * FROM campus_twin.campus.clubs"
        events_query = "SELECT * FROM campus_twin.campus.events"
        research_query = "SELECT * FROM campus_twin.campus.research_projects"
        opps_query = "SELECT * FROM campus_twin.campus.opportunities"

        results = await asyncio.gather(
            databricks_service.execute_sql(courses_query),
            databricks_service.execute_sql(clubs_query),
            databricks_service.execute_sql(events_query),
            databricks_service.execute_sql(research_query),
            databricks_service.execute_sql(opps_query),
            return_exceptions=True
        )

        courses, clubs, events, research, opps = [], [], [], [], []
        if not isinstance(results[0], Exception): courses = results[0]
        if not isinstance(results[1], Exception): clubs = results[1]
        if not isinstance(results[2], Exception): events = results[2]
        if not isinstance(results[3], Exception): research = results[3]
        if not isinstance(results[4], Exception): opps = results[4]

        # Parse courses
        for row in courses:
            all_items.append({
                "id": row.get("course_id", ""),
                "name": row.get("course_name", ""),
                "type": "Course",
                "description": row.get("description", ""),
                "hours_per_week": float(row.get("hours_per_week", 3) or 3),
                "skills": row.get("skills", ""),
                "prerequisites": [p.strip() for p in str(row.get("prerequisites") or "").split("|") if p.strip() and p.strip() != "None"],
                "difficulty": row.get("difficulty", "Intermediate"),
                "category_or_department": row.get("department", ""),
                "faculty_or_organizer": row.get("faculty_id", "")
            })

        # Parse clubs
        for row in clubs:
            all_items.append({
                "id": row.get("club_id", ""),
                "name": row.get("club_name", ""),
                "type": "Club",
                "description": row.get("description", ""),
                "hours_per_week": float(row.get("hours_per_week", 2) or 2),
                "skills": row.get("skills", ""),
                "prerequisites": [],
                "difficulty": "All Levels",
                "category_or_department": row.get("category", "")
            })

        # Parse events
        for row in events:
            all_items.append({
                "id": row.get("event_id", ""),
                "name": row.get("event_name", ""),
                "type": row.get("event_type", "Event") or "Event",
                "description": row.get("description", ""),
                "hours_per_week": float(row.get("duration_hours", 2) or 2),
                "skills": row.get("skills", ""),
                "prerequisites": [],
                "difficulty": "Open",
                "faculty_or_organizer": row.get("organizer", "")
            })

        # Parse research projects
        for row in research:
            all_items.append({
                "id": row.get("research_id", ""),
                "name": row.get("title", ""),
                "type": "Research Project",
                "description": row.get("description", ""),
                "hours_per_week": float(row.get("hours_per_week", 5) or 5),
                "skills": row.get("skills", ""),
                "prerequisites": [p.strip() for p in str(row.get("prerequisites") or "").split("|") if p.strip() and p.strip() != "None"],
                "difficulty": row.get("difficulty", "Advanced"),
                "category_or_department": row.get("department", ""),
                "faculty_or_organizer": row.get("faculty", "")
            })

        # Parse opportunities
        for row in opps:
            all_items.append({
                "id": row.get("opportunity_id", ""),
                "name": row.get("title", ""),
                "type": row.get("type", "Opportunity") or "Opportunity",
                "description": row.get("description", ""),
                "hours_per_week": float(row.get("hours_per_week", 10) or 10),
                "skills": row.get("skills", ""),
                "prerequisites": [p.strip() for p in str(row.get("prerequisites") or "").split("|") if p.strip() and p.strip() != "None"],
                "difficulty": "Selective",
                "category_or_department": row.get("career_domains", ""),
                "faculty_or_organizer": row.get("organization", "")
            })

        # Score all items
        scored_opps = []
        for raw in all_items:
            score, label, reasons = scoring_service.calculate_score(raw, student_profile)
            skills_list = [s.strip() for s in str(raw.get("skills") or "").split("|") if s.strip()]
            
            scored_opps.append(OpportunityItem(
                id=raw["id"],
                name=raw["name"],
                type=raw["type"],
                description=raw["description"],
                hours_per_week=raw["hours_per_week"],
                skills_developed=skills_list,
                prerequisites=raw["prerequisites"],
                difficulty=raw["difficulty"],
                score=score,
                match_reasons=reasons,
                category_or_department=raw.get("category_or_department"),
                faculty_or_organizer=raw.get("faculty_or_organizer")
            ))

        # Sort by score descending
        scored_opps.sort(key=lambda x: x.score, reverse=True)
        return scored_opps

recommendation_service = RecommendationService()
