"use client";

import React, { useState } from "react";
import { StudentProfile } from "@/types";
import { saveProfile } from "@/lib/api";
import { User, Save, CheckCircle2, Award, Clock, Target } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<StudentProfile>({
    student_id: "demo_student_01",
    name: "Alex Morgan",
    goal: "AI Engineer",
    interests: ["AI", "Machine Learning", "Research"],
    skills: [
      { name: "Python", level: "Intermediate" },
      { name: "SQL", level: "Beginner" },
    ],
    available_hours_per_week: 6.0,
    preferred_opportunity_types: ["Course", "Research", "Club"],
    career_interest_weight: 0.4,
    research_interest_weight: 0.3,
    networking_interest_weight: 0.3,
  });

  const [saved, setSaved] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveProfile(profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    setProfile({
      ...profile,
      skills: [...profile.skills, { name: newSkill.trim(), level: "Intermediate" }],
    });
    setNewSkill("");
  };

  const removeSkill = (index: number) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center space-x-2">
          <span>Student Profile & Preferences</span>
          <User className="w-6 h-6 text-brand-600" />
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Customize your target goal, skill matrix, available weekly hours, and focus weightings.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Name & Goal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Student Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Goal</label>
            <input
              type="text"
              value={profile.goal}
              onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white font-medium"
            />
          </div>
        </div>

        {/* Weekly Commitment Slider */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Available Weekly Hours: <span className="font-bold text-brand-600">{profile.available_hours_per_week} Hours/Wk</span>
          </label>
          <input
            type="range"
            min={2}
            max={20}
            step={1}
            value={profile.available_hours_per_week}
            onChange={(e) => setProfile({ ...profile, available_hours_per_week: Number(e.target.value) })}
            className="w-full accent-brand-600"
          />
        </div>

        {/* Skill Matrix */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">Existing Skill Matrix</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {profile.skills.map((sk, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-slate-100 text-slate-800 text-xs font-medium rounded-lg border border-slate-200 flex items-center space-x-2"
              >
                <span>{sk.name} ({sk.level})</span>
                <button type="button" onClick={() => removeSkill(idx)} className="text-slate-400 hover:text-rose-600 font-bold ml-1">
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-2 max-w-md">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a new skill (e.g. PyTorch)..."
              className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl"
            >
              Add Skill
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold rounded-xl text-xs shadow-glow flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Preferences</span>
          </button>

          {saved && (
            <span className="text-xs text-emerald-600 font-bold flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1" /> Profile saved successfully!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
