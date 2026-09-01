/**
 * Campus Twin - Entry Screen (Welcome Landing)
 * Locked palette: Warm White (#F8FAF9), Deep Navy (#0B1F33), Teal (#167C80), Emerald (#1F8A70)
 */

import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Compass,
  GitBranch,
  Target,
  Route,
  MessageSquareText,
  ShieldCheck,
  GraduationCap,
  Database,
} from 'lucide-react';

interface WelcomeLandingProps {
  onStartPath: () => void;
  onUseDemoProfile: () => void;
  onOpenNaturalSetup: (initialPrompt?: string) => void;
  onOpenGenie: () => void;
}

export const WelcomeLanding: React.FC<WelcomeLandingProps> = ({
  onStartPath,
  onUseDemoProfile,
  onOpenNaturalSetup,
  onOpenGenie,
}) => {
  const [naturalText, setNaturalText] = useState('');

  const samplePrompts = [
    "I'm a CSE 4th sem student with 8.2 CGPA interested in AI & built 2 projects",
    "I study IT in 3rd year with 7.8 CGPA, know Python & SQL, looking for internships",
    "I'm in Electronics 2nd year, not sure which tech path fits my programming skills",
  ];

  const handleQuickPrompt = (prompt: string) => {
    onOpenNaturalSetup(prompt);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (naturalText.trim()) {
      onOpenNaturalSetup(naturalText.trim());
    } else {
      onStartPath();
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-[#F8FAF9] text-[#17212B]">
      {/* Top Banner / Intelligence Status */}
      <div className="w-full bg-[#EEF3F2] border-b border-[#D1D9E0]/50 py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs text-[#52606D]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#1F8A70] inline-block" />
            <span className="font-semibold text-[#0B1F33]">Campus Twin Intelligence</span>
            <span className="text-[#7B8794]">·</span>
            <span>Databricks Connected Lakehouse · Demo Campus Catalog</span>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-[11px] text-[#7B8794]">
            <span>✓ Deterministic Skill Reasoning</span>
            <span>✓ Explainable Placement Readiness</span>
            <span>✓ Real Campus Resource Mapping</span>
          </div>
        </div>
      </div>

      {/* Hero Content Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16 flex-1 flex flex-col justify-center">
        {/* Brand Badge */}
        <div className="inline-flex items-center self-start space-x-2 px-3 py-1 rounded-full bg-[#EEF3F2] border border-[#167C80]/20 text-[#167C80] text-xs font-semibold mb-6">
          <GitBranch className="w-3.5 h-3.5" />
          <span>Student Career Intelligence Platform</span>
        </div>

        {/* Major Headings */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0B1F33] tracking-tight leading-[1.1]">
            Know where you stand. <br />
            <span className="text-[#167C80]">See where you can go.</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#52606D] font-normal leading-relaxed">
            Explore your campus ecosystem. Connect your academic standing, skills, and projects with real career pathways, placement criteria, and actionable next steps.
          </p>
        </div>

        {/* Branching Path Visual Concept */}
        <div className="my-8 p-6 rounded-2xl bg-white border border-[#D1D9E0]/60 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#7B8794] mb-4 flex items-center justify-between">
            <span>The Four Core Questions Campus Twin Answers</span>
            <span className="text-[11px] text-[#167C80] font-medium hidden sm:inline">Connected Data Architecture</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#F8FAF9] border border-[#EEF3F2]">
              <div className="w-8 h-8 rounded-lg bg-[#102A43] text-white flex items-center justify-center font-bold text-xs mb-2.5">
                01
              </div>
              <h3 className="font-display font-semibold text-[#0B1F33] text-sm mb-1">
                Where am I now?
              </h3>
              <p className="text-xs text-[#52606D] leading-relaxed">
                Objective Profile Readiness score based on CGPA, current skills, and project evidence.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAF9] border border-[#EEF3F2]">
              <div className="w-8 h-8 rounded-lg bg-[#167C80] text-white flex items-center justify-center font-bold text-xs mb-2.5">
                02
              </div>
              <h3 className="font-display font-semibold text-[#0B1F33] text-sm mb-1">
                Where can I go?
              </h3>
              <p className="text-xs text-[#52606D] leading-relaxed">
                Personalized Career Map with aligned industry roles and grad school trajectories.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAF9] border border-[#EEF3F2]">
              <div className="w-8 h-8 rounded-lg bg-[#1F8A70] text-white flex items-center justify-center font-bold text-xs mb-2.5">
                03
              </div>
              <h3 className="font-display font-semibold text-[#0B1F33] text-sm mb-1">
                What fits me?
              </h3>
              <p className="text-xs text-[#52606D] leading-relaxed">
                Verified campus workshops, hackathons, faculty research labs, and tier-1 internships.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAF9] border border-[#EEF3F2]">
              <div className="w-8 h-8 rounded-lg bg-[#C9A96E] text-[#0B1F33] flex items-center justify-center font-bold text-xs mb-2.5">
                04
              </div>
              <h3 className="font-display font-semibold text-[#0B1F33] text-sm mb-1">
                What should I do next?
              </h3>
              <p className="text-xs text-[#52606D] leading-relaxed">
                A structured month-by-month roadmap tailored to your actual weekly availability.
              </p>
            </div>
          </div>
        </div>

        {/* Primary & Secondary Call to Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <button
            onClick={onStartPath}
            className="flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-[#167C80] hover:bg-[#126467] text-white font-medium text-base shadow-sm transition-all transform active:scale-[0.99]"
          >
            <span>Start My Career Path</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onUseDemoProfile}
            className="flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl bg-white hover:bg-[#EEF3F2] text-[#0B1F33] border border-[#D1D9E0] font-medium text-base transition-colors cursor-pointer"
          >
            <span>Explore Demo Profile (Ananya Rao · CSE)</span>
          </button>
        </div>
      </div>

      {/* Trust & Architecture Footer Bar */}
      <div className="border-t border-[#EEF3F2] bg-white py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-[#7B8794] gap-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-center sm:justify-start">
            <span className="flex items-center space-x-1.5 text-[#0B1F33] font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#167C80]" />
              <span>Campus Intelligence Platform</span>
            </span>
            <span>·</span>
            <span>No Black-Box AI Promises</span>
            <span>·</span>
            <span>100% Student Data Privacy</span>
          </div>
          <div className="text-center sm:text-right">
            <span>Version 2.4 · Built for University Students & Campuses</span>
          </div>
        </div>
      </div>
    </div>
  );
};
