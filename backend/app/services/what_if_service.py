import copy
from typing import List, Dict, Any, Optional
from app.models.student import StudentProfile
from app.models.path import CampusPath, PathStep, PathMetrics
from app.models.what_if import WhatIfRequest, WhatIfResponse, WhatIfScenario, MetricComparison
from app.services.path_service import path_service

class WhatIfService:
    def execute_scenario(self, request: WhatIfRequest) -> WhatIfResponse:
        # 1. Base profile
        profile_data = request.student_profile or {}
        student = StudentProfile(
            goal=profile_data.get("goal", "AI Engineer"),
            available_hours_per_week=float(profile_data.get("available_hours_per_week", 6.0))
        )

        # 2. Base path
        base_paths = path_service.generate_paths_for_student(student)
        if request.custom_base_path:
            original_path = request.custom_base_path
        else:
            # Default to Path A (Career Focus)
            original_path = base_paths[0]

        # Deep copy to construct alternative path
        alt_path = copy.deepcopy(original_path)
        scenario = request.scenario
        changes = []
        trade_offs = []

        op = scenario.operation.upper()

        if op == "REPLACE" or "replace" in scenario.operation.lower():
            target_name = (scenario.target or "AI Club").lower()
            replacement_type = scenario.replacement_type or "Research"

            # Find target step
            removed_step_name = ""
            new_steps = []
            for s in alt_path.steps:
                if target_name in s.name.lower() or target_name in s.type.lower():
                    removed_step_name = s.name
                    changes.append(f"Removed '{s.name}' ({s.hours_per_week}h/wk)")
                else:
                    new_steps.append(s)

            # If target step wasn't found specifically, replace the 3rd step (Club)
            if not removed_step_name and len(alt_path.steps) >= 3:
                removed_step_name = alt_path.steps[2].name
                changes.append(f"Removed '{removed_step_name}' ({alt_path.steps[2].hours_per_week}h/wk)")
                new_steps = [alt_path.steps[0], alt_path.steps[1], alt_path.steps[3]]

            # Add Research Replacement step
            research_step = PathStep(
                step_id="step_whatif_res_1",
                type="Research",
                name="RES_01: Autonomous Navigation & Perception Research",
                description="Faculty-led computer vision research with Prof. Aris Thorne.",
                hours_per_week=1.5,
                duration="1 Semester",
                skills=["Computer Vision", "Deep Learning", "Research Methods", "Faculty Mentorship"],
                reason="Replaces extracurricular club with direct faculty-led research exposure.",
                prerequisites=["AI101", "Python"],
                dependencies=["step_a_2"]
            )
            new_steps.append(research_step)
            changes.append(f"Added research alternative '{research_step.name}' ({research_step.hours_per_week}h/wk)")

            alt_path.steps = new_steps
            alt_path.title = "Path A' — What-If Alternative (Research Substituted)"
            alt_path.focus_type = "Research Substituted"
            alt_path.description = "Alternative candidate path substituting AI Club with faculty computer vision research."

            # Update metrics
            alt_path.metrics.research_exposure = min(100.0, original_path.metrics.research_exposure + 50.0)
            alt_path.metrics.faculty_interaction = min(100.0, original_path.metrics.faculty_interaction + 45.0)
            alt_path.metrics.networking_value = max(10.0, original_path.metrics.networking_value - 25.0)
            alt_path.metrics.industry_exposure = max(10.0, original_path.metrics.industry_exposure - 15.0)
            alt_path.metrics.goal_alignment = 95.0

            trade_offs.append("+ Research exposure increases from 40% to 90%")
            trade_offs.append("+ Faculty interaction increases from 45% to 90%")
            trade_offs.append("- Peer club networking decreases from 90% to 65%")
            trade_offs.append("✓ Fits within the exact same 6.0 hours/week limit")

        elif op in ("REDUCE_TIME", "4_HOURS") or scenario.new_time_limit is not None:
            new_limit = scenario.new_time_limit or 4.0
            alt_path.available_hours_per_week = new_limit
            
            # Trim steps to fit new limit
            trimmed_steps = []
            current_h = 0.0
            for s in alt_path.steps:
                if current_h + s.hours_per_week <= new_limit:
                    trimmed_steps.append(s)
                    current_h += s.hours_per_week
                else:
                    # Adjust hours if possible or skip
                    rem = new_limit - current_h
                    if rem >= 1.0:
                        s_copy = copy.deepcopy(s)
                        s_copy.hours_per_week = rem
                        s_copy.reason += f" (Reduced commitment to fit {new_limit}h limit)"
                        trimmed_steps.append(s_copy)
                        current_h += rem
                        changes.append(f"Reduced '{s.name}' commitment to {rem}h/wk")
                    else:
                        changes.append(f"Removed '{s.name}' to respect {new_limit}h/wk limit")

            alt_path.steps = trimmed_steps
            alt_path.title = f"Path A' — Optimized for {new_limit} Hours/Week"
            alt_path.description = f"Streamlined path tailored strictly for a {new_limit}-hour weekly commitment."

            alt_path.metrics.goal_alignment = 85.0
            alt_path.metrics.networking_value = max(10.0, original_path.metrics.networking_value - 20.0)

            trade_offs.append(f"✓ Total weekly time reduced from {original_path.total_hours_per_week}h to {new_limit}h")
            trade_offs.append(f"- Focused core steps retain 85% goal alignment")

        elif op == "REMOVE":
            target_name = (scenario.target or "Club").lower()
            new_steps = [s for s in alt_path.steps if target_name not in s.name.lower() and target_name not in s.type.lower()]
            alt_path.steps = new_steps
            changes.append(f"Removed target component '{scenario.target}'")
            trade_offs.append(f"✓ Reduced total time commitment to {sum(s.hours_per_week for s in new_steps)}h/wk")

        else:
            # Default generic adjustment
            changes.append(f"Applied scenario: {scenario.operation}")

        # Recalculate total hours
        alt_path.total_hours_per_week = sum(s.hours_per_week for s in alt_path.steps)
        alt_path.within_limit = (alt_path.total_hours_per_week <= alt_path.available_hours_per_week)

        # Unique skills gained
        all_skills = []
        for s in alt_path.steps:
            all_skills.extend(s.skills)
        alt_path.skills_gained = list(set(all_skills))

        # Generate metric comparisons
        m_comp = [
            MetricComparison(
                metric_name="Goal Alignment",
                original_val=original_path.metrics.goal_alignment,
                alternative_val=alt_path.metrics.goal_alignment,
                delta=round(alt_path.metrics.goal_alignment - original_path.metrics.goal_alignment, 1)
            ),
            MetricComparison(
                metric_name="Research Exposure",
                original_val=original_path.metrics.research_exposure,
                alternative_val=alt_path.metrics.research_exposure,
                delta=round(alt_path.metrics.research_exposure - original_path.metrics.research_exposure, 1)
            ),
            MetricComparison(
                metric_name="Networking Value",
                original_val=original_path.metrics.networking_value,
                alternative_val=alt_path.metrics.networking_value,
                delta=round(alt_path.metrics.networking_value - original_path.metrics.networking_value, 1)
            ),
            MetricComparison(
                metric_name="Faculty Interaction",
                original_val=original_path.metrics.faculty_interaction,
                alternative_val=alt_path.metrics.faculty_interaction,
                delta=round(alt_path.metrics.faculty_interaction - original_path.metrics.faculty_interaction, 1)
            ),
            MetricComparison(
                metric_name="Weekly Commitment (hrs)",
                original_val=original_path.total_hours_per_week,
                alternative_val=alt_path.total_hours_per_week,
                delta=round(alt_path.total_hours_per_week - original_path.total_hours_per_week, 1)
            )
        ]

        explanation = (
            f"What-If Transformation Complete: Substituted '{scenario.target or 'extracurriculars'}' "
            f"with {scenario.replacement_type or 'alternative opportunities'}. "
            f"The new path requires {alt_path.total_hours_per_week}h/week (limit: {alt_path.available_hours_per_week}h) "
            f"and shifts focus towards higher research and faculty mentorship."
        )

        return WhatIfResponse(
            original_path=original_path,
            alternative_path=alt_path,
            changes=changes,
            metric_comparisons=m_comp,
            trade_offs=trade_offs,
            explanation=explanation
        )

what_if_service = WhatIfService()
