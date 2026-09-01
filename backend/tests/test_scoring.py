import pytest
from app.models.student import StudentProfile, StudentSkill
from app.services.scoring_service import scoring_service

def test_calculate_score_excellent_match():
    profile = StudentProfile(
        goal="AI Engineer",
        skills=[StudentSkill(name="Python", level="Intermediate")],
        available_hours_per_week=6.0,
        interests=["AI", "Machine Learning"]
    )
    item = {
        "name": "Introduction to Artificial Intelligence",
        "description": "Core AI and machine learning fundamentals using Python",
        "skills": "Python|Machine Learning",
        "hours_per_week": 3.0,
        "type": "Course"
    }

    score, label, reasons = scoring_service.calculate_score(item, profile)
    assert score >= 75.0
    assert label in ("Strong Match", "Excellent Match")
    assert len(reasons) > 0

def test_calculate_score_time_penalty():
    profile = StudentProfile(
        goal="AI Engineer",
        skills=[StudentSkill(name="Python", level="Intermediate")],
        available_hours_per_week=4.0
    )
    item = {
        "name": "Heavy Machine Learning Bootcamp",
        "description": "Intensive ML course",
        "skills": "Python|Machine Learning",
        "hours_per_week": 10.0,
        "type": "Course"
    }

    score, label, reasons = scoring_service.calculate_score(item, profile)
    assert any("exceeds" in r for r in reasons)
