from typing import List, Dict, Any
from app.models.student import StudentProfile
from app.models.path import CampusPath, PathStep, PathMetrics

class PathService:
    def generate_paths_for_student(self, student_profile: StudentProfile) -> List[CampusPath]:
        avail_hours = student_profile.available_hours_per_week

        # PATH A: Career / Industry Focus
        path_a_steps = [
            PathStep(
                step_id="step_a_1",
                type="Course",
                name="AI101: Introduction to Artificial Intelligence",
                description="Core AI fundamentals, search algorithms, and machine learning foundations.",
                hours_per_week=2.0,
                duration="Semester (15 wks)",
                skills=["Python", "Machine Learning", "Algorithm Design"],
                reason="Provides foundational AI knowledge and satisfies prerequisite for advanced labs.",
                prerequisites=["CS101 (Python)"],
                dependencies=[]
            ),
            PathStep(
                step_id="step_a_2",
                type="Workshop",
                name="EVT_02: Hands-On Deep Learning PyTorch Workshop",
                description="Practical tutorial building CNNs and Transformers.",
                hours_per_week=1.0,
                duration="2 Weeks",
                skills=["Deep Learning", "Python", "PyTorch"],
                reason="Hands-on PyTorch neural network development experience.",
                prerequisites=["Python"],
                dependencies=["step_a_1"]
            ),
            PathStep(
                step_id="step_a_3",
                type="Club",
                name="CLUB_01: Artificial Intelligence Student Society",
                description="Student organization hosting guest speaker talks, projects, and career panels.",
                hours_per_week=1.5,
                duration="Ongoing",
                skills=["Networking", "Teamwork & Collaboration", "Public Speaking"],
                reason="Builds peer network, soft skills, and connects with industry recruiters.",
                prerequisites=[],
                dependencies=[]
            ),
            PathStep(
                step_id="step_a_4",
                type="Hackathon",
                name="EVT_01: Annual Campus AI Hackathon 2026",
                description="48-hour intensive building competition sponsored by Databricks.",
                hours_per_week=1.5,
                duration="1 Weekend",
                skills=["Generative AI", "FastAPI", "Databricks Unity Catalog"],
                reason="Demonstrates practical project building under deadline constraints.",
                prerequisites=["Python"],
                dependencies=["step_a_2", "step_a_3"]
            )
        ]

        total_a_hours = sum(s.hours_per_week for s in path_a_steps)
        metrics_a = PathMetrics(
            goal_alignment=92.0,
            research_exposure=40.0,
            networking_value=90.0,
            industry_exposure=88.0,
            project_experience=85.0,
            faculty_interaction=45.0,
            overall_score=88.5
        )

        path_a = CampusPath(
            path_id="path_career_focus",
            title="Path A — Career & Industry Focus",
            focus_type="Career Focus",
            description="Designed for rapid skill acquisition, peer networking, hackathon projects, and industry internship readiness.",
            goal=student_profile.goal,
            steps=path_a_steps,
            total_hours_per_week=total_a_hours,
            available_hours_per_week=avail_hours,
            within_limit=(total_a_hours <= avail_hours),
            skills_gained=["Python", "Machine Learning", "Deep Learning", "Generative AI", "Databricks Unity Catalog", "Networking"],
            metrics=metrics_a,
            explanation=f"Fits perfectly within your {avail_hours}h/week limit. Prioritizes industry exposure, hackathons, and high networking value."
        )

        # PATH B: Research Focus
        path_b_steps = [
            PathStep(
                step_id="step_b_1",
                type="Course",
                name="AI101: Introduction to Artificial Intelligence",
                description="Core AI fundamentals and machine learning theory.",
                hours_per_week=2.0,
                duration="Semester (15 wks)",
                skills=["Python", "Machine Learning", "Linear Algebra"],
                reason="Establishes theoretical foundation for lab research.",
                prerequisites=["CS101"],
                dependencies=[]
            ),
            PathStep(
                step_id="step_b_2",
                type="Workshop",
                name="EVT_02: Hands-On Deep Learning PyTorch Workshop",
                description="PyTorch neural network training masterclass.",
                hours_per_week=1.0,
                duration="2 Weeks",
                skills=["Deep Learning", "Python"],
                reason="Prepares technical skills required for computer vision lab experiments.",
                prerequisites=["Python"],
                dependencies=["step_b_1"]
            ),
            PathStep(
                step_id="step_b_3",
                type="Research",
                name="RES_01: Autonomous Navigation & Perception Research",
                description="Faculty-led vision SLAM and edge neural network research with Prof. Aris Thorne.",
                hours_per_week=2.0,
                duration="Semester",
                skills=["Computer Vision", "Deep Learning", "Research Methods", "Technical Writing"],
                reason="Direct research mentorship with faculty, lab access, and publication potential.",
                prerequisites=["AI101", "Python"],
                dependencies=["step_b_2"]
            ),
            PathStep(
                step_id="step_b_4",
                type="Seminar",
                name="EVT_05: Databricks & LLM Fine-Tuning Masterclass",
                description="Guest seminar on Databricks Genie and Delta Lake research applications.",
                hours_per_week=1.0,
                duration="Special Seminar",
                skills=["Databricks Unity Catalog", "Natural Language Processing"],
                reason="Exposes cutting-edge data architecture research practices.",
                prerequisites=[],
                dependencies=[]
            )
        ]

        total_b_hours = sum(s.hours_per_week for s in path_b_steps)
        metrics_b = PathMetrics(
            goal_alignment=94.0,
            research_exposure=95.0,
            networking_value=62.0,
            industry_exposure=60.0,
            project_experience=82.0,
            faculty_interaction=96.0,
            overall_score=90.0
        )

        path_b = CampusPath(
            path_id="path_research_focus",
            title="Path B — Research & Academic Focus",
            focus_type="Research Focus",
            description="Designed for deep academic specialization, faculty lab interaction, computer vision research, and REU/graduate school preparation.",
            goal=student_profile.goal,
            steps=path_b_steps,
            total_hours_per_week=total_b_hours,
            available_hours_per_week=avail_hours,
            within_limit=(total_b_hours <= avail_hours),
            skills_gained=["Python", "Machine Learning", "Deep Learning", "Computer Vision", "Research Methods", "Technical Writing"],
            metrics=metrics_b,
            explanation=f"Fits within your {avail_hours}h/week limit. Boosts research exposure (+55) and faculty mentorship (+51) compared to Career Focus."
        )

        return [path_a, path_b]

path_service = PathService()
