/**
 * Campus Twin - Career Intelligence Engine
 * Deterministic, explainable calculations linking student profiles, career roles, skills, and campus opportunities.
 */

import {
  StudentProfile,
  CareerRole,
  SkillGap,
  RoadmapStep,
  Opportunity,
  PlacementCompanyRecord,
  WhatIfScenarioResult,
  SkillProficiency,
} from '../types';
import {
  MASTER_CAREER_ROLES,
  MASTER_OPPORTUNITIES,
  MASTER_PLACEMENT_RECORDS,
} from '../data/campusIntelligenceData';

export interface ReadinessBreakdown {
  totalScore: number;
  academicScore: { score: number; max: number; label: string; details: string };
  technicalSkillScore: { score: number; max: number; label: string; details: string };
  experienceScore: { score: number; max: number; label: string; details: string };
  timeCommitmentScore: { score: number; max: number; label: string; details: string };
  alignmentSummary: string;
}

const PROFICIENCY_VALUES: Record<SkillProficiency | 'None', number> = {
  None: 0,
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

/**
 * Computes the match score (0-100) of a student for a specific career role
 */
export function calculateRoleMatch(student: StudentProfile, role: CareerRole): number {
  let score = 0;
  let maxWeight = 0;

  // 1. Skill Coverage (60% weight)
  for (const req of role.requiredSkills) {
    const weight = req.weight * 10;
    maxWeight += weight;

    const studentSkill = student.skills.find(
      (s) => s.name.toLowerCase() === req.name.toLowerCase()
    );
    const studentVal = studentSkill ? PROFICIENCY_VALUES[studentSkill.level] : 0;
    const targetVal = PROFICIENCY_VALUES[req.level];

    const ratio = Math.min(studentVal / targetVal, 1.0);
    score += ratio * weight;
  }

  // Bonus for preferred skills
  const studentSkillNames = student.skills.map((s) => s.name.toLowerCase());
  const preferredMatches = role.preferredSkills.filter((ps) =>
    studentSkillNames.includes(ps.toLowerCase())
  ).length;
  const preferredBonus = Math.min(preferredMatches * 4, 15);

  const skillScore = maxWeight > 0 ? (score / maxWeight) * 60 : 30;

  // 2. Academic Alignment (15% weight)
  let academicScore = 0;
  if (student.cgpa >= role.minimumCGPA + 0.5) {
    academicScore = 15;
  } else if (student.cgpa >= role.minimumCGPA) {
    academicScore = 12;
  } else {
    academicScore = Math.max(5, (student.cgpa / role.minimumCGPA) * 10);
  }

  // 3. Interest & Domain Match (15% weight)
  const interestMatch = student.interests.some((interest) =>
    role.domain.toLowerCase().includes(interest.toLowerCase()) ||
    interest.toLowerCase().includes(role.domain.toLowerCase()) ||
    role.title.toLowerCase().includes(interest.toLowerCase())
  );
  const interestScore = interestMatch ? 15 : 7;

  // 4. Experience Match (10% weight)
  const totalExpCount = student.projects.length + student.hackathons.length + student.internships.length;
  const expScore = Math.min(totalExpCount * 3, 10);

  const finalScore = Math.round(skillScore + academicScore + interestScore + expScore + preferredBonus);
  return Math.min(Math.max(finalScore, 15), 98);
}

/**
 * Calculates Profile Readiness Score and Factor Breakdown
 */
export function calculateProfileReadiness(
  student: StudentProfile,
  targetRoleTitle?: string
): ReadinessBreakdown {
  const targetTitle = targetRoleTitle || student.careerGoal || 'AI Engineer';
  const role = MASTER_CAREER_ROLES.find(
    (r) => r.title.toLowerCase() === targetTitle.toLowerCase()
  ) || MASTER_CAREER_ROLES[0];

  // 1. Academic Readiness (Max 25 pts)
  let academicPts = 0;
  let academicDetails = '';
  if (student.cgpa >= 8.5) {
    academicPts = 25;
    academicDetails = `Outstanding CGPA (${student.cgpa.toFixed(1)}) opens all Tier-1 and R&D eligibility criteria.`;
  } else if (student.cgpa >= 8.0) {
    academicPts = 22;
    academicDetails = `Solid CGPA (${student.cgpa.toFixed(1)}) qualifies for 95% of campus placement and research programs.`;
  } else if (student.cgpa >= 7.0) {
    academicPts = 18;
    academicDetails = `Adequate CGPA (${student.cgpa.toFixed(1)}) meets most general company cut-offs.`;
  } else {
    academicPts = 12;
    academicDetails = `CGPA (${student.cgpa.toFixed(1)}) is near minimum thresholds; focus on project portfolios.`;
  }

  // 2. Technical Skill Match (Max 40 pts)
  let totalSkillReqs = role.requiredSkills.length;
  let matchedSkillPoints = 0;
  role.requiredSkills.forEach((req) => {
    const studentSkill = student.skills.find(
      (s) => s.name.toLowerCase() === req.name.toLowerCase()
    );
    if (studentSkill) {
      const sVal = PROFICIENCY_VALUES[studentSkill.level];
      const rVal = PROFICIENCY_VALUES[req.level];
      matchedSkillPoints += Math.min(sVal / rVal, 1.0);
    }
  });
  const skillRatio = totalSkillReqs > 0 ? matchedSkillPoints / totalSkillReqs : 0.5;
  const technicalPts = Math.round(skillRatio * 40);
  const technicalDetails = `${Math.round(skillRatio * 100)}% coverage of core prerequisite skills for ${role.title}.`;

  // 3. Practical Experience Depth (Max 25 pts)
  let expPts = 0;
  const projPts = Math.min(student.projects.length * 6, 12);
  const hackPts = Math.min(student.hackathons.length * 4, 8);
  const internPts = Math.min(student.internships.length * 8, 8);
  const certPts = Math.min(student.certifications.length * 2, 4);
  expPts = Math.min(projPts + hackPts + internPts + certPts, 25);
  const expDetails = `${student.projects.length} project(s), ${student.hackathons.length} hackathon(s), ${student.internships.length} internship(s).`;

  // 4. Time Investment Alignment (Max 10 pts)
  let timePts = 0;
  let timeDetails = '';
  if (student.weeklyHours >= 8) {
    timePts = 10;
    timeDetails = `${student.weeklyHours} hrs/week enables aggressive skill acquisition and multiple concurrent projects.`;
  } else if (student.weeklyHours >= 6) {
    timePts = 8;
    timeDetails = `${student.weeklyHours} hrs/week allows consistent progress on 1 workshop and project sprint.`;
  } else if (student.weeklyHours >= 4) {
    timePts = 6;
    timeDetails = `${student.weeklyHours} hrs/week fits focused single-topic mastery.`;
  } else {
    timePts = 4;
    timeDetails = `${student.weeklyHours} hrs/week requires tight prioritization on high-impact gaps.`;
  }

  const totalScore = Math.min(academicPts + technicalPts + expPts + timePts, 96);

  let alignmentSummary = 'Strong alignment with high eligibility across upcoming campus recruitment and research programs.';
  if (totalScore < 60) {
    alignmentSummary = 'Developing alignment with strong foundational potential; prioritized project and skill depth will rapidly boost readiness.';
  } else if (totalScore < 75) {
    alignmentSummary = 'Good alignment with key academic strengths; bridging identified skill gaps will maximize Tier-1 placement match.';
  }

  return {
    totalScore,
    academicScore: { score: academicPts, max: 25, label: 'Academic Standing', details: academicDetails },
    technicalSkillScore: { score: technicalPts, max: 40, label: 'Skill Coverage', details: technicalDetails },
    experienceScore: { score: expPts, max: 25, label: 'Practical Portfolio', details: expDetails },
    timeCommitmentScore: { score: timePts, max: 10, label: 'Weekly Bandwidth', details: timeDetails },
    alignmentSummary,
  };
}

/**
 * Returns prioritized Strengths and Actionable Gaps
 */
export function getStrengthsAndGaps(student: StudentProfile, targetRoleTitle?: string) {
  const strengths: { title: string; description: string; tag: string }[] = [];
  const gaps: { title: string; description: string; action: string; urgency: 'High' | 'Medium' }[] = [];

  // Academic strength
  if (student.cgpa >= 8.0) {
    strengths.push({
      title: 'Strong Academic Eligibility',
      description: `Your ${student.cgpa} CGPA clears top-tier placement cut-offs (Amazon, Google, Databricks, Goldman Sachs).`,
      tag: 'Academic',
    });
  }

  // Skill strengths
  const advancedSkills = student.skills.filter((s) => s.level === 'Advanced' || s.level === 'Intermediate');
  if (advancedSkills.length > 0) {
    strengths.push({
      title: `Proficiency in ${advancedSkills.slice(0, 2).map((s) => s.name).join(' & ')}`,
      description: 'Provides strong algorithmic and development foundation for systems and ML workloads.',
      tag: 'Technical',
    });
  }

  // Project strength
  if (student.projects.length > 0) {
    strengths.push({
      title: 'Active Project Initiative',
      description: `Built ${student.projects.length} working applications demonstrating end-to-end execution.`,
      tag: 'Portfolio',
    });
  }

  if (student.hackathons.length > 0) {
    strengths.push({
      title: 'Competitive Hackathon Track Record',
      description: 'Demonstrated rapid prototyping and team problem-solving under real-time constraints.',
      tag: 'Experience',
    });
  }

  // Gaps
  const targetTitle = targetRoleTitle || student.careerGoal || 'AI Engineer';
  const role = MASTER_CAREER_ROLES.find(
    (r) => r.title.toLowerCase() === targetTitle.toLowerCase()
  ) || MASTER_CAREER_ROLES[0];

  role.requiredSkills.forEach((req) => {
    const studentSkill = student.skills.find((s) => s.name.toLowerCase() === req.name.toLowerCase());
    if (!studentSkill) {
      gaps.push({
        title: `Missing Prerequisite: ${req.name}`,
        description: `${role.title} mandates ${req.name} at ${req.level} level for technical screenings.`,
        action: `Enroll in campus ${req.name} workshop or practical lab project.`,
        urgency: 'High',
      });
    } else if (PROFICIENCY_VALUES[studentSkill.level] < PROFICIENCY_VALUES[req.level]) {
      gaps.push({
        title: `Skill Depth: ${req.name} (${studentSkill.level} → ${req.level})`,
        description: `Elevating ${req.name} from ${studentSkill.level} to ${req.level} unlocks higher tier interview readiness.`,
        action: `Build one real-world project focusing specifically on ${req.name}.`,
        urgency: 'Medium',
      });
    }
  });

  if (student.internships.length === 0) {
    gaps.push({
      title: 'Industry / Internship Exposure',
      description: 'No recorded formal industry internship yet; targeted campus research or open-source labs provide strong bridge.',
      action: 'Apply to summer internships and university research fellowships this month.',
      urgency: 'Medium',
    });
  }

  return { strengths, gaps };
}

/**
 * Evaluates all career roles and ranks them by alignment to student profile
 */
export function getAnalyzedCareerRoles(student: StudentProfile): CareerRole[] {
  return MASTER_CAREER_ROLES.map((role) => {
    const score = calculateRoleMatch(student, role);
    let alignment: CareerRole['alignment'] = 'Developing alignment';
    if (score >= 70) alignment = 'Strong alignment';
    else if (score >= 50) alignment = 'Good alignment';

    return {
      ...role,
      matchScore: score,
      alignment,
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Returns detailed Skill Gap Comparison Matrix for a selected target role
 */
export function getSkillGapsForRole(student: StudentProfile, targetRoleTitle: string): SkillGap[] {
  const role = MASTER_CAREER_ROLES.find(
    (r) => r.title.toLowerCase() === targetRoleTitle.toLowerCase()
  ) || MASTER_CAREER_ROLES[0];

  const gaps: SkillGap[] = [];

  role.requiredSkills.forEach((req, idx) => {
    const studentSkill = student.skills.find(
      (s) => s.name.toLowerCase() === req.name.toLowerCase()
    );
    const currentLevel: SkillGap['studentLevel'] = studentSkill ? studentSkill.level : 'None';
    const currentVal = PROFICIENCY_VALUES[currentLevel];
    const targetVal = PROFICIENCY_VALUES[req.level];

    let gapSeverity: SkillGap['gapSeverity'] = 'Low';
    if (targetVal - currentVal >= 2 || currentVal === 0) {
      gapSeverity = 'High';
    } else if (targetVal - currentVal === 1) {
      gapSeverity = 'Moderate';
    }

    let actionPlan = `Build a practical module utilizing ${req.name} with error handling and real data.`;
    if (req.name === 'SQL') {
      actionPlan = 'Complete Databricks Lakehouse SQL masterclass & practice multi-table window joins.';
    } else if (req.name === 'Machine Learning') {
      actionPlan = 'Implement 2 end-to-end models with Scikit-Learn / PyTorch and deploy via FastAPI.';
    } else if (req.name === 'Python') {
      actionPlan = 'Strengthen advanced Python paradigms: decorators, async/await, generators, and packaging.';
    }

    gaps.push({
      skillName: req.name,
      studentLevel: currentLevel,
      targetLevel: req.level,
      gapSeverity,
      priority: idx + 1,
      actionPlan,
      recommendedResources: [
        {
          title: `Campus ${req.name} Fast-Track Lab`,
          type: 'Workshop',
          provider: 'Innovation Cell',
          hours: 4,
        },
        {
          title: `${req.name} Practical Capstone Project`,
          type: 'Project',
          provider: 'Self-Paced / Mentor Guided',
          hours: 6,
        },
      ],
      impactExplanation: `Closing this gap increases ${role.title} profile alignment by +${req.weight * 6}%.`,
    });
  });

  return gaps;
}

/**
 * Generates personalized sequential roadmap ("My Path")
 */
export function generatePersonalizedRoadmap(
  student: StudentProfile,
  targetRoleTitle?: string
): RoadmapStep[] {
  const roleTitle = targetRoleTitle || student.careerGoal || 'AI Engineer';
  const role = MASTER_CAREER_ROLES.find(
    (r) => r.title.toLowerCase() === roleTitle.toLowerCase()
  ) || MASTER_CAREER_ROLES[0];

  const hours = student.weeklyHours || 6;
  const currentSkills = student.skills.map((s) => s.name.toLowerCase());

  const steps: RoadmapStep[] = [
    {
      monthNumber: 0,
      stageTitle: 'TODAY: Baseline Position',
      phase: 'Today',
      focusSummary: `${student.department} · Semester ${student.semester} · ${student.cgpa} CGPA · ${hours} hrs/wk`,
      actions: [
        `Solid base in ${student.skills.slice(0, 2).map((s) => s.name).join(', ')}`,
        `${student.projects.length} completed project(s) on record`,
        `Identified ${role.title} as target career trajectory`,
      ],
      targetMilestone: 'Profile snapshot validated in Databricks Lakehouse',
      estimatedHoursPerWeek: hours,
      completed: true,
      weeks: [
        {
          id: 'm0_w1',
          weekNumber: 1,
          title: 'Campus Twin Baseline Audit',
          description: 'Synchronize verified coursework, CGPA transcript, and verified skill badges with Databricks Lakehouse storage.',
          estimatedHours: Math.min(hours, 4),
          deliverable: 'Complete Lakehouse student profile snapshot',
          completed: true,
        },
        {
          id: 'm0_w2',
          weekNumber: 2,
          title: 'Target Role Benchmark & Gap Diagnosis',
          description: `Map existing skills against ${role.title} requirements and isolate critical missing competencies.`,
          estimatedHours: Math.min(hours, 4),
          deliverable: 'Role readiness benchmark diagnostic score',
          completed: true,
        },
      ],
    },
    {
      monthNumber: 1,
      stageTitle: 'MONTH 1: Bridge Primary Skill Gap',
      phase: 'Strengthen Core',
      focusSummary: 'Deepen SQL & Structured Data Engineering',
      actions: [
        'Complete Databricks Lakehouse & SQL Masterclass (4 hrs/wk)',
        'Practice complex window functions, CTEs, and aggregation queries on LeetCode Database 50',
        'Refactor existing project database schema with indexes',
      ],
      targetMilestone: 'SQL proficiency upgraded from Beginner to Intermediate',
      estimatedHoursPerWeek: hours,
      linkedOpportunityId: 'opp_02',
      weeks: [
        {
          id: 'm1_w1',
          weekNumber: 1,
          title: 'Week 1: Lakehouse Architecture & Advanced SQL Joins',
          description: 'Master Delta Lake principles, ACID transactions, complex multi-table INNER/OUTER/CROSS joins, and query optimization.',
          estimatedHours: hours,
          deliverable: 'Solve 15 LeetCode Medium SQL questions & Lakehouse setup',
        },
        {
          id: 'm1_w2',
          weekNumber: 2,
          title: 'Week 2: Window Functions & Analytical CTEs',
          description: 'Implement RANK, DENSE_RANK, ROW_NUMBER, LAG/LEAD and running totals across time-series event streams.',
          estimatedHours: hours,
          deliverable: 'Window functions analytics report on synthetic university log data',
        },
        {
          id: 'm1_w3',
          weekNumber: 3,
          title: 'Week 3: Schema Modeling, Indexing & Query Tuning',
          description: 'Design 3NF and Star Schema models. Analyze EXPLAIN query execution plans to identify table scans and bottlenecks.',
          estimatedHours: hours,
          deliverable: 'Optimized schema migration script with partitioned tables',
        },
        {
          id: 'm1_w4',
          weekNumber: 4,
          title: 'Week 4: Month 1 Mini-Capstone & SQL Assessment',
          description: 'Build a production SQL analytics dashboard aggregating campus placement and student performance data.',
          estimatedHours: hours,
          deliverable: 'Published SQL analytics repository + badge certification',
        },
      ],
    },
    {
      monthNumber: 2,
      stageTitle: 'MONTH 2: Deepen Core Domain Principles',
      phase: 'Expand Skills',
      focusSummary: `Master ${role.domain} Fundamentals & Modern Tooling`,
      actions: [
        `Study ${role.preparationAreas[0] || 'Core Domain Architectures'}`,
        'Implement 3 mini-benchmarks testing latency, accuracy and resource utilization',
        'Learn Git branch management and containerization basics (Docker)',
      ],
      targetMilestone: `Core theoretical & practical competence in ${role.requiredSkills[1]?.name || 'ML'}`,
      estimatedHoursPerWeek: hours,
      linkedOpportunityId: 'opp_07',
      weeks: [
        {
          id: 'm2_w1',
          weekNumber: 1,
          title: `Week 1: ${role.requiredSkills[1]?.name || 'Core Domain'} Fundamentals`,
          description: 'Comprehensive review of fundamental algorithms, mathematical intuition, and standard paradigms.',
          estimatedHours: hours,
          deliverable: 'Jupyter / Code notebook with benchmarked implementations',
        },
        {
          id: 'm2_w2',
          weekNumber: 2,
          title: 'Week 2: Modern Frameworks & Tooling Stack',
          description: 'Work with industry-standard libraries, configuration management, and modern developer tooling.',
          estimatedHours: hours,
          deliverable: 'Clean modular pipeline processing raw unstructured inputs',
        },
        {
          id: 'm2_w3',
          weekNumber: 3,
          title: 'Week 3: Containerization & Cloud Environment Setup',
          description: 'Write Dockerfiles, configure multi-stage builds, and test local container orchestration.',
          estimatedHours: hours,
          deliverable: 'Dockerized microservice running with health checks',
        },
        {
          id: 'm2_w4',
          weekNumber: 4,
          title: 'Week 4: Unit Testing, Linting & CI/CD Pipelines',
          description: 'Add automated unit tests (PyTest / Jest) and set up GitHub Actions CI workflow for linting and test passes.',
          estimatedHours: hours,
          deliverable: 'Passing CI/CD GitHub Action badge on repository',
        },
      ],
    },
    {
      monthNumber: 3,
      stageTitle: 'MONTH 3: Build Flagship End-to-End Capstone',
      phase: 'Build Project',
      focusSummary: 'Develop Signature Production-Grade Application',
      actions: [
        `Build: ${role.recommendedProjects[0] || 'End-to-End Scalable Application'}`,
        'Integrate clean REST APIs, structured database, and deployment container',
        'Publish clean GitHub documentation, architecture diagram, and live demo link',
      ],
      targetMilestone: '1 Tier-1 ready capstone project deployed on cloud',
      estimatedHoursPerWeek: hours,
      weeks: [
        {
          id: 'm3_w1',
          weekNumber: 1,
          title: 'Week 1: Architecture Design & Data Modeling',
          description: 'Draft system architecture diagram, API contract specification (OpenAPI), and database schema.',
          estimatedHours: hours,
          deliverable: 'Architecture diagram (Mermaid/Figma) and API schema draft',
        },
        {
          id: 'm3_w2',
          weekNumber: 2,
          title: 'Week 2: Backend Core Engine & API Implementation',
          description: 'Develop core business logic, asynchronous workers, validation middlewares, and database persistence.',
          estimatedHours: hours,
          deliverable: 'Tested REST/gRPC backend endpoints with error handling',
        },
        {
          id: 'm3_w3',
          weekNumber: 3,
          title: 'Week 3: Frontend Interface & Integration',
          description: 'Build responsive web interface with real-time state management, loading skeletons, and interactive visuals.',
          estimatedHours: hours,
          deliverable: 'Fully connected frontend and backend application',
        },
        {
          id: 'm3_w4',
          weekNumber: 4,
          title: 'Week 4: Cloud Deployment & Portfolio Showcase',
          description: 'Deploy to Vercel/Render/AWS, write comprehensive README with architecture GIF, and record 2-minute demo video.',
          estimatedHours: hours,
          deliverable: 'Live cloud URL + open source GitHub repo with demo',
        },
      ],
    },
    {
      monthNumber: 4,
      stageTitle: 'MONTH 4: Hackathon & Campus Lab Exposure',
      phase: 'Practical Exposure',
      focusSummary: 'Test Skills in Competitive & Collaborative Arenas',
      actions: [
        'Participate in HackTheCampus 2026 or University AI Fellowship',
        'Engage with industry mentors and campus alumni network',
        'Submit research abstract or open-source pull requests',
      ],
      targetMilestone: 'Recognized hackathon submission or faculty research fellowship entry',
      estimatedHoursPerWeek: hours,
      linkedOpportunityId: 'opp_01',
      weeks: [
        {
          id: 'm4_w1',
          weekNumber: 1,
          title: 'Week 1: Campus Team Formation & Ideation',
          description: 'Connect with complementary teammates via Campus Twin Matcher and finalize project problem statement.',
          estimatedHours: hours,
          deliverable: 'Registered team & approved project proposal',
        },
        {
          id: 'm4_w2',
          weekNumber: 2,
          title: 'Week 2: Rapid Hackathon Sprint & MVP Prototyping',
          description: '36-hour build sprint focusing on core differentiator, frictionless UX, and functional prototype.',
          estimatedHours: hours,
          deliverable: 'Functional hackathon submission with pitch deck',
        },
        {
          id: 'm4_w3',
          weekNumber: 3,
          title: 'Week 3: Faculty Research Lab Fellowship Outreach',
          description: 'Present project outcomes to Department Research Coordinators and explore undergraduate research credit.',
          estimatedHours: hours,
          deliverable: 'Faculty research lab meeting or formal review',
        },
        {
          id: 'm4_w4',
          weekNumber: 4,
          title: 'Week 4: Open Source Contribution',
          description: 'Identify good-first-issues in popular ecosystem repos and submit at least 2 reviewed Pull Requests.',
          estimatedHours: hours,
          deliverable: 'Merged PR or active open source contribution record',
        },
      ],
    },
    {
      monthNumber: 5,
      stageTitle: 'MONTH 5: Algorithmic & Interview Readiness',
      phase: 'Portfolio & Career Ready',
      focusSummary: 'Placement Assessment Mastery & System Design',
      actions: [
        'Complete top 75 Blind algorithmic patterns in C++ / Python',
        'Practice mock technical interviews with peers at ACM Chapter',
        'Craft STAR-method behavioral stories for project impact',
      ],
      targetMilestone: 'Consistent success on timed coding assessments',
      estimatedHoursPerWeek: hours,
      linkedOpportunityId: 'opp_08',
      weeks: [
        {
          id: 'm5_w1',
          weekNumber: 1,
          title: 'Week 1: Data Structures Drill (Trees, Graphs, Heaps)',
          description: 'Timed practice on DFS, BFS, Dijkstra, Trie, and Heap algorithms under 25-minute interview constraints.',
          estimatedHours: hours,
          deliverable: '20 algorithmic questions solved and reviewed',
        },
        {
          id: 'm5_w2',
          weekNumber: 2,
          title: 'Week 2: Dynamic Programming & Sliding Window Mastery',
          description: 'Solve core 1D and 2D DP patterns: Knapsack, LCS, LIS, and state compression.',
          estimatedHours: hours,
          deliverable: 'Cheat sheet of recurring algorithmic transformation templates',
        },
        {
          id: 'm5_w3',
          weekNumber: 3,
          title: 'Week 3: Low-Level & High-Level System Design',
          description: 'Study caching strategies (Redis), database replication, load balancers, rate limiters, and microservice decoupling.',
          estimatedHours: hours,
          deliverable: '2 end-to-end system design case studies documented',
        },
        {
          id: 'm5_w4',
          weekNumber: 4,
          title: 'Week 4: AI Mock Technical & HR Interviews',
          description: 'Complete 3 simulated interviews in the Campus Twin Prep Studio and refine behavioral STAR responses.',
          estimatedHours: hours,
          deliverable: 'Completed mock interview scorecards with >85% clarity score',
        },
      ],
    },
    {
      monthNumber: 6,
      stageTitle: 'MONTH 6: Target Role Placement Applications',
      phase: 'Portfolio & Career Ready',
      focusSummary: 'Direct Tier-1 Tech & Internship Applications',
      actions: [
        `Submit applications to ${role.title} openings (Databricks, Google, Microsoft)`,
        'Leverage verified campus twin credentials and faculty recommendations',
        'Attend on-campus interview drives with tailored portfolios',
      ],
      targetMilestone: 'Offers secured in target career trajectory',
      estimatedHoursPerWeek: hours,
      linkedOpportunityId: 'opp_05',
      weeks: [
        {
          id: 'm6_w1',
          weekNumber: 1,
          title: 'Week 1: Resume Tailoring & ATS Optimization',
          description: 'Scan resume against target role in Campus Twin Resume Studio to reach 90%+ ATS keyword compatibility.',
          estimatedHours: hours,
          deliverable: 'Tailored 1-page PDF resume with verified project links',
        },
        {
          id: 'm6_w2',
          weekNumber: 2,
          title: 'Week 2: Tier-1 Company Campus Drive Submissions',
          description: 'Apply to top hiring partners through campus placement portal with verified Lakehouse credentials.',
          estimatedHours: hours,
          deliverable: '5+ Tier-1 job / internship applications submitted',
        },
        {
          id: 'm6_w3',
          weekNumber: 3,
          title: 'Week 3: Coding Rounds & Technical Screenings',
          description: 'Participate in online assessment (OA) rounds with optimal time-complexity solutions.',
          estimatedHours: hours,
          deliverable: 'Cleared OA stages and technical round bookings',
        },
        {
          id: 'm6_w4',
          weekNumber: 4,
          title: 'Week 4: Final Round Interviews & Offer Negotiation',
          description: 'Perform in managerial & technical interviews with confidence, clarity, and well-researched company questions.',
          estimatedHours: hours,
          deliverable: 'Final selection and role placement offer!',
        },
      ],
    },
  ];

  return steps;
}

/**
 * Calculates What-If Scenario Comparison
 */
export function calculateWhatIfScenario(
  student: StudentProfile,
  params: {
    targetRoleTitle: string;
    weeklyHours: number;
    skillUpgrades: { skill: string; from: string; to: string }[];
    focus: 'career' | 'research' | 'entrepreneurship';
  }
): WhatIfScenarioResult {
  const currentReadiness = calculateProfileReadiness(student, student.careerGoal).totalScore;

  // Build synthetic modified student profile
  const modifiedStudent: StudentProfile = {
    ...student,
    careerGoal: params.targetRoleTitle,
    weeklyHours: params.weeklyHours,
    primaryFocus: params.focus,
    skills: student.skills.map((s) => {
      const upgrade = params.skillUpgrades.find((u) => u.skill.toLowerCase() === s.name.toLowerCase());
      if (upgrade) {
        return { ...s, level: upgrade.to as SkillProficiency };
      }
      return s;
    }),
  };

  // Add any newly added skills
  params.skillUpgrades.forEach((u) => {
    if (!modifiedStudent.skills.some((s) => s.name.toLowerCase() === u.skill.toLowerCase())) {
      modifiedStudent.skills.push({ name: u.skill, level: u.to as SkillProficiency });
    }
  });

  const newReadiness = calculateProfileReadiness(modifiedStudent, params.targetRoleTitle).totalScore;
  const readinessDelta = newReadiness - currentReadiness;

  // Gaps resolved
  const currentGaps = getSkillGapsForRole(student, params.targetRoleTitle);
  const newGaps = getSkillGapsForRole(modifiedStudent, params.targetRoleTitle);
  const gapsResolvedCount = currentGaps.filter((g) => g.gapSeverity === 'High').length -
    newGaps.filter((g) => g.gapSeverity === 'High').length;

  const remainingGaps = newGaps.filter((g) => g.gapSeverity !== 'Low').map((g) => g.skillName);

  // Unlocked opportunities
  const unlocked = MASTER_OPPORTUNITIES.filter((opp) => {
    const hoursFit = opp.hoursPerWeek <= params.weeklyHours + 2;
    const cgpaFit = !opp.eligibility.minCgpa || student.cgpa >= opp.eligibility.minCgpa;
    const skillsFit = opp.requiredSkills.every((req) =>
      modifiedStudent.skills.some((s) => s.name.toLowerCase() === req.toLowerCase())
    );
    return hoursFit && cgpaFit && skillsFit;
  });

  let effortFeasibility: WhatIfScenarioResult['effortFeasibility'] = 'Moderate Feasibility';
  if (params.weeklyHours >= 8 && params.skillUpgrades.length <= 2) {
    effortFeasibility = 'High Feasibility';
  } else if (params.weeklyHours < 6 && params.skillUpgrades.length >= 2) {
    effortFeasibility = 'Intense Effort Required';
  }

  let rationale = `Targeting ${params.targetRoleTitle} with ${params.weeklyHours} hrs/week and upgrading ${params.skillUpgrades.map((u) => u.skill).join(', ')} elevates readiness by ${readinessDelta >= 0 ? '+' : ''}${readinessDelta} points.`;
  if (params.focus === 'research') {
    rationale += ' Pivoting to Academic Research emphasizes faculty labs and theoretical publications over standard dev sprints.';
  } else if (params.focus === 'entrepreneurship') {
    rationale += ' Pivoting to Entrepreneurship unlocks campus incubation grants and rapid prototyping hackathons.';
  }

  return {
    targetRole: params.targetRoleTitle,
    weeklyHours: params.weeklyHours,
    skillUpgrades: params.skillUpgrades,
    focus: params.focus,
    baseReadiness: currentReadiness,
    newReadiness,
    readinessDelta,
    gapsResolvedCount: Math.max(0, gapsResolvedCount),
    remainingGaps,
    unlockedOpportunities: unlocked,
    effortFeasibility,
    rationale,
  };
}

/**
 * Filter opportunities based on student eligibility and weekly time commitment
 */
export function getRecommendedOpportunities(
  student: StudentProfile,
  filterType?: string
): Opportunity[] {
  return MASTER_OPPORTUNITIES.filter((opp) => {
    if (filterType && filterType !== 'All' && opp.type !== filterType) {
      return false;
    }
    // CGPA check
    if (opp.eligibility.minCgpa && student.cgpa < opp.eligibility.minCgpa) {
      return false;
    }
    // Dept check
    if (
      opp.eligibility.allowedDepts &&
      opp.eligibility.allowedDepts.length > 0 &&
      !opp.eligibility.allowedDepts.includes(student.department)
    ) {
      return false;
    }
    return true;
  });
}

/**
 * Filter placement records and assess student eligibility
 */
export function getAnalyzedPlacements(student: StudentProfile): PlacementCompanyRecord[] {
  return MASTER_PLACEMENT_RECORDS.map((record) => {
    let eligibilityMatch: PlacementCompanyRecord['eligibilityMatch'] = 'Eligible';
    let reason = `CGPA ${student.cgpa} meets the ${record.minCgpa} requirement.`;

    if (student.cgpa < record.minCgpa) {
      eligibilityMatch = 'Borderline CGPA';
      reason = `Current CGPA (${student.cgpa}) is slightly below the ${record.minCgpa} cut-off. Maintain SGPA > 8.5 to cross threshold.`;
    }

    const missingSkills = record.requiredSkills.filter(
      (rs) => !student.skills.some((s) => s.name.toLowerCase() === rs.toLowerCase())
    );

    if (missingSkills.length > 1) {
      if (eligibilityMatch === 'Eligible') {
        eligibilityMatch = 'Missing Prerequisite Skill';
        reason = `Academic criteria met, but missing core requirements in: ${missingSkills.join(', ')}.`;
      }
    }

    return {
      ...record,
      eligibilityMatch,
      eligibilityReason: reason,
    };
  });
}
