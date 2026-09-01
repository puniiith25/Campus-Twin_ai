/**
 * Campus Twin - The Career Map (Signature Visual)
 * Dynamic path and branch visualization connecting "YOU ARE HERE" to personalized career trajectories.
 */

import React, { useState } from 'react';
import {
  GitBranch,
  Target,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Layers,
  Award,
  BookOpen,
} from 'lucide-react';
import { StudentProfile, CareerRole } from '../types';

interface CareerMapViewProps {
  student: StudentProfile;
  roles: CareerRole[];
  onSelectRoleForGaps: (role: CareerRole) => void;
  onSetTargetRole: (roleTitle: string) => void;
}

export const CareerMapView: React.FC<CareerMapViewProps> = ({
  student,
  roles,
  onSelectRoleForGaps,
  onSetTargetRole,
}) => {
  const [selectedRole, setSelectedRole] = useState<CareerRole>(roles[0] || null);

  const topBranches = roles.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#17212B]">
      {/* Header */}
      <div className="border-b border-[#EEF3F2] pb-6">
        <div className="flex items-center space-x-2 text-xs text-[#167C80] font-semibold mb-1">
          <GitBranch className="w-4 h-4" />
          <span>Interactive Career Trajectory Map</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-[#0B1F33] tracking-tight">
          Your Career Map
        </h1>
        <p className="text-sm text-[#52606D] mt-1">
          Where you stand today and the high-alignment pathways branching from your skills and curiosity.
        </p>
      </div>

      {/* Main Path Diagram Visual & Detail Drawer/Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Interactive Visual Tree (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-[#EEF3F2] shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7B8794]">
              Campus Path & Node Graph
            </span>
            <span className="text-xs text-[#167C80] font-medium">Click any node to inspect</span>
          </div>

          {/* SVG & Node Tree Container */}
          <div className="relative py-6 flex flex-col md:flex-row items-center justify-between gap-6 min-h-[380px]">
            {/* "YOU ARE HERE" Base Node */}
            <div className="relative z-10 w-full md:w-56 p-4 rounded-2xl bg-[#0B1F33] text-white border-2 border-[#167C80] shadow-md text-left shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#167C80] text-white">
                  You Are Here
                </span>
                <span className="text-[11px] text-[#C9A96E] font-bold">
                  {student.cgpa} CGPA
                </span>
              </div>
              <h3 className="font-display font-bold text-sm text-white">{student.name}</h3>
              <p className="text-[11px] text-[#7B8794] mt-0.5">
                {student.department.split(' ')[0]} · Sem {student.semester}
              </p>

              <div className="mt-3 pt-2.5 border-t border-[#102A43] text-[10px] text-[#EEF3F2] space-y-1">
                <div>
                  <span className="text-[#7B8794]">Skills: </span>
                  {student.skills.slice(0, 3).map((s) => s.name).join(', ')}
                </div>
                <div>
                  <span className="text-[#7B8794]">Bandwidth: </span>
                  {student.weeklyHours} hrs/week
                </div>
              </div>
            </div>

            {/* Connecting Path Lines (SVG for desktop, stacked for mobile) */}
            <div className="w-full md:flex-1 space-y-3 relative">
              {topBranches.map((role, idx) => {
                const isSelected = selectedRole?.id === role.id;
                const isCurrentTarget = student.careerGoal.toLowerCase() === role.title.toLowerCase();

                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all relative flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#EEF3F2] border-[#167C80] ring-2 ring-[#167C80]/30 shadow-xs'
                        : 'bg-[#F8FAF9] border-[#EEF3F2] hover:bg-white hover:border-[#D1D9E0]'
                    }`}
                  >
                    {/* Visual Branch Line Indicator */}
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full shrink-0 ${
                          role.alignment === 'Strong alignment'
                            ? 'bg-[#1F8A70]'
                            : role.alignment === 'Good alignment'
                            ? 'bg-[#167C80]'
                            : 'bg-[#B7791F]'
                        }`}
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-display font-bold text-xs text-[#0B1F33]">
                            {role.title}
                          </span>
                          {isCurrentTarget && (
                            <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-[#0B1F33] text-white">
                              Active Target
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#52606D]">{role.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          role.alignment === 'Strong alignment'
                            ? 'bg-[#1F8A70]/10 text-[#1F8A70]'
                            : role.alignment === 'Good alignment'
                            ? 'bg-[#167C80]/10 text-[#167C80]'
                            : 'bg-[#B7791F]/10 text-[#B7791F]'
                        }`}
                      >
                        {role.alignment}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#7B8794]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#EEF3F2] flex items-center justify-between text-xs text-[#7B8794]">
            <span>Branches mathematically calculated based on skill graph overlap</span>
            <span className="text-[#0B1F33] font-medium">4 Active Trajectories</span>
          </div>
        </div>

        {/* Right Detail Card for Selected Role (5 cols) */}
        {selectedRole && (
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#EEF3F2] shadow-xs space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${
                    selectedRole.alignment === 'Strong alignment'
                      ? 'bg-[#1F8A70]/10 text-[#1F8A70]'
                      : selectedRole.alignment === 'Good alignment'
                      ? 'bg-[#167C80]/10 text-[#167C80]'
                      : 'bg-[#B7791F]/10 text-[#B7791F]'
                  }`}
                >
                  {selectedRole.alignment} · {selectedRole.matchScore}% Match
                </span>
                <span className="text-xs text-[#7B8794] font-medium">
                  {selectedRole.domain}
                </span>
              </div>

              <h3 className="font-display font-bold text-xl text-[#0B1F33]">
                {selectedRole.title}
              </h3>
              <p className="text-xs text-[#52606D] mt-1 leading-relaxed">
                {selectedRole.description}
              </p>
            </div>

            {/* Why this fits */}
            <div className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#EEF3F2] space-y-2">
              <div className="text-xs font-bold text-[#0B1F33] flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1F8A70]" />
                <span>Why this fits your profile</span>
              </div>
              <ul className="space-y-1 text-xs text-[#52606D]">
                {selectedRole.whyFits.map((fit, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-[#1F8A70] font-bold">✓</span>
                    <span>{fit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What is missing */}
            <div className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#EEF3F2] space-y-2">
              <div className="text-xs font-bold text-[#0B1F33] flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#B7791F]" />
                <span>What is missing to reach 100% readiness</span>
              </div>
              <ul className="space-y-1 text-xs text-[#52606D]">
                {selectedRole.whatMissing.map((miss, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-[#B7791F] font-bold">→</span>
                    <span>{miss}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Placement stats snippet */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#EEF3F2]">
                <div className="text-[10px] text-[#7B8794]">Average Campus Package</div>
                <div className="font-semibold text-[#0B1F33] mt-0.5">{selectedRole.avgSalaryRange}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#EEF3F2]">
                <div className="text-[10px] text-[#7B8794]">Minimum Cut-off</div>
                <div className="font-semibold text-[#0B1F33] mt-0.5">{selectedRole.minimumCGPA} CGPA</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => onSelectRoleForGaps(selectedRole)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#167C80] hover:bg-[#126467] text-white text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
              >
                <span>View Skill Gaps</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {student.careerGoal.toLowerCase() !== selectedRole.title.toLowerCase() && (
                <button
                  onClick={() => onSetTargetRole(selectedRole.title)}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F8FAF9] text-[#0B1F33] border border-[#D1D9E0] text-xs font-semibold transition-colors"
                >
                  Set as My Target
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
