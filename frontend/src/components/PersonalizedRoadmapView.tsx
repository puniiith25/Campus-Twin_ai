/**
 * Campus Twin - Personalized Roadmap ("My Path")
 * Dynamic multi-month sequence with expandable week-wise schedules and interactive completion tracking.
 */

import React, { useState } from 'react';
import {
  Route,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  Sparkles,
  Flag,
  ChevronDown,
  ChevronUp,
  Calendar,
  CheckSquare,
  Square,
  BookOpen,
  Trophy,
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
  
  // Expanded months state: default Month 1 is open
  const [expandedMonths, setExpandedMonths] = useState<number[]>([1]);
  
  // Completed months state
  const [completedMonths, setCompletedMonths] = useState<number[]>([0]);

  // Completed individual weekly task IDs
  const [completedWeekTasks, setCompletedWeekTasks] = useState<string[]>([
    'm0_w1',
    'm0_w2',
    'm1_w1',
  ]);

  const toggleMonthExpand = (monthNum: number) => {
    if (expandedMonths.includes(monthNum)) {
      setExpandedMonths(expandedMonths.filter((m) => m !== monthNum));
    } else {
      setExpandedMonths([...expandedMonths, monthNum]);
    }
  };

  const toggleMonthComplete = (e: React.MouseEvent, monthNum: number, step: RoadmapStep) => {
    e.stopPropagation();
    const isCurrentlyDone = completedMonths.includes(monthNum);
    const stepWeekIds = (step.weeks || []).map((w) => w.id);

    if (isCurrentlyDone) {
      // Unmark month and unmark all its week tasks
      setCompletedMonths(completedMonths.filter((s) => s !== monthNum));
      setCompletedWeekTasks(completedWeekTasks.filter((id) => !stepWeekIds.includes(id)));
    } else {
      // Mark month and mark all its week tasks
      setCompletedMonths([...completedMonths, monthNum]);
      setCompletedWeekTasks(Array.from(new Set([...completedWeekTasks, ...stepWeekIds])));
    }
  };

  const toggleWeekTask = (taskId: string, monthNum: number, allWeekIdsInMonth: string[]) => {
    let updatedTasks: string[];
    if (completedWeekTasks.includes(taskId)) {
      updatedTasks = completedWeekTasks.filter((id) => id !== taskId);
      // Also unmark parent month if all were checked
      setCompletedMonths(completedMonths.filter((m) => m !== monthNum));
    } else {
      updatedTasks = [...completedWeekTasks, taskId];
      // If all week tasks in this month are now done, auto-mark month as completed
      const allDone = allWeekIdsInMonth.every((id) => id === taskId || updatedTasks.includes(id));
      if (allDone && !completedMonths.includes(monthNum)) {
        setCompletedMonths((prev) => [...prev, monthNum]);
      }
    }
    setCompletedWeekTasks(updatedTasks);
  };

  // Calculate overall stats
  const totalTasks = steps.reduce((acc, step) => acc + (step.weeks?.length || 0), 0);
  const completedTasksCount = completedWeekTasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#17212B]">
      {/* Header */}
      <div className="border-b border-[#EEF3F2] pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#167C80] font-semibold mb-1">
            <Route className="w-4 h-4" />
            <span>Week-Wise Actionable Journey · Paced to {student.weeklyHours} hrs/week</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-[#0B1F33] tracking-tight">
            My Path
          </h1>
          <p className="text-sm text-[#52606D] mt-1">
            Click any month to reveal its structured week-by-week schedule and mark completed tasks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white border border-[#D1D9E0] text-[#0B1F33] font-semibold flex items-center space-x-2 shadow-xs">
            <Clock className="w-4 h-4 text-[#167C80]" />
            <span>Pacing: {student.weeklyHours} hrs/week</span>
          </div>

          <div className="p-3 rounded-xl bg-[#167C80]/10 border border-[#167C80]/20 text-[#167C80] font-semibold flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-[#167C80]" />
            <span>{completedTasksCount} / {totalTasks} Tasks Done ({progressPercent}%)</span>
          </div>
        </div>
      </div>

      {/* High-Level Overall Progress & Stage Flow Ribbon */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#EEF3F2] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#7B8794]">
            Roadmap Completion Progress
          </div>
          <div className="text-xs font-bold text-[#167C80]">
            {progressPercent}% Complete
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#EEF3F2] h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-linear-to-r from-[#167C80] to-[#1F8A70] h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between overflow-x-auto gap-2 no-scrollbar pt-2">
          {['Today', 'Strengthen Core', 'Expand Skills', 'Build Project', 'Practical Exposure', 'Ready'].map(
            (stage, idx, arr) => (
              <React.Fragment key={stage}>
                <div className="flex items-center space-x-2 shrink-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    completedMonths.includes(idx)
                      ? 'bg-[#1F8A70] text-white'
                      : 'bg-[#102A43] text-white'
                  }`}>
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

      {/* Timeline Steps with Expandable Week-by-Week Action Items */}
      <div className="relative space-y-6 before:absolute before:inset-0 before:left-5 before:md:left-7 before:w-0.5 before:bg-[#D1D9E0]/60 before:z-0">
        {steps.map((step) => {
          const isMonthDone = completedMonths.includes(step.monthNumber);
          const isExpanded = expandedMonths.includes(step.monthNumber);
          const monthWeeks = step.weeks || [];
          const stepWeekIds = monthWeeks.map((w) => w.id);
          const completedWeeksInThisMonth = monthWeeks.filter((w) => completedWeekTasks.includes(w.id)).length;
          const monthTaskPercent = monthWeeks.length > 0 ? Math.round((completedWeeksInThisMonth / monthWeeks.length) * 100) : 0;

          return (
            <div
              key={step.monthNumber}
              className="relative z-10 flex items-start space-x-4 sm:space-x-6"
            >
              {/* Step Checkbox Node */}
              <button
                type="button"
                onClick={(e) => toggleMonthComplete(e, step.monthNumber, step)}
                className={`w-10 h-10 sm:w-14 sm:h-14 rounded-2xl border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                  isMonthDone
                    ? 'bg-[#1F8A70] border-[#1F8A70] text-white shadow-xs'
                    : 'bg-white border-[#D1D9E0] text-[#0B1F33] hover:border-[#167C80] hover:shadow-xs'
                }`}
                title={isMonthDone ? 'Mark month as incomplete' : 'Mark entire month as complete'}
              >
                {isMonthDone ? (
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <span className="font-display font-bold text-xs sm:text-sm">
                    M{step.monthNumber}
                  </span>
                )}
              </button>

              {/* Step Card Content */}
              <div className="flex-1 bg-white rounded-2xl border border-[#EEF3F2] shadow-xs overflow-hidden transition-all">
                {/* Month Card Header - Click to expand/collapse */}
                <div
                  onClick={() => toggleMonthExpand(step.monthNumber)}
                  className="p-5 sm:p-6 cursor-pointer hover:bg-[#F8FAF9]/80 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#167C80]">
                          {step.phase}
                        </span>
                        {monthWeeks.length > 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#167C80]/10 text-[#167C80] font-bold">
                            {completedWeeksInThisMonth}/{monthWeeks.length} Weeks Done
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-bold text-base sm:text-lg text-[#0B1F33] mt-0.5">
                        {step.stageTitle}
                      </h3>
                    </div>

                    <div className="flex items-center space-x-3 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-[#F8FAF9] text-[#52606D] font-medium border border-[#EEF3F2]">
                        ~{step.estimatedHoursPerWeek} hrs / week
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-[#F8FAF9] flex items-center justify-center text-[#52606D]">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#52606D] mb-3 leading-relaxed font-medium">
                    {step.focusSummary}
                  </p>

                  {/* Month Mini Progress Bar */}
                  {monthWeeks.length > 0 && (
                    <div className="w-full bg-[#EEF3F2] h-1.5 rounded-full overflow-hidden mb-2">
                      <div
                        className="bg-[#1F8A70] h-full rounded-full transition-all duration-300"
                        style={{ width: `${monthTaskPercent}%` }}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-[#167C80] font-medium pt-1">
                    <span>{isExpanded ? 'Hide week-by-week breakdown' : 'Click to view week-by-week schedule'}</span>
                    <span className="text-[11px] text-[#7B8794]">
                      {monthWeeks.length} Weekly Modules
                    </span>
                  </div>
                </div>

                {/* Expanded Week-wise Schedule & Task Checklists */}
                {isExpanded && (
                  <div className="border-t border-[#EEF3F2] bg-[#F8FAF9]/50 p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1F33] flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-[#167C80]" />
                        <span>Week-by-Week Scheduled Tasks</span>
                      </h4>
                      <span className="text-[11px] text-[#52606D]">
                        Check off completed weekly deliverables
                      </span>
                    </div>

                    {/* Weekly Tasks List */}
                    <div className="grid grid-cols-1 gap-3">
                      {monthWeeks.map((week) => {
                        const isWeekDone = completedWeekTasks.includes(week.id);

                        return (
                          <div
                            key={week.id}
                            onClick={() => toggleWeekTask(week.id, step.monthNumber, stepWeekIds)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                              isWeekDone
                                ? 'bg-emerald-50/70 border-emerald-200 text-[#0B1F33]'
                                : 'bg-white border-[#EEF3F2] hover:border-[#167C80]/40 text-[#0B1F33] shadow-xs'
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {isWeekDone ? (
                                <CheckSquare className="w-5 h-5 text-[#1F8A70]" />
                              ) : (
                                <Square className="w-5 h-5 text-[#D1D9E0] hover:text-[#167C80]" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                                <span className={`text-xs font-bold ${isWeekDone ? 'line-through text-[#52606D]' : 'text-[#0B1F33]'}`}>
                                  {week.title}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-[#D1D9E0] text-[#52606D] font-medium shrink-0">
                                  {week.estimatedHours} hrs load
                                </span>
                              </div>

                              <p className={`text-xs mb-2 leading-relaxed ${isWeekDone ? 'text-[#7B8794]' : 'text-[#52606D]'}`}>
                                {week.description}
                              </p>

                              <div className="flex items-center space-x-1.5 text-[11px] font-medium text-[#167C80]">
                                <BookOpen className="w-3 h-3 shrink-0" />
                                <span className="truncate">Deliverable: {week.deliverable}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Milestone Goal Box */}
                    <div className="p-3.5 rounded-xl bg-white border border-[#EEF3F2] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <Flag className="w-4 h-4 text-[#C9A96E] shrink-0" />
                        <span className="font-semibold text-[#0B1F33]">
                          Target Milestone: {step.targetMilestone}
                        </span>
                      </div>

                      {step.linkedOpportunityId && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('opportunities');
                          }}
                          className="text-xs font-semibold text-[#167C80] hover:underline flex items-center space-x-1 shrink-0 cursor-pointer"
                        >
                          <span>Find Campus Lab / Course</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

