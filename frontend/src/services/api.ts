/**
 * Campus Twin - Universal Client API Integration Layer
 * Connects frontend directly to Express backend & Databricks endpoints.
 */

import { StudentProfile, WhatIfScenarioResult } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Syncs student profile with backend & persists to Databricks
 */
export async function syncProfileWithBackend(profile: StudentProfile): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/api/profile/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${profile.id || 'usr_demo_01'}`,
      },
      body: JSON.stringify({
        preferredName: profile.name,
        fieldOfStudy: profile.department,
        year: profile.year,
        semester: profile.semester,
        cgpa: profile.cgpa,
        weeklyAvailableHours: profile.weeklyHours,
        careerGoals: [profile.careerGoal],
        skills: profile.skills.map((s) => s.name),
        interests: profile.interests,
      }),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend sync fallback to local store:', err);
    return { success: true, localOnly: true };
  }
}

/**
 * Queries Databricks Genie AI / Campus Assistant
 */
export async function queryGenieAssistant(query: string, student: StudentProfile): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/api/genie/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        studentProfile: student,
      }),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Genie API fallback:', err);
    return null;
  }
}

/**
 * Runs What-If simulation with backend validation
 */
export async function simulateWhatIfBackend(
  scenario: string,
  parameters: any,
  student: StudentProfile
): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/api/what-if`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenario_type: scenario,
        parameters,
        student_profile: student,
      }),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('What-If simulation backend fallback:', err);
    return null;
  }
}

/**
 * Fetches Lakehouse connection & sync status
 */
export async function getDatabricksStatus(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/api/databricks/status`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      connected: false,
      catalog: 'campus_twin',
      schema: 'campus',
      mode: 'Synthetic Open Data Mode',
    };
  }
}
