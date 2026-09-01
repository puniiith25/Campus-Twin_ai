export class ScoringService {
  static calculateScore(item, studentProfile) {
    const itemText = (
      `${item.name || ""} ${item.title || ""} ${item.description || ""} ` +
      `${item.skills || ""} ${item.department || ""} ${item.category || ""}`
    ).toLowerCase();

    // 1. Goal Alignment (40%)
    const careerGoals = studentProfile?.careerGoals || [studentProfile?.goal || "AI Engineer"];
    const sixMonthGoal = studentProfile?.sixMonthGoal || "";
    const careerKeywords = careerGoals
      .join(" ")
      .toLowerCase()
      .split(/[\s/]+/)
      .filter((w) => w.length > 2);

    const goalHits = careerKeywords.filter((kw) => itemText.includes(kw)).length;
    let goalMatch = 15.0;
    if (goalHits > 0) {
      goalMatch = Math.min(100.0, 45.0 + goalHits * 25.0);
    }
    if (sixMonthGoal && itemText.includes(sixMonthGoal.toLowerCase())) {
      goalMatch = Math.min(100.0, goalMatch + 15.0);
    }

    // 2. Skill Fit & Growth (25%)
    const studentSkills = (studentProfile?.skills || []).map((s) =>
      typeof s === "string" ? s.toLowerCase() : (s.name || "").toLowerCase()
    );
    const skillsToImprove = (studentProfile?.skillsToImprove || []).map((s) => s.toLowerCase());
    const itemSkills = (item.skills || "")
      .split("|")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    let skillMatch = 40.0;
    if (itemSkills.length > 0) {
      const currentHits = itemSkills.filter((s) => studentSkills.includes(s)).length;
      const improveHits = itemSkills.filter((s) => skillsToImprove.includes(s)).length;

      skillMatch = Math.min(
        100.0,
        (currentHits / Math.max(1, itemSkills.length)) * 50.0 +
          (improveHits / Math.max(1, itemSkills.length)) * 40.0 +
          25.0
      );
    }

    // 3. Schedule / Time Fit (20%)
    const itemHours = parseFloat(item.hours_per_week || 2);
    const availHours = parseFloat(studentProfile?.available_hours_per_week || studentProfile?.weeklyAvailableHours || 6.0);
    let timeFit = 100.0;
    if (itemHours > availHours) {
      const over = itemHours - availHours;
      timeFit = Math.max(10.0, 100.0 - over * 25.0);
    } else {
      // Reward matching close to budget without overloading
      timeFit = 95.0;
    }

    // 4. Interest & Preference Match (15%)
    const interests = (studentProfile?.interests || []).map((i) => i.toLowerCase());
    const priorities = (studentProfile?.preferred_opportunity_types || studentProfile?.priorities || []).map((p) =>
      p.toLowerCase()
    );
    const itemType = (item.type || "").toLowerCase();

    let interestMatch = 50.0;
    const interestHits = interests.filter((i) => itemText.includes(i)).length;
    const priorityMatch = priorities.some((p) => itemType.includes(p));

    interestMatch = Math.min(100.0, interestHits * 25.0 + (priorityMatch ? 40.0 : 10.0));

    // Calculate Total Weighted Score (0-100)
    const totalScore = Math.round(
      (goalMatch * 0.40 + skillMatch * 0.25 + timeFit * 0.20 + interestMatch * 0.15) * 10
    ) / 10;

    // Score Label
    let label = "Low Match";
    if (totalScore >= 90) label = "Excellent Match";
    else if (totalScore >= 75) label = "Strong Match";
    else if (totalScore >= 60) label = "Good Match";
    else if (totalScore >= 40) label = "Possible Match";

    // Transparent Match Reasons (Explained)
    const reasons = [];
    if (goalMatch >= 70) {
      reasons.push(`🎯 Directly supports your '${careerGoals[0]}' career direction`);
    }
    const matchedSkills = itemSkills.filter((s) => studentSkills.includes(s));
    if (matchedSkills.length > 0) {
      reasons.push(`🧠 Leverages your ${matchedSkills.join(", ")} background`);
    }
    const matchedGrowth = itemSkills.filter((s) => skillsToImprove.includes(s));
    if (matchedGrowth.length > 0) {
      reasons.push(`📈 Accelerates skill growth in ${matchedGrowth.join(", ")}`);
    }
    if (itemHours <= availHours) {
      reasons.push(`⏱ Fits your schedule (${itemHours}h/wk of your ${availHours}h budget)`);
    } else {
      reasons.push(`⚠️ Exceeds your ${availHours}h/wk target by ${Math.round((itemHours - availHours) * 10) / 10}h`);
    }

    return {
      score: totalScore,
      label,
      reasons,
      breakdown: {
        goalMatch: Math.round(goalMatch),
        skillMatch: Math.round(skillMatch),
        timeFit: Math.round(timeFit),
        interestMatch: Math.round(interestMatch),
      },
    };
  }
}

export const scoringService = ScoringService;
