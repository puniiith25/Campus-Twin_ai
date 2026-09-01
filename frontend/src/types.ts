/**
 * Campus Twin - Core Type Definitions
 */

export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced';

export interface StudentSkill {
  name: string;
  level: SkillProficiency;
}

export interface StudentProject {
  id: string;
  title: string;
  description: string;
  tech: string[];
  impact?: string;
  link?: string;
}

export interface StudentInternship {
  id: string;
  role: string;
  company: string;
  duration: string;
  domain: string;
}

export interface StudentHackathon {
  id: string;
  name: string;
  project: string;
  outcome?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  department: string;
  semester: number;
  year: number;
  cgpa: number;
  sgpa?: number;
  academicStrengths: string[];
  skills: StudentSkill[];
  interests: string[];
  projects: StudentProject[];
  internships: StudentInternship[];
  hackathons: StudentHackathon[];
  certifications: string[];
  researchExperience: string[];
  clubs: string[];
  careerGoal: string;
  targetType: 'specific' | 'exploring';
  targetRoles: string[];
  weeklyHours: number;
  primaryFocus: 'career' | 'research' | 'entrepreneurship';
  createdAt: string;
  updatedAt: string;
}

export interface RequiredSkillDef {
  name: string;
  level: SkillProficiency;
  weight: number; // 1-3 importance
}

export interface CareerRole {
  id: string;
  title: string;
  category: string;
  domain: string;
  description: string;
  matchScore: number; // 0-100 derived
  alignment: 'Strong alignment' | 'Good alignment' | 'Developing alignment';
  whyFits: string[];
  whatMissing: string[];
  avgSalaryRange: string;
  placementRate: string;
  requiredSkills: RequiredSkillDef[];
  preferredSkills: string[];
  minimumCGPA: number;
  recommendedProjects: string[];
  preparationAreas: string[];
  associatedOpportunities: string[];
  marketDemand: 'Very High' | 'High' | 'Growing' | 'Specialized';
  dayInLifeSnippet: string;
}

export type OpportunityType =
  | 'Internship'
  | 'Hackathon'
  | 'Workshop'
  | 'Course'
  | 'Research Lab'
  | 'Faculty Project'
  | 'Certification'
  | 'Campus Club';

export interface Opportunity {
  id: string;
  title: string;
  type: OpportunityType;
  provider: string; // e.g. "Department of CSE", "Innovation Cell", "NVIDIA Lab"
  domain: string;
  description: string;
  requiredSkills: string[];
  eligibility: {
    minCgpa?: number;
    minSemester?: number;
    allowedDepts?: string[];
  };
  timeCommitment: string;
  hoursPerWeek: number;
  deadline?: string;
  campusResource: string;
  whyRecommended: string;
  nextAction: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  stipendOrPrize?: string;
  location?: string;
  externalLink?: string;
  isDemoData: boolean;
}

export interface SkillGap {
  skillName: string;
  studentLevel: 'None' | SkillProficiency;
  targetLevel: SkillProficiency;
  gapSeverity: 'Low' | 'Moderate' | 'High';
  priority: number;
  actionPlan: string;
  recommendedResources: {
    title: string;
    type: string;
    provider: string;
    hours: number;
  }[];
  impactExplanation: string;
}

export interface RoadmapWeekTask {
  id: string;
  weekNumber: number; // 1, 2, 3, 4
  title: string;
  description: string;
  estimatedHours: number;
  deliverable: string;
  completed?: boolean;
}

export interface RoadmapStep {
  monthNumber: number;
  stageTitle: string;
  phase: 'Today' | 'Strengthen Core' | 'Expand Skills' | 'Build Project' | 'Practical Exposure' | 'Portfolio & Career Ready';
  focusSummary: string;
  actions: string[];
  targetMilestone: string;
  estimatedHoursPerWeek: number;
  linkedOpportunityId?: string;
  completed?: boolean;
  weeks?: RoadmapWeekTask[];
}

export interface PlacementCompanyRecord {
  id: string;
  company: string;
  role: string;
  tier: 'Tier 1 / Super Dream' | 'Tier 2 / Core Tech' | 'R&D / Specialist' | 'Campus Elite';
  minCgpa: number;
  requiredSkills: string[];
  avgPackage: string;
  historicalHiresAnnual: number;
  selectionProcess: string;
  eligibilityMatch: 'Eligible' | 'Borderline CGPA' | 'Missing Prerequisite Skill';
  eligibilityReason: string;
  prepRecommendation: string;
}

export interface WhatIfScenarioResult {
  targetRole: string;
  weeklyHours: number;
  skillUpgrades: { skill: string; from: string; to: string }[];
  focus: 'career' | 'research' | 'entrepreneurship';
  baseReadiness: number;
  newReadiness: number;
  readinessDelta: number;
  gapsResolvedCount: number;
  remainingGaps: string[];
  unlockedOpportunities: Opportunity[];
  effortFeasibility: 'High Feasibility' | 'Moderate Feasibility' | 'Intense Effort Required';
  rationale: string;
}

export interface GenieStructuredResponse {
  recommendation: string;
  why: string;
  skillGaps: string[];
  relevantOpportunities: {
    title: string;
    type: string;
    provider: string;
    timeCommitment: string;
  }[];
  nextAction: string;
  alternativePath: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  structuredResponse?: GenieStructuredResponse;
  suggestedPrompts?: string[];
}
