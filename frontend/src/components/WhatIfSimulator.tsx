/**
 * Campus Twin - What-If Scenario Simulator (Signature Feature)
 * Explore alternative futures, calculate readiness deltas, and preview unlocked opportunities.
 */

import React, { useState } from 'react';
import {
  SlidersHorizontal,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Target,
  FlaskConical,
  Rocket,
  Briefcase,
  Layers,
} from 'lucide-react';
import { StudentProfile, WhatIfScenarioResult, SkillProficiency } from '../types';
import { MASTER_CAREER_ROLES } from '../data/campusIntelligenceData';
import { calculateWhatIfScenario } from '../services/careerIntelligenceEngine';

interface WhatIfSimulatorProps {
  student: StudentProfile;
  onApplyScenarioToProfile: (updatedParams: {
    careerGoal: string;
    weeklyHours: number;
    skills: { name: string; level: SkillProficiency }[];
    primaryFocus: 'career' | 'research' | 'entrepreneurship';
  }) => void;
  onNavigate: (tab: any) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  student,
  onApplyScenarioToProfile,
  onNavigate,
}) => {
  const [targetRole, setTargetRole] = useState<string>(student.careerGoal || 'AI Engineer');
  const [weeklyHours, setWeeklyHours] = useState<number>(student.weeklyHours || 8);
  const [primaryFocus, setPrimaryFocus] = useState<'career' | 'research' | 'entrepreneurship'>(
    student.primaryFocus || 'career'
  );

  // Skill upgrades simulation
  const [skillUpgrades, setSkillUpgrades] = useState<{ skill: string; from: string; to: string }[]>([
    { skill: 'SQL', from: 'Beginner', to: 'Intermediate' },
    { skill: 'Machine Learning', from: 'Beginner', to: 'Intermediate' },
  ]);

  const toggleUpgrade = (skillName: string, targetLevel: SkillProficiency) => {
    const existing = skillUpgrades.find((u) => u.skill.toLowerCase() === skillName.toLowerCase());
    if (existing) {
      if (existing.to === targetLevel) {
        setSkillUpgrades(skillUpgrades.filter((u) => u.skill.toLowerCase() !== skillName.toLowerCase()));
      } else {
        setSkillUpgrades(
          skillUpgrades.map((u) =>
            u.skill.toLowerCase() === skillName.toLowerCase() ? { ...u, to: targetLevel } : u
          )
        );
      }
    } else {
      const studentSkill = student.skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
      const fromLevel = studentSkill ? studentSkill.level : 'None';
      setSkillUpgrades([...skillUpgrades, { skill: skillName, from: fromLevel, to: targetLevel }]);
    }
  };

  const scenarioResult: WhatIfScenarioResult = calculateWhatIfScenario(student, {
    targetRoleTitle: targetRole,
    weeklyHours,
    skillUpgrades,
    focus: primaryFocus,
  });

  const handleApply = () => {
    const updatedSkills = student.skills.map((s) => {
      const up = skillUpgrades.find((u) => u.skill.toLowerCase() === s.name.toLowerCase());
      if (up) {
        return { ...s, level: up.to as SkillProficiency };
      }
      return s;
    });

    skillUpgrades.forEach((u) => {
      if (!updatedSkills.some((s) => s.name.toLowerCase() === u.skill.toLowerCase())) {
        updatedSkills.push({ name: u.skill, level: u.to as SkillProficiency });
      }
    });

    onApplyScenarioToProfile({
      careerGoal: targetRole,
      weeklyHours,
      skills: updatedSkills,
      primaryFocus,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#17212B]">
      {/* Header */}
      <div className="border-b border-[#EEF3F2] pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#167C80] font-semibold mb-1">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Scenario Intelligence Simulator</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-[#0B1F33] tracking-tight">
            What If?
          </h1>
          <p className="text-sm text-[#52606D] mt-1">
            Explore a different version of your future before you commit to it.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleApply}
            className="px-5 py-2.5 rounded-xl bg-[#167C80] hover:bg-[#126467] text-white text-xs font-bold shadow-xs transition-colors"
          >
            Commit Alternative as Current Profile
          </button>
        </div>
      </div>

      {/* Simulator Inputs & Interactive Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#EEF3F2] shadow-xs space-y-6">
          <h2 className="font-display font-bold text-base text-[#0B1F33]">
            Scenario Parameters
          </h2>

          {/* 1. Target Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#0B1F33] mb-1.5">
              1. Hypothetical Career Target
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAF9] border border-[#D1D9E0] text-xs font-semibold text-[#0B1F33] focus:outline-none focus:ring-2 focus:ring-[#167C80]/30"
            >
              {MASTER_CAREER_ROLES.map((r) => (
                <option key={r.id} value={r.title}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Weekly Time Bandwidth */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#0B1F33] mb-1.5">
              <span>2. Weekly Available Time</span>
              <span className="text-[#167C80] font-bold">{weeklyHours} hrs / week</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[4, 6, 8, 10, 12].map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setWeeklyHours(hrs)}
                  className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                    weeklyHours === hrs
                      ? 'bg-[#167C80] text-white border-[#167C80]'
                      : 'bg-[#F8FAF9] text-[#52606D] border-[#D1D9E0]'
                  }`}
                >
                  {hrs}h
                </button>
              ))}
            </div>
          </div>

          {/* 3. Primary Focus Mode */}
          <div>
            <label className="block text-xs font-semibold text-[#0B1F33] mb-1.5">
              3. Strategic Horizon Focus
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPrimaryFocus('career')}
                className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                  primaryFocus === 'career'
                    ? 'bg-[#102A43] text-white border-[#102A43]'
                    : 'bg-[#F8FAF9] text-[#52606D] border-[#D1D9E0]'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 mx-auto mb-1" />
                <span>Industry Placements</span>
              </button>

              <button
                type="button"
                onClick={() => setPrimaryFocus('research')}
                className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                  primaryFocus === 'research'
                    ? 'bg-[#102A43] text-white border-[#102A43]'
                    : 'bg-[#F8FAF9] text-[#52606D] border-[#D1D9E0]'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5 mx-auto mb-1" />
                <span>Academic Research</span>
              </button>

              <button
                type="button"
                onClick={() => setPrimaryFocus('entrepreneurship')}
                className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                  primaryFocus === 'entrepreneurship'
                    ? 'bg-[#102A43] text-white border-[#102A43]'
                    : 'bg-[#F8FAF9] text-[#52606D] border-[#D1D9E0]'
                }`}
              >
                <Rocket className="w-3.5 h-3.5 mx-auto mb-1" />
                <span>Incubation & Startup</span>
              </button>
            </div>
          </div>

          {/* 4. Simulated Skill Upgrades */}
          <div>
            <label className="block text-xs font-semibold text-[#0B1F33] mb-1.5">
              4. Simulated Skill Elevations
            </label>
            <div className="space-y-1.5">
              {['SQL', 'Machine Learning', 'Python', 'Cloud', 'Data Structures & Algorithms'].map(
                (skillName) => {
                  const studentSkill = student.skills.find(
                    (s) => s.name.toLowerCase() === skillName.toLowerCase()
                  );
                  const cur = studentSkill ? studentSkill.level : 'None';
                  const upgrade = skillUpgrades.find(
                    (u) => u.skill.toLowerCase() === skillName.toLowerCase()
                  );

                  return (
                    <div
                      key={skillName}
                      className="p-2.5 rounded-xl bg-[#F8FAF9] border border-[#EEF3F2] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-[#0B1F33]">{skillName}</div>
                        <div className="text-[10px] text-[#7B8794]">Current: {cur}</div>
                      </div>

                      <div className="flex items-center space-x-1">
                        {(['Intermediate', 'Advanced'] as SkillProficiency[]).map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => toggleUpgrade(skillName, lvl)}
                            className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${
                              upgrade?.to === lvl
                                ? 'bg-[#1F8A70] text-white shadow-2xs'
                                : 'bg-[#EEF3F2] text-[#52606D] hover:bg-[#D1D9E0]'
                            }`}
                          >
                            + {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Live Comparison Output (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Side-by-side Score Delta Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#EEF3F2] shadow-xs">
            <h3 className="font-display font-bold text-base text-[#0B1F33] mb-4">
              Current Path vs Alternative Scenario
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-[#F8FAF9] border border-[#EEF3F2]">
                <div className="text-[10px] text-[#7B8794] uppercase font-bold">Current Path</div>
                <div className="font-display text-3xl font-extrabold text-[#0B1F33] my-1">
                  {scenarioResult.baseReadiness}
                  <span className="text-xs font-normal text-[#7B8794]"> / 100</span>
                </div>
                <div className="text-xs text-[#52606D]">
                  {student.careerGoal} · {student.weeklyHours}h/wk
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#EEF3F2] border border-[#167C80]/30">
                <div className="text-[10px] text-[#167C80] uppercase font-bold flex items-center justify-between">
                  <span>Alternative Path</span>
                  <span className="text-xs font-bold text-[#1F8A70]">
                    {scenarioResult.readinessDelta >= 0 ? `+${scenarioResult.readinessDelta}` : scenarioResult.readinessDelta} pts
                  </span>
                </div>
                <div className="font-display text-3xl font-extrabold text-[#167C80] my-1">
                  {scenarioResult.newReadiness}
                  <span className="text-xs font-normal text-[#7B8794]"> / 100</span>
                </div>
                <div className="text-xs text-[#0B1F33] font-medium truncate">
                  {targetRole} · {weeklyHours}h/wk
                </div>
              </div>
            </div>

            {/* Explainable Rationale */}
            <div className="p-4 rounded-xl bg-[#F8FAF9] border border-[#EEF3F2] text-xs space-y-2">
              <div className="font-bold text-[#0B1F33] flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#167C80]" />
                <span>What Changed and Why:</span>
              </div>
              <p className="text-[#52606D] leading-relaxed">
                {scenarioResult.rationale}
              </p>
            </div>
          </div>

          {/* Unlocked Opportunities in this Scenario */}
          <div className="bg-white rounded-2xl p-6 border border-[#EEF3F2] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-[#0B1F33]">
                  Opportunities Unlocked in this Scenario ({scenarioResult.unlockedOpportunities.length})
                </h3>
                <p className="text-xs text-[#52606D]">
                  Campus labs and programs matching your upgraded skills & schedule.
                </p>
              </div>
              <button
                onClick={() => onNavigate('opportunities')}
                className="text-xs font-semibold text-[#167C80] hover:underline"
              >
                View in Ecosystem
              </button>
            </div>

            <div className="space-y-2">
              {scenarioResult.unlockedOpportunities.slice(0, 3).map((opp) => (
                <div
                  key={opp.id}
                  className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#EEF3F2] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-[#0B1F33] block">{opp.title}</span>
                    <span className="text-[11px] text-[#7B8794]">
                      {opp.provider} · {opp.timeCommitment}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#1F8A70]/10 text-[#1F8A70] font-semibold text-[10px]">
                    Unlocked
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
