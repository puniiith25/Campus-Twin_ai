"use client";

import React from "react";
import { CampusPath, PathStep } from "@/types";
import { BookOpen, Users, Award, Microscope, Briefcase, Clock, CheckCircle2, ArrowDown, Sparkles } from "lucide-react";
import { formatHours } from "@/lib/utils";

interface PathTimelineProps {
  path: CampusPath;
  onSelectStep?: (step: PathStep) => void;
  showWhatIfButton?: boolean;
  onLaunchWhatIf?: (step: PathStep) => void;
}

export function PathTimeline({ path, onSelectStep, showWhatIfButton = true, onLaunchWhatIf }: PathTimelineProps) {
  const getStepIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("course")) return BookOpen;
    if (t.includes("club") || t.includes("networking")) return Users;
    if (t.includes("research") || t.includes("lab")) return Microscope;
    if (t.includes("workshop") || t.includes("hackathon")) return Award;
    return Briefcase;
  };

  const getBadgeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("course")) return "bg-blue-50 text-blue-700 border-blue-200";
    if (t.includes("club")) return "bg-purple-50 text-purple-700 border-purple-200";
    if (t.includes("research")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (t.includes("workshop") || t.includes("hackathon")) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-indigo-50 text-indigo-700 border-indigo-200";
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
      {/* Path Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full border border-brand-200">
              {path.focus_type}
            </span>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${path.within_limit ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
              {path.within_limit ? `✓ Fits Limit (${formatHours(path.total_hours_per_week)})` : `⚠️ Exceeds Limit (${formatHours(path.total_hours_per_week)})`}
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">{path.title}</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">{path.description}</p>
        </div>

        {/* Path Metric Quick Score */}
        <div className="flex items-center space-x-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="text-center px-2">
            <div className="text-xs text-slate-500 font-medium">Goal Alignment</div>
            <div className="text-lg font-bold text-brand-600">{path.metrics.goal_alignment}%</div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center px-2">
            <div className="text-xs text-slate-500 font-medium">Overall Fit</div>
            <div className="text-lg font-bold text-emerald-600">{path.metrics.overall_score}/100</div>
          </div>
        </div>
      </div>

      {/* Steps Timeline */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-7 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-brand-500 before:via-indigo-300 before:to-slate-200">
        {path.steps.map((step, idx) => {
          const Icon = getStepIcon(step.type);
          const badgeStyle = getBadgeColor(step.type);
          return (
            <div key={step.step_id || idx} className="relative flex items-start group">
              {/* Node Icon */}
              <div className="z-10 w-14 h-14 rounded-2xl bg-white border-2 border-brand-500 shadow-md flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
              </div>

              {/* Step Card Content */}
              <div className="ml-4 flex-1 bg-slate-50/70 hover:bg-white rounded-xl p-5 border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-md border ${badgeStyle}`}>
                      {step.type}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {formatHours(step.hours_per_week)}
                    </span>
                  </div>

                  {showWhatIfButton && (
                    <button
                      onClick={() => onLaunchWhatIf && onLaunchWhatIf(step)}
                      className="text-xs text-brand-600 hover:text-brand-800 font-semibold flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>"What if I replace this?"</span>
                    </button>
                  )}
                </div>

                <h4 className="text-base font-bold text-slate-900 mb-1">{step.name}</h4>
                <p className="text-xs text-slate-600 mb-3">{step.description}</p>

                {/* Reason & Skills */}
                <div className="bg-white p-3 rounded-lg border border-slate-200/80 mb-2">
                  <div className="text-xs font-semibold text-slate-700 mb-1 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                    Why recommended: {step.reason}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {step.skills.map((skill) => (
                      <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded font-medium">
                        +{skill}
                      </span>
                    ))}
                  </div>
                </div>

                {step.prerequisites && step.prerequisites.length > 0 && (
                  <div className="text-xs text-slate-500">
                    <span className="font-medium text-slate-600">Prerequisites: </span>
                    {step.prerequisites.join(", ")}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Path Skills Summary */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Skills Gained On This Path</h4>
        <div className="flex flex-wrap gap-2">
          {path.skills_gained.map((skill) => (
            <span key={skill} className="px-3 py-1 bg-brand-50 text-brand-700 font-medium text-xs rounded-full border border-brand-200">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
