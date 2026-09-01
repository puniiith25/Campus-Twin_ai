export class CompareService {
  comparePaths(pathA, pathB, studentProfile = null) {
    const diffs = [];

    if (pathA.total_hours_per_week !== pathB.total_hours_per_week) {
      diffs.push(
        `Time Commitment: ${pathA.title} takes ${pathA.total_hours_per_week}h/wk vs ${pathB.title} (${pathB.total_hours_per_week}h/wk).`
      );
    }

    if (Math.abs(pathA.metrics.research_exposure - pathB.metrics.research_exposure) >= 10) {
      const winner = pathA.metrics.research_exposure > pathB.metrics.research_exposure ? pathA.title : pathB.title;
      diffs.push(`Research Exposure: ${winner} provides significantly higher academic lab exposure.`);
    }

    if (Math.abs(pathA.metrics.networking_value - pathB.metrics.networking_value) >= 10) {
      const winner = pathA.metrics.networking_value > pathB.metrics.networking_value ? pathA.title : pathB.title;
      diffs.push(`Networking & Peer Connections: ${winner} offers stronger peer networking and industry events.`);
    }

    let recommendedPath = pathA.title;
    let reasoning = `${pathA.title} delivers a balanced foundation between industry preparation, peer networking, and technical skill development.`;

    const interests = (studentProfile?.interests || []).map((i) => i.toLowerCase());
    if (pathB.metrics.research_exposure > pathA.metrics.research_exposure && interests.includes("research")) {
      recommendedPath = pathB.title;
      const diffVal = Math.round((pathB.metrics.research_exposure - pathA.metrics.research_exposure) * 10) / 10;
      reasoning = `${pathB.title} is better aligned with your stated preference for research experience, offering +${diffVal}% research exposure while fitting your ${pathB.available_hours_per_week}h weekly limit.`;
    }

    return {
      path_a: pathA,
      path_b: pathB,
      differences: diffs,
      metrics_comparison: {
        goal_alignment: { path_a: pathA.metrics.goal_alignment, path_b: pathB.metrics.goal_alignment },
        research_exposure: { path_a: pathA.metrics.research_exposure, path_b: pathB.metrics.research_exposure },
        networking_value: { path_a: pathA.metrics.networking_value, path_b: pathB.metrics.networking_value },
        industry_exposure: { path_a: pathA.metrics.industry_exposure, path_b: pathB.metrics.industry_exposure },
        faculty_interaction: { path_a: pathA.metrics.faculty_interaction, path_b: pathB.metrics.faculty_interaction },
        overall_score: { path_a: pathA.metrics.overall_score, path_b: pathB.metrics.overall_score },
      },
      recommended_path: recommendedPath,
      reasoning,
    };
  }
}

export const compareService = new CompareService();
