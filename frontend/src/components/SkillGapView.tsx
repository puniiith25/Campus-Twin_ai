/**
 * Campus Twin - Skill Gap Analysis
 * What stands between you and your target career trajectory with high-impact actionable next steps.
 */

import React, { useState } from 'react';
import {
  Target,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Layers,
  Zap,
} from 'lucide-react';
import { StudentProfile, SkillGap } from '../types';
import { MASTER_CAREER_ROLES } from '../data/campusIntelligenceData';
import { getSkillGapsForRole } from '../services/careerIntelligenceEngine';

interface SkillGapViewProps {
  student: StudentProfile;
  initialRoleTitle?: string;
  onNavigate: (tab: any) => void;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({
  student,
  initialRoleTitle,
  onNavigate,
}) => {
  const [selectedRoleTitle, setSelectedRoleTitle] = useState<string>(
    initialRoleTitle || student.careerGoal || 'AI Engineer'
  );

  const gaps: SkillGap[] = getSkillGapsForRole(student, selectedRoleTitle);

  // Highest-impact next step determination
  const primaryGap = gaps.find((g) => g.gapSeverity === 'High') || gaps[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#17212B]">
      {/* Header */}
      <div className="border-b border-[#EEF3F2] pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#167C80] font-semibold mb-1">
            <Target className="w-4 h-4" />
            <span>Target Benchmark & Gap Analysis</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-[#0B1F33] tracking-tight">
            What stands between you and your target?
          </h1>
          <p className="text-sm text-[#52606D] mt-1">
            Deterministic comparison of your validated skill proficiencies against target industry standards.
          </p>
        </div>

        {/* Target Role Selector Dropdown */}
        <div className="flex items-center space-x-3">
          <label className="text-xs font-semibold text-[#52606D]">Selected Target:</label>
          <select
            value={selectedRoleTitle}
            onChange={(e) => setSelectedRoleTitle(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#D1D9E0] text-xs font-bold text-[#0B1F33] focus:outline-none focus:ring-2 focus:ring-[#167C80]/30 shadow-2xs"
          >
            {MASTER_CAREER_ROLES.map((r) => (
              <option key={r.id} value={r.title}>
                {r.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Highest-Impact Next Step Banner */}
      {primaryGap && (
        <div className="p-6 rounded-2xl bg-[#0B1F33] text-white border border-[#102A43] shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-[#167C80] text-white text-[11px] font-bold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" />
                <span>Highest-Impact Next Step</span>
              </div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
                {primaryGap.actionPlan}
              </h2>
              <p className="text-xs text-[#EEF3F2]/80 leading-relaxed">
                {primaryGap.impactExplanation} It directly addresses your gap in{' '}
                <span className="text-[#C9A96E] font-semibold">{primaryGap.skillName}</span> ({primaryGap.studentLevel} → {primaryGap.targetLevel}).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                onClick={() => onNavigate('opportunities')}
                className="px-5 py-3 rounded-xl bg-[#167C80] hover:bg-[#126467] text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center space-x-1.5"
              >
                <span>Find Relevant Opportunities</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('roadmap')}
                className="px-4 py-3 rounded-xl bg-[#102A43] hover:bg-[#163859] text-white border border-white/10 text-xs font-semibold transition-colors text-center"
              >
                View in Roadmap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skill Comparison Matrix */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EEF3F2] shadow-xs">
        <h2 className="font-display font-bold text-lg text-[#0B1F33] mb-1">
          Skill Requirement vs Current Level Comparison
        </h2>
        <p className="text-xs text-[#52606D] mb-6">
          Every requirement for <span className="font-semibold text-[#0B1F33]">{selectedRoleTitle}</span> mapped to your current profile.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EEF3F2] text-[#7B8794] font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Skill Prerequisite</th>
                <th className="py-3 px-4">Your Current Level</th>
                <th className="py-3 px-4">Target Role Requirement</th>
                <th className="py-3 px-4">Gap Magnitude</th>
                <th className="py-3 px-4">Recommended Next Step</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF3F2]">
              {gaps.map((gap) => (
                <tr key={gap.skillName} className="hover:bg-[#F8FAF9] transition-colors">
                  <td className="py-4 px-4 font-bold text-[#0B1F33] whitespace-nowrap">
                    {gap.skillName}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md font-medium ${
                        gap.studentLevel === 'None'
                          ? 'bg-[#EEF3F2] text-[#7B8794]'
                          : 'bg-[#167C80]/10 text-[#167C80]'
                      }`}
                    >
                      {gap.studentLevel}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-2.5 py-1 rounded-md font-semibold bg-[#0B1F33] text-white">
                      {gap.targetLevel}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md font-bold text-[10px] ${
                        gap.gapSeverity === 'High'
                          ? 'bg-[#C53030]/10 text-[#C53030]'
                          : gap.gapSeverity === 'Moderate'
                          ? 'bg-[#B7791F]/10 text-[#B7791F]'
                          : 'bg-[#1F8A70]/10 text-[#1F8A70]'
                      }`}
                    >
                      {gap.gapSeverity} Gap
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[#52606D] max-w-xs">
                    {gap.actionPlan}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actionable Improvement Cards */}
      <div className="space-y-4">
        <h2 className="font-display font-bold text-lg text-[#0B1F33]">
          Actionable Next Steps for Each Gap
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gaps.map((gap) => (
            <div
              key={gap.skillName}
              className="bg-white rounded-2xl p-6 border border-[#EEF3F2] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display font-bold text-sm text-[#0B1F33]">
                    Improve {gap.skillName}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      gap.gapSeverity === 'High'
                        ? 'bg-[#C53030]/10 text-[#C53030]'
                        : 'bg-[#B7791F]/10 text-[#B7791F]'
                    }`}
                  >
                    {gap.studentLevel} → {gap.targetLevel}
                  </span>
                </div>

                <p className="text-xs text-[#52606D] mb-4 leading-relaxed">
                  Target roles frequently screen for {gap.skillName} depth in initial technical assessment rounds.
                </p>

                <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#EEF3F2] space-y-1.5 text-xs mb-4">
                  <div className="font-semibold text-[#0B1F33]">Recommended Action:</div>
                  <div className="text-[#52606D]">{gap.actionPlan}</div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="text-[11px] font-semibold text-[#7B8794]">Campus Options:</div>
                  {gap.recommendedResources.map((res, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5 text-[#0B1F33]">
                      <span className="text-[#167C80] font-bold">✓</span>
                      <span>{res.title} ({res.hours}h)</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#EEF3F2]">
                <button
                  onClick={() => onNavigate('opportunities')}
                  className="text-xs font-semibold text-[#167C80] hover:underline flex items-center space-x-1"
                >
                  <span>Explore Campus Opportunities</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
