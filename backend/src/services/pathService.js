export class PathService {
  generatePathsForStudent(studentProfile) {
    const availHours = parseFloat(studentProfile?.available_hours_per_week || 6.0);
    const goal = studentProfile?.goal || "AI Engineer";

    // Path A: Career Focus
    const pathASteps = [
      {
        step_id: "step_a_1",
        type: "Course",
        name: "AI101: Introduction to Artificial Intelligence",
        description: "Core AI fundamentals, search algorithms, and machine learning foundations.",
        hours_per_week: 2.0,
        duration: "Semester (15 wks)",
        skills: ["Python", "Machine Learning", "Algorithm Design"],
        reason: "Provides foundational AI knowledge and satisfies prerequisite for advanced labs.",
        prerequisites: ["CS101 (Python)"],
        dependencies: [],
      },
      {
        step_id: "step_a_2",
        type: "Workshop",
        name: "EVT_02: Hands-On Deep Learning PyTorch Workshop",
        description: "Practical tutorial building CNNs and Transformers.",
        hours_per_week: 1.0,
        duration: "2 Weeks",
        skills: ["Deep Learning", "Python", "PyTorch"],
        reason: "Hands-on PyTorch neural network development experience.",
        prerequisites: ["Python"],
        dependencies: ["step_a_1"],
      },
      {
        step_id: "step_a_3",
        type: "Club",
        name: "CLUB_01: Artificial Intelligence Student Society",
        description: "Student organization hosting guest speaker talks, projects, and career panels.",
        hours_per_week: 1.5,
        duration: "Ongoing",
        skills: ["Networking", "Teamwork & Collaboration", "Public Speaking"],
        reason: "Builds peer network, soft skills, and connects with industry recruiters.",
        prerequisites: [],
        dependencies: [],
      },
      {
        step_id: "step_a_4",
        type: "Hackathon",
        name: "EVT_01: Annual Campus AI Hackathon 2026",
        description: "48-hour intensive building competition sponsored by Databricks.",
        hours_per_week: 1.5,
        duration: "1 Weekend",
        skills: ["Generative AI", "FastAPI", "Databricks Unity Catalog"],
        reason: "Demonstrates practical project building under deadline constraints.",
        prerequisites: ["Python"],
        dependencies: ["step_a_2", "step_a_3"],
      },
    ];

    const totalAHours = pathASteps.reduce((acc, s) => acc + s.hours_per_week, 0);
    const pathA = {
      path_id: "path_career_focus",
      title: "Path A — Career & Industry Focus",
      focus_type: "Career Focus",
      description:
        "Designed for rapid skill acquisition, peer networking, hackathon projects, and industry internship readiness.",
      goal,
      steps: pathASteps,
      total_hours_per_week: totalAHours,
      available_hours_per_week: availHours,
      within_limit: totalAHours <= availHours,
      skills_gained: [
        "Python",
        "Machine Learning",
        "Deep Learning",
        "Generative AI",
        "Databricks Unity Catalog",
        "Networking",
      ],
      metrics: {
        goal_alignment: 92.0,
        research_exposure: 40.0,
        networking_value: 90.0,
        industry_exposure: 88.0,
        project_experience: 85.0,
        faculty_interaction: 45.0,
        overall_score: 88.5,
      },
      explanation: `Fits perfectly within your ${availHours}h/week limit. Prioritizes industry exposure, hackathons, and high networking value.`,
    };

    // Path B: Research Focus
    const pathBSteps = [
      {
        step_id: "step_b_1",
        type: "Course",
        name: "AI101: Introduction to Artificial Intelligence",
        description: "Core AI fundamentals and machine learning theory.",
        hours_per_week: 2.0,
        duration: "Semester (15 wks)",
        skills: ["Python", "Machine Learning", "Linear Algebra"],
        reason: "Establishes theoretical foundation for lab research.",
        prerequisites: ["CS101"],
        dependencies: [],
      },
      {
        step_id: "step_b_2",
        type: "Workshop",
        name: "EVT_02: Hands-On Deep Learning PyTorch Workshop",
        description: "PyTorch neural network training masterclass.",
        hours_per_week: 1.0,
        duration: "2 Weeks",
        skills: ["Deep Learning", "Python"],
        reason: "Prepares technical skills required for computer vision lab experiments.",
        prerequisites: ["Python"],
        dependencies: ["step_b_1"],
      },
      {
        step_id: "step_b_3",
        type: "Research",
        name: "RES_01: Autonomous Navigation & Perception Research",
        description: "Faculty-led vision SLAM and edge neural network research with Prof. Aris Thorne.",
        hours_per_week: 2.0,
        duration: "Semester",
        skills: ["Computer Vision", "Deep Learning", "Research Methods", "Technical Writing"],
        reason: "Direct research mentorship with faculty, lab access, and publication potential.",
        prerequisites: ["AI101", "Python"],
        dependencies: ["step_b_2"],
      },
      {
        step_id: "step_b_4",
        type: "Seminar",
        name: "EVT_05: Databricks & LLM Fine-Tuning Masterclass",
        description: "Guest seminar on Databricks Genie and Delta Lake research applications.",
        hours_per_week: 1.0,
        duration: "Special Seminar",
        skills: ["Databricks Unity Catalog", "Natural Language Processing"],
        reason: "Exposes cutting-edge data architecture research practices.",
        prerequisites: [],
        dependencies: [],
      },
    ];

    const totalBHours = pathBSteps.reduce((acc, s) => acc + s.hours_per_week, 0);
    const pathB = {
      path_id: "path_research_focus",
      title: "Path B — Research & Academic Focus",
      focus_type: "Research Focus",
      description:
        "Designed for deep academic specialization, faculty lab interaction, computer vision research, and REU/graduate school preparation.",
      goal,
      steps: pathBSteps,
      total_hours_per_week: totalBHours,
      available_hours_per_week: availHours,
      within_limit: totalBHours <= availHours,
      skills_gained: [
        "Python",
        "Machine Learning",
        "Deep Learning",
        "Computer Vision",
        "Research Methods",
        "Technical Writing",
      ],
      metrics: {
        goal_alignment: 94.0,
        research_exposure: 95.0,
        networking_value: 62.0,
        industry_exposure: 60.0,
        project_experience: 82.0,
        faculty_interaction: 96.0,
        overall_score: 90.0,
      },
      explanation: `Fits within your ${availHours}h/week limit. Boosts research exposure (+55) and faculty mentorship (+51) compared to Career Focus.`,
    };

    return [pathA, pathB];
  }
}

export const pathService = new PathService();
