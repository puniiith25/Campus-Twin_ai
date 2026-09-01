import { pathService } from "./pathService.js";

export class WhatIfService {
  executeScenario(request) {
    const profileData = request.student_profile || {};
    const student = {
      goal: profileData.goal || "AI Engineer",
      available_hours_per_week: parseFloat(profileData.available_hours_per_week || 6.0),
    };

    const basePaths = pathService.generatePathsForStudent(student);
    const originalPath = request.custom_base_path || basePaths[0];

    // Deep clone original path
    const altPath = JSON.parse(JSON.stringify(originalPath));
    const scenario = request.scenario || {};
    const changes = [];
    const tradeOffs = [];
    const op = (scenario.operation || "").toUpperCase();

    if (op === "REPLACE" || (scenario.operation || "").toLowerCase().includes("replace")) {
      const targetName = (scenario.target || "AI Club").toLowerCase();

      let removedStepName = "";
      const newSteps = [];
      for (const s of altPath.steps || []) {
        if (s.name.toLowerCase().includes(targetName) || s.type.toLowerCase().includes(targetName)) {
          removedStepName = s.name;
          changes.push(`Removed '${s.name}' (${s.hours_per_week}h/wk)`);
        } else {
          newSteps.push(s);
        }
      }

      if (!removedStepName && (altPath.steps || []).length >= 3) {
        removedStepName = altPath.steps[2].name;
        changes.push(`Removed '${removedStepName}' (${altPath.steps[2].hours_per_week}h/wk)`);
        newSteps.splice(2, 1);
      }

      const researchStep = {
        step_id: "step_whatif_res_1",
        type: "Research",
        name: "RES_01: Autonomous Navigation & Perception Research",
        description: "Faculty-led computer vision research with Prof. Aris Thorne.",
        hours_per_week: 1.5,
        duration: "1 Semester",
        skills: ["Computer Vision", "Deep Learning", "Research Methods", "Faculty Mentorship"],
        reason: "Replaces extracurricular club with direct faculty-led research exposure.",
        prerequisites: ["AI101", "Python"],
        dependencies: ["step_a_2"],
      };

      newSteps.push(researchStep);
      changes.push(`Added research alternative '${researchStep.name}' (${researchStep.hours_per_week}h/wk)`);

      altPath.steps = newSteps;
      altPath.title = "Path A' — What-If Alternative (Research Substituted)";
      altPath.focus_type = "Research Substituted";
      altPath.description = "Alternative candidate path substituting AI Club with faculty computer vision research.";

      // Update metrics
      altPath.metrics.research_exposure = Math.min(100.0, originalPath.metrics.research_exposure + 50.0);
      altPath.metrics.faculty_interaction = Math.min(100.0, originalPath.metrics.faculty_interaction + 45.0);
      altPath.metrics.networking_value = Math.max(10.0, originalPath.metrics.networking_value - 25.0);
      altPath.metrics.industry_exposure = Math.max(10.0, originalPath.metrics.industry_exposure - 15.0);
      altPath.metrics.goal_alignment = 95.0;

      tradeOffs.push("Gains direct faculty mentorship and lab publication potential.");
      tradeOffs.push("Reduces general peer networking and club social events.");
    } else {
      // General What-if adjustment
      changes.push(`Simulated scenario '${scenario.target || "custom modification"}'`);
      tradeOffs.push("Maintains target time budget while enhancing specialized skills.");
    }

    // Recalculate total hours
    altPath.total_hours_per_week = altPath.steps.reduce((acc, s) => acc + s.hours_per_week, 0);
    altPath.within_limit = altPath.total_hours_per_week <= altPath.available_hours_per_week;

    const metricComparisons = [
      {
        metric_name: "Research Exposure",
        original_value: originalPath.metrics.research_exposure,
        simulated_value: altPath.metrics.research_exposure,
        delta: altPath.metrics.research_exposure - originalPath.metrics.research_exposure,
        interpretation: "Significant increase in academic lab and publication experience.",
      },
      {
        metric_name: "Faculty Interaction",
        original_value: originalPath.metrics.faculty_interaction,
        simulated_value: altPath.metrics.faculty_interaction,
        delta: altPath.metrics.faculty_interaction - originalPath.metrics.faculty_interaction,
        interpretation: "Direct interaction with research faculty.",
      },
      {
        metric_name: "Networking & Clubs",
        original_value: originalPath.metrics.networking_value,
        simulated_value: altPath.metrics.networking_value,
        delta: altPath.metrics.networking_value - originalPath.metrics.networking_value,
        interpretation: "Slight decrease in broad peer networking.",
      },
      {
        metric_name: "Industry Readiness",
        original_value: originalPath.metrics.industry_exposure,
        simulated_value: altPath.metrics.industry_exposure,
        delta: altPath.metrics.industry_exposure - originalPath.metrics.industry_exposure,
        interpretation: "Balanced between industry tooling and research.",
      },
    ];

    return {
      original_path: originalPath,
      simulated_path: altPath,
      metric_comparisons: metricComparisons,
      changes_summary: changes,
      trade_offs: tradeOffs,
      recommendation:
        "Replacing club participation with faculty research substantially accelerates your academic profile while keeping total hours within your target budget.",
      time_impact: `${altPath.total_hours_per_week}h/wk total (${altPath.total_hours_per_week - originalPath.total_hours_per_week >= 0 ? "+" : ""}${Math.round((altPath.total_hours_per_week - originalPath.total_hours_per_week) * 10) / 10}h change)`,
    };
  }
}

export const whatIfService = new WhatIfService();
