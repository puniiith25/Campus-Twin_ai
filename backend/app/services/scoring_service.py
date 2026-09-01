from typing import List, Dict, Any, Tuple
from app.models.student import StudentProfile

class ScoringService:
    @staticmethod
    def calculate_score(
        item: Dict[str, Any],
        student_profile: StudentProfile
    ) -> Tuple[float, str, List[str]]:
        """Calculates multi-factor recommendation score (0-100), label, and match reasons."""
        goal_keywords = [k.strip().lower() for k in student_profile.goal.split()]
        if not goal_keywords:
            goal_keywords = ["ai", "engineer"]

        # Item text
        item_text = (
            f"{item.get('name', '')} {item.get('title', '')} {item.get('description', '')} "
            f"{item.get('skills', '')} {item.get('department', '')} {item.get('category', '')}"
        ).lower()

        # 1. Goal Match (40%)
        goal_hits = sum(1 for kw in goal_keywords if kw in item_text or kw in [i.lower() for i in student_profile.interests])
        goal_match = min(100.0, (goal_hits / max(1, len(goal_keywords))) * 100.0 + 30.0)

        # 2. Skill Match (25%)
        student_skill_names = [s.name.lower() for s in student_profile.skills]
        item_skills = [s.strip().lower() for s in str(item.get('skills', '')).split('|') if s.strip()]
        
        if not item_skills:
            skill_match = 70.0
        else:
            shared_skills = set(student_skill_names).intersection(set(item_skills))
            skill_match = min(100.0, (len(shared_skills) / max(1, len(item_skills))) * 100.0 + 40.0)

        # 3. Time Fit (20%)
        item_hours = float(item.get('hours_per_week', 2))
        avail_hours = student_profile.available_hours_per_week
        if item_hours <= avail_hours:
            time_fit = 100.0
        else:
            over = item_hours - avail_hours
            time_fit = max(10.0, 100.0 - (over * 25.0))

        # 4. Opportunity Value (15%)
        item_type = str(item.get('type', '')).lower()
        if "research" in item_type or "fellowship" in item_type or "hackathon" in item_type or "internship" in item_type:
            opportunity_value = 95.0
        elif "course" in item_type or "workshop" in item_type:
            opportunity_value = 85.0
        else:
            opportunity_value = 75.0

        # Weighted Total Score
        total_score = (goal_match * 0.40) + (skill_match * 0.25) + (time_fit * 0.20) + (opportunity_value * 0.15)
        total_score = round(min(100.0, max(0.0, total_score)), 1)

        # Score Label
        if total_score >= 90:
            label = "Excellent Match"
        elif total_score >= 75:
            label = "Strong Match"
        elif total_score >= 60:
            label = "Good Match"
        elif total_score >= 40:
            label = "Possible Match"
        else:
            label = "Low Match"

        # Match Reasons
        reasons = []
        if goal_match >= 70:
            reasons.append(f"Directly aligns with your '{student_profile.goal}' goal")
        if item_hours <= avail_hours:
            reasons.append(f"Fits within your {avail_hours}h/week schedule ({item_hours}h required)")
        else:
            reasons.append(f"Requires {item_hours}h/week (exceeds your {avail_hours}h target)")
        if any(s.name.lower() in item_text for s in student_profile.skills):
            reasons.append(f"Leverages your existing skills ({', '.join([s.name for s in student_profile.skills])})")

        return total_score, label, reasons

scoring_service = ScoringService()
