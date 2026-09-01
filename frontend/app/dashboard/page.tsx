"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Sparkles, GitFork, Award, Clock, History, CheckCircle2, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const [savedPaths] = useState([
    {
      id: "path_career_focus",
      title: "Path A — Career & Industry Focus",
      goal: "AI Engineer",
      hours: "6.0 hrs/wk",
      score: "88.5/100",
      skills: ["Python", "Machine Learning", "Deep Learning", "Generative AI"],
    },
    {
      id: "path_research_focus",
      title: "Path B — Research & Academic Focus",
      goal: "AI Engineer",
      hours: "6.0 hrs/wk",
      score: "90.0/100",
      skills: ["Python", "Computer Vision", "Research Methods", "Faculty Mentorship"],
    },
  ]);

  const [whatIfHistory] = useState([
    { scenario: "Replace AI Club with Research", result: "+50% Research Exposure, 6h/wk", time: "2 hours ago" },
    { scenario: "Reduce Weekly Budget from 6h to 4h", result: "Streamlined AI Course + Workshop", time: "Yesterday" },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center space-x-2">
          <span>Student Journey Dashboard</span>
          <LayoutDashboard className="w-6 h-6 text-brand-600" />
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Overview of your current target goal, saved candidate paths, skill coverage, and What-If history.
        </p>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Target Goal</div>
          <div className="text-xl font-extrabold text-brand-700 mt-1">AI Engineer</div>
          <div className="text-[11px] text-emerald-600 mt-2 font-medium">✓ Active Explorer Target</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Weekly Time Budget</div>
          <div className="text-xl font-extrabold text-slate-900 mt-1">6.0 Hours / Wk</div>
          <div className="text-[11px] text-slate-500 mt-2 font-medium">Within target limit</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Saved Candidate Paths</div>
          <div className="text-xl font-extrabold text-slate-900 mt-1">2 Paths</div>
          <div className="text-[11px] text-brand-600 mt-2 font-medium">Career vs Research</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Skill Coverage</div>
          <div className="text-xl font-extrabold text-emerald-600 mt-1">6 Core Skills</div>
          <div className="text-[11px] text-slate-500 mt-2 font-medium">Python, ML, PyTorch +</div>
        </div>
      </div>

      {/* Saved Paths Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-900 flex items-center space-x-2">
            <GitFork className="w-5 h-5 text-brand-600" />
            <span>Saved Candidate Paths</span>
          </h3>
          <Link href="/path" className="text-xs font-bold text-brand-600 hover:underline">
            View Journey Visualizer →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedPaths.map((sp) => (
            <div key={sp.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">{sp.title}</h4>
                <span className="text-xs font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                  {sp.score}
                </span>
              </div>
              <div className="text-xs text-slate-500">Weekly Commitment: {sp.hours}</div>
              <div className="flex flex-wrap gap-1">
                {sp.skills.map((sk) => (
                  <span key={sk} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-700">
                    +{sk}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What-If History */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-lg text-slate-900 flex items-center space-x-2">
          <History className="w-5 h-5 text-indigo-600" />
          <span>What-If Experiment History</span>
        </h3>

        <div className="space-y-3">
          {whatIfHistory.map((h, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brand-500" />
                <span className="font-semibold text-slate-800">{h.scenario}</span>
              </div>
              <div className="text-right">
                <span className="text-emerald-700 font-bold block">{h.result}</span>
                <span className="text-[10px] text-slate-400">{h.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
