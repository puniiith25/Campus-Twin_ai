import pytest
from app.models.student import StudentProfile
from app.services.path_service import path_service

def test_time_constraint_golden_scenario():
    profile = StudentProfile(
        goal="AI Engineer",
        available_hours_per_week=6.0
    )

    paths = path_service.generate_paths_for_student(profile)
    assert len(paths) >= 2
    for path in paths:
        assert path.total_hours_per_week <= profile.available_hours_per_week
        assert path.within_limit is True
