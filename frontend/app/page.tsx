"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Compass, GitFork, Scale, Database, ArrowRight, CheckCircle2, ShieldCheck, Cpu, Code2, Users, Microscope } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [goalInput, setGoalInput] = useState("");

  const popularGoals = [
    { label: "Become an AI Engineer", query: "I want to become an AI engineer. I know Python and have 6 hours per week." },
    { label: "Get Research Experience", query: "I want computer vision research experience with faculty mentorship." },
    { label: "Launch a Tech Startup", query: "I want to build a startup and pitch for seed grant funding." },
    { label: "Learn Machine Learning", query: "I know Python and want to learn applied machine learning in 4 hours per week." },
  ];

  const handleSearchGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim()) return;
    router.push(`/explore?q=${encodeURIComponent(goalInput)}`);
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 bg-gradient-to-b from-brand-50/60 via-white to-slate-50 border-b border-slate-200/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-pulse" />
            <span>Databricks Genie-Powered "What-If" Campus Explorer</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Explore Your Campus.
            <br />
            <span className="bg-gradient-to-r from-brand-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Discover Your Path.
            </span>
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Campus Twin connects courses, clubs, events, research projects, facilities, skills, and city opportunities into personalized, data-backed candidate paths.
          </p>

          {/* Primary Goal Input Launcher */}
          <form onSubmit={handleSearchGoal} className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row items-center bg-white p-2 rounded-2xl shadow-xl border border-brand-200 gap-2">
              <input
                type="text"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder="What are you trying to achieve? (e.g. 'Become an AI engineer with 6h/wk')"
                className="w-full text-sm px-4 py-3 text-slate-800 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold rounded-xl text-sm shadow-glow flex items-center justify-center space-x-2 shrink-0 transition-all"
              >
                <span>Explore My Path</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Popular Goal Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mr-1">Popular Goals:</span>
            {popularGoals.map((g, idx) => (
              <button
                key={idx}
                onClick={() => router.push(`/explore?q=${encodeURIComponent(g.query)}`)}
                className="px-3 py-1.5 bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-300 text-slate-700 text-xs font-medium rounded-full shadow-sm transition-all"
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Flow Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
            The Core Product Experience
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Moving from "finding information" to "exploring possibilities."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { step: "1. ASK", desc: "Describe your goal in natural language with time & skill constraints", icon: Sparkles },
            { step: "2. EXPLORE", desc: "Databricks Genie queries connected campus datasets", icon: Compass },
            { step: "3. PATH", desc: "Constructs personalized candidate journey timelines", icon: GitFork },
            { step: "4. WHAT-IF", desc: "Swap components, reduce hours, or change goals in real time", icon: Cpu },
            { step: "5. COMPARE", desc: "Compare paths side by side and understand exact trade-offs", icon: Scale },
          ].map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center hover:border-brand-300 transition-all">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-brand-700 mb-2">{s.step}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* What-If Feature Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full text-brand-300 text-xs font-semibold border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>Non-Negotiable Core Feature</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                The What-If Campus Explorer
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                What if you replace a student club with faculty computer vision research? What if you only have 4 hours per week instead of 6? What if you already know Python?
                <br /><br />
                Campus Twin regenerates paths, validates prerequisites, recalculates metrics, and presents explicit trade-off explanations.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/what-if"
                  className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-sm shadow-glow flex items-center space-x-2 transition-all"
                >
                  <span>Try What-If Simulator</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/compare"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm border border-white/20 transition-all"
                >
                  <span>Compare Candidate Paths</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="text-xs font-bold text-brand-300 uppercase tracking-wider">Example Live Transformation</div>
              <div className="bg-white/10 p-3 rounded-xl text-xs space-y-2">
                <div className="text-slate-400">ORIGINAL PATH:</div>
                <div className="font-mono text-emerald-300">AI Course → ML Workshop → AI Club → Hackathon</div>
              </div>
              <div className="text-xs text-amber-300 font-semibold">User: "What if I replace AI Club with research?"</div>
              <div className="bg-white/10 p-3 rounded-xl text-xs space-y-2">
                <div className="text-slate-400">REGENERATED PATH:</div>
                <div className="font-mono text-brand-300">AI Course → PyTorch Workshop → Vision Research → Lab</div>
              </div>
              <div className="text-[11px] text-slate-300 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Research exposure +50% | Faculty interaction +51% | Same 6h/wk</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Databricks Technology Architecture Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <Database className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Databricks Free Edition & Unity Catalog</h3>
              <p className="text-xs text-slate-500 max-w-xl mt-1">
                Databricks Genie Agent queries 8 connected campus datasets (`courses`, `clubs`, `events`, `research_projects`, `opportunities`, `facilities`, `skills`, `city_events`) to discover relationships.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-600 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 shrink-0">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>Synthetic & Anonymized Campus Data</span>
          </div>
        </div>
      </section>
    </div>
  );
}
