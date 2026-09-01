/**
 * Campus Twin - Personalized Roadmap ("My Path")
 * Dynamic multi-month sequence tailored to target career and weekly hours bandwidth.
 */

import React, { useState } from 'react';
import {
  Route,
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  Flag,
} from 'lucide-react';
import { StudentProfile, RoadmapStep } from '../types';
import { generatePersonalizedRoadmap } from '../services/careerIntelligenceEngine';

interface RoadmapProps {
  student: StudentProfile;
  onNavigate: (tab: any) => void;
}

export const PersonalizedRoadmapView: React.FC<RoadmapProps> = ({
  student,
  onNavigate,
}) => {
  const steps: RoadmapStep[] = generatePersonalizedRoadmap(student, student.careerGoal);
  const [completedSteps, setCompletedSteps] = useState<number[]>([0]);

  const toggleStep = (monthNum: number) => {
    if (completedSteps.includes(monthNum)) {
      setCompletedSteps(completedSteps.filter((s) => s !== monthNum));
    } else {
      setCompletedSteps([...completedSteps, monthNum]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#17212B]">
      {/* Header */}
      <div className="border-b border-[#EEF3F2] pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#167C80] font-semibold mb-1">
            <Route className="w-4 h-4" />
            <span>Dynamic Structured Journey · Paced to {student.weeklyHours} hrs/week</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-[#0B1F33] tracking-tight">
            My Path
          </h1>
          <p className="text-sm text-[#52606D] mt-1">
            Sequential milestones from your current baseline to placement-ready {student.careerGoal}.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="p-2.5 rounded-xl bg-white border border-[#D1D9E0] text-[#0B1F33] font-semibold flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-[#167C80]" />
            <span>Pacing: {student.weeklyHours} hrs/week</span>
          </div>
        </div>
      </div>

      {/* High-Level Stage Flow Ribbon */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#EEF3F2] shadow-xs">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#7B8794] mb-3">
          Overall Progression Arc
        </div>
        <div className="flex items-center justify-between overflow-x-auto gap-2 no-scrollbar py-1">
          {['Today', 'Strengthen Core', 'Expand Skills', 'Build Project', 'Practical Exposure', 'Ready'].map(
            (stage, idx, arr) => (
              <React.Fragment key={stage}>
                <div className="flex items-center space-x-2 shrink-0">
                  <div className="w-6 h-6 rounded-full bg-[#102A43] text-white flex items-center justify-center text-[10px] font-bold">
                    0{idx}
                  </div>
                  <span className="text-xs font-semibold text-[#0B1F33] whitespace-nowrap">
                    {stage}
                  </span>
                </div>
                {idx < arr.length - 1 && (
                  <div className="h-[2px] w-6 sm:w-12 bg-[#EEF3F2] shrink-0" />
                )}
              </React.Fragment>
            )
          )}
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative space-y-6 before:absolute before:inset-0 before:left-5 before:md:left-7 before:w-0.5 before:bg-[#D1D9E0]/60 before:z-0">
        {steps.map((step) => {
          const isDone = completedSteps.includes(step.monthNumber);

          return (
            <div
              key={step.monthNumber}
              className="relative z-10 flex items-start space-x-4 sm:space-x-6"
            >
              {/* Step Checkbox Node */}
              <button
                type="button"
                onClick={() => toggleStep(step.monthNumber)}
                className={`w-10 h-10 sm:w-14 sm:h-14 rounded-2xl border-2 flex items-center justify-center shrink-0 transition-all ${
                  isDone
                    ? 'bg-[#1F8A70] border-[#1F8A70] text-white shadow-xs'
                    : 'bg-white border-[#D1D9E0] text-[#0B1F33] hover:border-[#167C80]'
                }`}
                title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <span className="font-display font-bold text-xs sm:text-sm">
                    M{step.monthNumber}
                  </span>
                )}
              </button>

              {/* Step Card Content */}
              <div className="flex-1 bg-white rounded-2xl p-6 border border-[#EEF3F2] shadow-xs hover:border-[#167C80]/30 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#167C80] block">
                      {step.phase}
                    </span>
                    <h3 className="font-display font-bold text-base text-[#0B1F33]">
                      {step.stageTitle}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-[#F8FAF9] text-[#52606D] font-medium border border-[#EEF3F2]">
                      ~{step.estimatedHoursPerWeek} hrs / week
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#52606D] mb-4 leading-relaxed font-medium">
                  {step.focusSummary}
                </p>

                {/* Bullet Actions */}
                <div className="space-y-2 mb-4">
                  {step.actions.map((act, aIdx) => (
                    <div key={aIdx} className="flex items-start space-x-2 text-xs text-[#0B1F33]">
                      <span className="text-[#167C80] font-bold mt-0.5">›</span>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>

                {/* Milestone Goal Box */}
                <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#EEF3F2] flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Flag className="w-3.5 h-3.5 text-[#C9A96E]" />
                    <span className="font-semibold text-[#0B1F33]">
                      Milestone: {step.targetMilestone}
                    </span>
                  </div>

                  {step.linkedOpportunityId && (
                    <button
                      onClick={() => onNavigate('opportunities')}
                      className="text-xs font-semibold text-[#167C80] hover:underline flex items-center space-x-1"
                    >
                      <span>Find Campus Lab</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
