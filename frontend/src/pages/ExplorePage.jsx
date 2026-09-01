import React, { useState } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Sparkles, Clock, Award, Target } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q");

  const [profile] = useState({
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

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left/Main Chat Interface */}
        <div className="lg:col-span-8">
          <ChatInterface studentProfile={profile} initialQuery={initialQuery} />
        </div>

        {/* Right Student Profile Summary Panel */}

      </div>
    </div>
  );
}
