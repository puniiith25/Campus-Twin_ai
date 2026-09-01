from typing import List, Dict, Any, Tuple
from app.models.student import StudentProfile

class ScoringService:
    @staticmethod
    def calculate_score(
        item: Dict[str, Any],
        student_profile: StudentProfile
    ) -> Tuple[float, str, List[str]]:
        """Calculates multi-factor recommendation score (0-100), label, and match reasons."""
        stopwords = {"i", "want", "to", "become", "a", "an", "the", "in", "and", "have", "know", "per", "week", "hours", "my", "is", "for", "with", "get"}
        raw_words = [k.strip().lower() for k in student_profile.goal.split() if k.strip()]
        goal_keywords = [w for w in raw_words if w not in stopwords]
        if not goal_keywords:
            goal_keywords = raw_words or ["ai", "engineer"]

        # Item text
        item_text = (
            f"{item.get('name', '')} {item.get('title', '')} {item.get('description', '')} "
            f"{item.get('skills', '')} {item.get('department', '')} {item.get('category', '')}"
        ).lower()

        # 1. Goal Match (55%)
        goal_hits = sum(1 for kw in goal_keywords if kw in item_text)
        if goal_hits > 0:
            goal_match = min(100.0, 50.0 + (goal_hits * 25.0))
        else:
            goal_match = 10.0

        # 2. Skill Match (20%)
        student_skill_names = [s.name.lower() for s in student_profile.skills]
        item_skills = [s.strip().lower() for s in str(item.get('skills', '')).split('|') if s.strip()]
        
        if not item_skills:
            skill_match = 50.0
        else:
            shared_skills = set(student_skill_names).intersection(set(item_skills))
            skill_match = min(100.0, (len(shared_skills) / max(1, len(item_skills))) * 80.0 + 20.0) if shared_skills else 40.0

        # 3. Time Fit (15%)
        item_hours = float(item.get('hours_per_week', 2))
        avail_hours = student_profile.available_hours_per_week
        if item_hours <= avail_hours:
            time_fit = 100.0
        else:
            over = item_hours - avail_hours
            time_fit = max(10.0, 100.0 - (over * 25.0))

        # 4. Opportunity Value (10%)
        item_type = str(item.get('type', '')).lower()
        if "research" in item_type or "fellowship" in item_type or "hackathon" in item_type or "internship" in item_type:
            opportunity_value = 95.0
        elif "course" in item_type or "workshop" in item_type:
            opportunity_value = 85.0
        else:
            opportunity_value = 75.0

        # Weighted Total Score
        total_score = (goal_match * 0.55) + (skill_match * 0.20) + (time_fit * 0.15) + (opportunity_value * 0.10)
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
