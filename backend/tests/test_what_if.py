import pytest
from app.models.what_if import WhatIfRequest, WhatIfScenario
from app.services.what_if_service import what_if_service

def test_what_if_replace_ai_club_with_research():
    req = WhatIfRequest(
        base_path_id="path_career_focus",
        scenario=WhatIfScenario(
            operation="REPLACE",
            target="AI Club",
            replacement_type="Research"
        )
    )

    resp = what_if_service.execute_scenario(req)
    assert resp.original_path is not None
    assert resp.alternative_path is not None
    assert len(resp.changes) > 0
    assert resp.alternative_path.metrics.research_exposure > resp.original_path.metrics.research_exposure
    assert resp.alternative_path.total_hours_per_week <= 6.0

def test_what_if_reduce_hours():
    req = WhatIfRequest(
        base_path_id="path_career_focus",
        scenario=WhatIfScenario(
            operation="REDUCE_TIME",
            new_time_limit=4.0
        )
    )

    resp = what_if_service.execute_scenario(req)
    assert resp.alternative_path.total_hours_per_week <= 4.0
