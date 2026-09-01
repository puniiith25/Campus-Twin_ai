from typing import Dict, Any, List, Optional
from app.models.path import CampusPath
from app.models.student import StudentProfile

class CompareService:
    def compare_paths(self, path_a: CampusPath, path_b: CampusPath, student_profile: Optional[StudentProfile] = None) -> Dict[str, Any]:
        """Compares two campus paths side-by-side and returns actionable trade-off analysis."""
        
        diffs = []
        if path_a.total_hours_per_week != path_b.total_hours_per_week:
            diffs.append(
                f"Time Commitment: {path_a.title} takes {path_a.total_hours_per_week}h/wk vs {path_b.title} ({path_b.total_hours_per_week}h/wk)."
            )

        if abs(path_a.metrics.research_exposure - path_b.metrics.research_exposure) >= 10:
            winner = path_a.title if path_a.metrics.research_exposure > path_b.metrics.research_exposure else path_b.title
            diffs.append(f"Research Exposure: {winner} provides significantly higher academic lab exposure.")

        if abs(path_a.metrics.networking_value - path_b.metrics.networking_value) >= 10:
            winner = path_a.title if path_a.metrics.networking_value > path_b.metrics.networking_value else path_b.title
            diffs.append(f"Networking & Peer Connections: {winner} offers stronger peer networking and industry events.")

        # Determine overall recommendation explanation
        if path_b.metrics.research_exposure > path_a.metrics.research_exposure and (student_profile and "research" in [i.lower() for i in student_profile.interests]):
            recommended_path = path_b.title
            reasoning = f"{path_b.title} is better aligned with your stated preference for research experience, offering +{round(path_b.metrics.research_exposure - path_a.metrics.research_exposure, 1)}% research exposure while fitting your {path_b.available_hours_per_week}h weekly limit."
        else:
            recommended_path = path_a.title
            reasoning = f"{path_a.title} delivers a balanced foundation between industry preparation, peer networking, and technical skill development."

        return {
            "path_a": path_a.model_dump(),
            "path_b": path_b.model_dump(),
            "differences": diffs,
            "metrics_comparison": {
                "goal_alignment": {"path_a": path_a.metrics.goal_alignment, "path_b": path_b.metrics.goal_alignment},
                "research_exposure": {"path_a": path_a.metrics.research_exposure, "path_b": path_b.metrics.research_exposure},
                "networking_value": {"path_a": path_a.metrics.networking_value, "path_b": path_b.metrics.networking_value},
                "industry_exposure": {"path_a": path_a.metrics.industry_exposure, "path_b": path_b.metrics.industry_exposure},
                "faculty_interaction": {"path_a": path_a.metrics.faculty_interaction, "path_b": path_b.metrics.faculty_interaction},
                "overall_score": {"path_a": path_a.metrics.overall_score, "path_b": path_b.metrics.overall_score}
            },
            "recommended_path": recommended_path,
            "reasoning": reasoning
        }

compare_service = CompareService()
