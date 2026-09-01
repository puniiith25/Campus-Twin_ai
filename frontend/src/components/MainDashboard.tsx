/**
 * Campus Twin - Main Dashboard
 * Displays Profile Snapshot, Profile Readiness, Strengths & Gaps, and Top Trajectories.
 */

import React from 'react';
import {
  Compass,
  GitBranch,
  Target,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  Briefcase,
  Edit3,
  Layers,
  Award,
} from 'lucide-react';
import { StudentProfile, CareerRole } from '../types';
import { ReadinessBreakdown } from '../services/careerIntelligenceEngine';

interface MainDashboardProps {
  student: StudentProfile;
  readiness: ReadinessBreakdown;
  strengths: { title: string; description: string; tag: string }[];
  gaps: { title: string; description: string; action: string; urgency: 'High' | 'Medium' }[];
  topRoles: CareerRole[];
  onOpenEditProfile: () => void;
  onNavigate: (tab: any) => void;
  onSelectRole: (role: CareerRole) => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  student,
  readiness,
  strengths,
  gaps,
  topRoles,
  onOpenEditProfile,
  onNavigate,
  onSelectRole,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#17212B]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#EEF3F2] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#167C80] font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-[#1F8A70]" />
            <span>Campus Twin Career Intelligence Active</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0B1F33] tracking-tight">
            Good morning, {student.name}.
          </h1>
          <p className="text-sm text-[#52606D] mt-1">
            Here is what your current profile opens up across campus and industry pathways.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenEditProfile}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white hover:bg-[#EEF3F2] text-[#0B1F33] border border-[#D1D9E0] text-xs font-semibold shadow-2xs transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#167C80]" />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={() => onNavigate('careermap')}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#167C80] hover:bg-[#126467] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Explore Career Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid: Profile Snapshot & Profile Readiness Score */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Snapshot Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#EEF3F2] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-base text-[#0B1F33] flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#167C80]" />
                <span>Your Profile Snapshot</span>
              </h2>
              <button
                onClick={onOpenEditProfile}
                className="text-xs text-[#167C80] font-semibold hover:underline"
              >
                Modify
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#EEF3F2]">
                <div className="text-[10px] text-[#7B8794] uppercase font-semibold">Course</div>
                <div className="text-xs font-bold text-[#0B1F33] truncate mt-0.5" title={student.department}>
                  {student.department.split(' ')[0]}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#EEF3F2]">
                <div className="text-[10px] text-[#7B8794] uppercase font-semibold">Semester</div>
                <div className="text-xs font-bold text-[#0B1F33] mt-0.5">
                  Sem {student.semester} ({student.year} Year)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#EEF3F2]">
                <div className="text-[10px] text-[#7B8794] uppercase font-semibold">CGPA</div>
                <div className="text-xs font-bold text-[#167C80] mt-0.5">
                  {student.cgpa.toFixed(1)} / 10.0
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#EEF3F2]">
                <div className="text-[10px] text-[#7B8794] uppercase font-semibold">Time Budget</div>
                <div className="text-xs font-bold text-[#0B1F33] mt-0.5">
                  {student.weeklyHours} hrs / week
                </div>
              </div>
            </div>

            {/* Skills Pills */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-[#0B1F33] mb-1.5 flex items-center justify-between">
                <span>Verified Skills ({student.skills.length})</span>
                <span className="text-[11px] text-[#7B8794]">Proficiency mapped</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {student.skills.map((s) => (
                  <span
                    key={s.name}
                    className="px-2.5 py-1 rounded-lg bg-[#EEF3F2] text-[#0B1F33] text-xs font-medium border border-[#D1D9E0]/50 flex items-center space-x-1"
                  >
                    <span>{s.name}</span>
                    <span className="text-[10px] text-[#52606D] font-normal">
                      · {s.level}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Interests & Projects stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#EEF3F2] text-xs">
              <div>
                <span className="text-[#7B8794]">Interests: </span>
                <span className="text-[#0B1F33] font-medium">{student.interests.join(', ')}</span>
              </div>
              <div>
                <span className="text-[#7B8794]">Portfolio: </span>
                <span className="text-[#0B1F33] font-medium">
                  {student.projects.length} Projects · {student.hackathons.length} Hackathon · {student.internships.length} Internships
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Readiness Score Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#EEF3F2] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display font-bold text-base text-[#0B1F33]">
                Profile Readiness
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1F8A70]/10 text-[#1F8A70] font-semibold">
                Target: {student.careerGoal}
              </span>
            </div>

            <p className="text-xs text-[#52606D] mb-4">
              A combined view of your academic eligibility, relevant skills, experience and career alignment.
            </p>

            {/* Big Score Meter */}
            <div className="flex items-baseline space-x-2 mb-4">
              <span className="font-display text-5xl font-extrabold text-[#0B1F33] tracking-tight">
                {readiness.totalScore}
              </span>
              <span className="text-base text-[#7B8794] font-medium">/ 100</span>
            </div>

            {/* Contributing factors breakdown */}
            <div className="space-y-2.5">
              {[
                readiness.academicScore,
                readiness.technicalSkillScore,
                readiness.experienceScore,
                readiness.timeCommitmentScore,
              ].map((factor, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#0B1F33]">{factor.label}</span>
                    <span className="font-semibold text-[#52606D]">
                      {factor.score} / {factor.max} pts
                    </span>
                  </div>
                  <div className="w-full bg-[#EEF3F2] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#167C80] h-full rounded-full transition-all"
                      style={{ width: `${(factor.score / factor.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#EEF3F2] text-xs text-[#52606D]">
            {readiness.alignmentSummary}
          </div>
        </div>
      </div>

      {/* Strengths & Actionable Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What You're Bringing (Strengths) */}
        <div className="bg-white rounded-2xl p-6 border border-[#EEF3F2] shadow-xs">
          <h3 className="font-display font-bold text-base text-[#0B1F33] mb-1 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#1F8A70]" />
            <span>What you're bringing</span>
          </h3>
          <p className="text-xs text-[#52606D] mb-4">
            Core assets giving you an edge in recruitment and research screening.
          </p>

          <div className="space-y-3">
            {strengths.map((s, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#EEF3F2] space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0B1F33]">{s.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#EEF3F2] text-[#167C80] font-semibold">
                    {s.tag}
                  </span>
                </div>
                <p className="text-xs text-[#52606D] leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What Could Move You Forward (Actionable Gaps) */}
        <div className="bg-white rounded-2xl p-6 border border-[#EEF3F2] shadow-xs">
          <h3 className="font-display font-bold text-base text-[#0B1F33] mb-1 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-[#B7791F]" />
            <span>What could move you forward</span>
          </h3>
          <p className="text-xs text-[#52606D] mb-4">
            Every gap connects directly to a concrete campus action or workshop.
          </p>

          <div className="space-y-3">
            {gaps.slice(0, 3).map((g, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#EEF3F2] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0B1F33]">{g.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#B7791F]/10 text-[#B7791F] font-semibold">
                    {g.urgency} Priority
                  </span>
                </div>
                <p className="text-xs text-[#52606D]">{g.description}</p>
                <div className="pt-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-[#167C80] flex items-center space-x-1">
                    <span>→ {g.action}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#EEF3F2] flex justify-end">
            <button
              onClick={() => onNavigate('skillgaps')}
              className="text-xs font-semibold text-[#167C80] hover:underline flex items-center space-x-1"
            >
              <span>View Full Skill Gap Analysis</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Trajectories Closest to Profile */}
      <div className="bg-white rounded-2xl p-6 border border-[#EEF3F2] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h3 className="font-display font-bold text-base text-[#0B1F33]">
              Career Paths Closest to Your Current Profile
            </h3>
            <p className="text-xs text-[#52606D]">
              Derived from your skills, interests, and academic performance.
            </p>
          </div>
          <button
            onClick={() => onNavigate('careermap')}
            className="text-xs font-semibold text-[#167C80] hover:underline flex items-center space-x-1 self-start"
          >
            <span>Open Interactive Career Map</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topRoles.slice(0, 3).map((role) => (
            <div
              key={role.id}
              onClick={() => onSelectRole(role)}
              className="p-4 rounded-xl bg-[#F8FAF9] hover:bg-[#EEF3F2] border border-[#EEF3F2] hover:border-[#167C80]/40 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
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
                  <span className="text-xs font-bold text-[#0B1F33]">{role.matchScore}% fit</span>
                </div>

                <h4 className="font-display font-bold text-sm text-[#0B1F33] group-hover:text-[#167C80] transition-colors">
                  {role.title}
                </h4>
                <p className="text-xs text-[#52606D] line-clamp-2 mt-1 mb-3">
                  {role.description}
                </p>

                <div className="space-y-1 text-xs">
                  <div className="text-[11px] font-semibold text-[#0B1F33]">Why this fits:</div>
                  <div className="text-[11px] text-[#52606D] line-clamp-1">
                    ✓ {role.whyFits[0]}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#D1D9E0]/60 flex items-center justify-between text-xs text-[#167C80] font-semibold">
                <span>Explore Path</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
