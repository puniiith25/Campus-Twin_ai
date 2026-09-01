const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function askChat(question, studentProfile) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, student_profile: studentProfile }),
  });
  if (!res.ok) throw new Error("Failed to connect to Campus Twin Chat API");
  return res.json();
}

export async function fetchPaths(goal = "AI Engineer", availableHours = 6.0) {
  const res = await fetch(`${API_BASE}/api/path`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ goal, available_hours: availableHours }),
  });
  if (!res.ok) throw new Error("Failed to fetch paths");
  return res.json();
}

export async function runWhatIfScenario(scenario, basePathId = "path_career_focus", customBasePath) {
  const res = await fetch(`${API_BASE}/api/what-if`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      base_path_id: basePathId,
      custom_base_path: customBasePath,
      scenario,
    }),
  });
  if (!res.ok) throw new Error("Failed to run What-If scenario");
  return res.json();
}

export async function fetchComparison(pathA, pathB) {
  const res = await fetch(`${API_BASE}/api/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path_a: pathA, path_b: pathB }),
  });
  if (!res.ok) throw new Error("Failed to compare paths");
  return res.json();
}

export async function fetchOpportunities(filters) {
  const params = new URLSearchParams();
  if (filters?.type) params.append("type", filters.type);
  if (filters?.skill) params.append("skill", filters.skill);
  if (filters?.max_hours) params.append("max_hours", filters.max_hours.toString());

  const res = await fetch(`${API_BASE}/api/opportunities?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch opportunities");
  return res.json();
}

export async function fetchOpportunityDetail(id) {
  const res = await fetch(`${API_BASE}/api/opportunities/${id}`);
  if (!res.ok) throw new Error("Opportunity not found");
  return res.json();
}

export async function fetchProfile() {
  const res = await fetch(`${API_BASE}/api/profile`);
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

export async function saveProfile(profile) {
  const res = await fetch(`${API_BASE}/api/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error("Failed to save profile");
  return res.json();
}
