from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from app.models.path import CampusPath

class WhatIfScenario(BaseModel):
    operation: str  # REMOVE, REPLACE, ADD, REDUCE_TIME, INCREASE_TIME, CHANGE_GOAL
    target: Optional[str] = None  # Step name or ID to remove/replace
    replacement_type: Optional[str] = None  # e.g. "Research", "Networking", "Industry"
    new_time_limit: Optional[float] = None
    new_goal: Optional[str] = None

class WhatIfRequest(BaseModel):
    base_path_id: Optional[str] = "path_career_focus"
    custom_base_path: Optional[CampusPath] = None
    scenario: WhatIfScenario
    student_profile: Optional[Dict[str, Any]] = None

class PathDiff(BaseModel):
    removed_step: Optional[str] = None
    added_step: Optional[str] = None
    hour_change: float = 0.0
    score_change: float = 0.0

class MetricComparison(BaseModel):
    metric_name: str
    original_val: float
    alternative_val: float
    delta: float

class WhatIfResponse(BaseModel):
    original_path: CampusPath
    alternative_path: CampusPath
    changes: List[str] = Field(default_factory=list)
    metric_comparisons: List[MetricComparison] = Field(default_factory=list)
    trade_offs: List[str] = Field(default_factory=list)
    explanation: str = ""
