export interface StudentSkill {
  name: string;
  level: string;
}

export interface StudentProfile {
  student_id: string;
  name: string;
  goal: string;
  interests: string[];
  skills: StudentSkill[];
  available_hours_per_week: number;
  preferred_opportunity_types: string[];
  career_interest_weight: number;
  research_interest_weight: number;
  networking_interest_weight: number;
}

export interface OpportunityItem {
  id: string;
  name: string;
  type: string;
  description: string;
  hours_per_week: number;
  skills_developed: string[];
  prerequisites: string[];
  difficulty: string;
  score: number;
  match_reasons: string[];
  category_or_department?: string;
  faculty_or_organizer?: string;
  location?: string;
}

export interface PathStep {
  step_id: string;
  type: string;
  name: string;
  description: string;
  hours_per_week: number;
  duration: string;
  skills: string[];
  reason: string;
  prerequisites: string[];
  dependencies: string[];
}

export interface PathMetrics {
  goal_alignment: number;
  research_exposure: number;
  networking_value: number;
  industry_exposure: number;
  project_experience: number;
  faculty_interaction: number;
  overall_score: number;
}

export interface CampusPath {
  path_id: string;
  title: string;
  focus_type: string;
  description: string;
  goal: string;
  steps: PathStep[];
  total_hours_per_week: number;
  available_hours_per_week: number;
  within_limit: boolean;
  skills_gained: string[];
  metrics: PathMetrics;
  explanation: string;
}

export interface WhatIfScenario {
  operation: string;
  target?: string;
  replacement_type?: string;
  new_time_limit?: number;
  new_goal?: string;
}

export interface MetricComparison {
  metric_name: string;
  original_val: number;
  alternative_val: number;
  delta: number;
}

export interface WhatIfResponse {
  original_path: CampusPath;
  alternative_path: CampusPath;
  changes: string[];
  metric_comparisons: MetricComparison[];
  trade_offs: string[];
  explanation: string;
}

export interface ComparisonResponse {
  path_a: CampusPath;
  path_b: CampusPath;
  differences: string[];
  metrics_comparison: Record<string, { path_a: number; path_b: number }>;
  recommended_path: string;
  reasoning: string;
}
