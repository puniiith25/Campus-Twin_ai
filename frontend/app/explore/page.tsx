"use client";

import React, { useState } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { StudentProfile } from "@/types";
import { Sparkles, User, Clock, Award, Target, BookOpen } from "lucide-react";

export default function ExplorePage() {
  const [profile, setProfile] = useState<StudentProfile>({
    student_id: "demo_student_01",
    name: "Alex Morgan",
    goal: "AI Engineer",
    interests: ["AI", "Machine Learning", "Research"],
    skills: [{ name: "Python", level: "Intermediate" }],
    available_hours_per_week: 6.0,
    preferred_opportunity_types: ["Course", "Research", "Club"],
    career_interest_weight: 0.4,
    research_interest_weight: 0.3,
    networking_interest_weight: 0.3,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center space-x-2">
          <span>Student Explore Workspace</span>
          <Sparkles className="w-6 h-6 text-brand-600" />
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Ask natural language questions to Databricks Genie and explore connected campus opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left/Main Chat Interface */}
        <div className="lg:col-span-8">
          <ChatInterface studentProfile={profile} />
        </div>

        {/* Right Student Profile Summary Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-lg border border-brand-200">
                AM
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">{profile.name}</h3>
                <span className="text-xs font-semibold px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full border border-brand-200">
                  Target: {profile.goal}
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-semibold text-slate-500 uppercase tracking-wider block mb-1 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  Available Time Limit
                </span>
                <span className="text-sm font-bold text-slate-900">{profile.available_hours_per_week} Hours / Week</span>
              </div>

              <div>
                <span className="font-semibold text-slate-500 uppercase tracking-wider block mb-1 flex items-center">
                  <Award className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  Existing Skills
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profile.skills.map((s) => (
                    <span key={s.name} className="px-2.5 py-1 bg-slate-100 text-slate-700 font-medium rounded-md">
                      {s.name} ({s.level})
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-500 uppercase tracking-wider block mb-1 flex items-center">
                  <Target className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  Interests
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profile.interests.map((i) => (
                    <span key={i} className="px-2.5 py-1 bg-brand-50 text-brand-700 font-medium rounded-md border border-brand-200">
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-brand-900 text-white rounded-2xl p-6 shadow-md">
            <h4 className="font-bold text-sm text-white mb-2">Databricks Genie Tip</h4>
            <p className="text-xs text-brand-100 leading-relaxed">
              Ask Genie specific queries like: "Which courses satisfy prerequisites for the Databricks AI Fellowship?" or "What if I only have 4 hours per week?"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
