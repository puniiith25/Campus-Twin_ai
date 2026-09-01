/**
 * Campus Twin - Campus Ecosystem & Opportunities Hub
 * Clickable category hub and rich opportunity cards with eligibility and time compatibility checks.
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  FlaskConical,
  Code2,
  Users,
  Briefcase,
  Layers,
} from 'lucide-react';
import { StudentProfile, Opportunity, OpportunityType } from '../types';
import { MASTER_OPPORTUNITIES } from '../data/campusIntelligenceData';

interface CategoryHubProps {
  student: StudentProfile;
  onNavigate: (tab: any) => void;
  onSelectRoleForGaps: (roleTitle: string) => void;
}

const CATEGORIES: { id: string; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'All', label: 'All Opportunities', icon: Layers },
  { id: 'Research Lab', label: 'Research Labs', icon: FlaskConical },
  { id: 'Workshop', label: 'Workshops', icon: BookOpen },
  { id: 'Hackathon', label: 'Hackathons', icon: Code2 },
  { id: 'Internship', label: 'Internships', icon: Briefcase },
  { id: 'Course', label: 'Certifications & Courses', icon: Award },
  { id: 'Campus Club', label: 'Student Clubs & Teams', icon: Users },
];

export const CategoryHubAndOpportunities: React.FC<CategoryHubProps> = ({
  student,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyEligible, setOnlyEligible] = useState<boolean>(false);
  const [onlyTimeFit, setOnlyTimeFit] = useState<boolean>(false);

  // Filter logic
  const filteredOpportunities = MASTER_OPPORTUNITIES.filter((opp) => {
    // Category filter
    if (selectedCategory !== 'All' && opp.type !== selectedCategory) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = opp.title.toLowerCase().includes(q);
      const matchDomain = opp.domain.toLowerCase().includes(q);
      const matchSkills = opp.requiredSkills.some((s) => s.toLowerCase().includes(q));
      const matchProvider = opp.provider.toLowerCase().includes(q);
      if (!matchTitle && !matchDomain && !matchSkills && !matchProvider) {
        return false;
      }
    }

    // Eligibility check
    if (onlyEligible) {
      if (opp.eligibility.minCgpa && student.cgpa < opp.eligibility.minCgpa) {
        return false;
      }
      if (
        opp.eligibility.allowedDepts &&
        opp.eligibility.allowedDepts.length > 0 &&
        !opp.eligibility.allowedDepts.includes(student.department)
      ) {
        return false;
      }
    }

    // Time fit check
    if (onlyTimeFit) {
      if (opp.hoursPerWeek > student.weeklyHours + 2) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#17212B]">
      {/* Header & Demo Data Badge */}
      <div className="border-b border-[#EEF3F2] pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#167C80] font-semibold mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Campus Twin Intelligence · Demo campus data</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-[#0B1F33] tracking-tight">
            Explore your campus ecosystem
          </h1>
          <p className="text-sm text-[#52606D] mt-1">
            Verified university labs, corporate workshops, hackathons, and research fellowships matching your profile.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-[#7B8794]">
          <span className="px-3 py-1.5 rounded-lg bg-[#EEF3F2] font-medium text-[#0B1F33]">
            {filteredOpportunities.length} opportunities available
          </span>
        </div>
      </div>

      {/* Category Hub Filter Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#167C80] text-white shadow-xs'
                  : 'bg-white text-[#52606D] hover:bg-[#EEF3F2] hover:text-[#0B1F33] border border-[#D1D9E0]/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Compatibility Toggles */}
      <div className="bg-white p-4 rounded-2xl border border-[#EEF3F2] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#7B8794]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keyword, skill (e.g. Python, SQL), lab, or provider..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F8FAF9] border border-[#D1D9E0] text-xs text-[#17212B] placeholder-[#7B8794] focus:outline-none focus:ring-2 focus:ring-[#167C80]/30"
          />
        </div>

        <div className="flex items-center space-x-3 text-xs text-[#0B1F33]">
          <label className="flex items-center space-x-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyEligible}
              onChange={(e) => setOnlyEligible(e.target.checked)}
              className="rounded text-[#167C80] focus:ring-[#167C80]"
            />
            <span>Eligible for my {student.cgpa} CGPA</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyTimeFit}
              onChange={(e) => setOnlyTimeFit(e.target.checked)}
              className="rounded text-[#167C80] focus:ring-[#167C80]"
            />
            <span>Fits my {student.weeklyHours}h/wk schedule</span>
          </label>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOpportunities.map((opp) => {
          const isEligible = !opp.eligibility.minCgpa || student.cgpa >= opp.eligibility.minCgpa;
          const isTimeCompatible = opp.hoursPerWeek <= student.weeklyHours + 2;

          return (
            <div
              key={opp.id}
              className="bg-white rounded-2xl p-6 border border-[#EEF3F2] shadow-xs flex flex-col justify-between hover:border-[#167C80]/40 transition-colors"
            >
              <div>
                {/* Top Type & Compatibility Tags */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-[#EEF3F2] text-[#167C80] border border-[#167C80]/20">
                    {opp.type} · {opp.domain}
                  </span>

                  <div className="flex items-center space-x-1 text-[11px]">
                    {isEligible ? (
                      <span className="text-[#1F8A70] font-medium flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Eligible</span>
                      </span>
                    ) : (
                      <span className="text-[#B7791F] font-medium flex items-center space-x-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Requires {opp.eligibility.minCgpa} CGPA</span>
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-display font-bold text-base text-[#0B1F33] mb-1">
                  {opp.title}
                </h3>
                <div className="text-xs text-[#7B8794] mb-3">{opp.provider}</div>

                <p className="text-xs text-[#52606D] leading-relaxed mb-4">
                  {opp.description}
                </p>

                {/* Key Opportunity Metadata */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="p-2.5 rounded-xl bg-[#F8FAF9] flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-[#167C80] shrink-0" />
                    <div>
                      <div className="text-[10px] text-[#7B8794]">Time Commitment</div>
                      <div className="font-semibold text-[#0B1F33] text-[11px]">
                        {opp.timeCommitment}
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F8FAF9] flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-[#167C80] shrink-0" />
                    <div>
                      <div className="text-[10px] text-[#7B8794]">Campus Resource / Lab</div>
                      <div className="font-semibold text-[#0B1F33] text-[11px] truncate" title={opp.campusResource}>
                        {opp.campusResource}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Why Recommended & Next Action */}
                <div className="space-y-2 p-3.5 rounded-xl bg-[#EEF3F2]/60 border border-[#D1D9E0]/50 text-xs mb-4">
                  <div>
                    <span className="font-bold text-[#0B1F33]">Why recommended: </span>
                    <span className="text-[#52606D]">{opp.whyRecommended}</span>
                  </div>
                  <div className="pt-1 border-t border-[#D1D9E0]/40 text-[#167C80] font-medium flex items-center space-x-1">
                    <span>Next Action: {opp.nextAction}</span>
                  </div>
                </div>

                {/* Required Skills Chips */}
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-[11px] text-[#7B8794]">Prerequisite Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {opp.requiredSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded bg-white border border-[#D1D9E0] text-[10px] font-semibold text-[#0B1F33]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action bar */}
              <div className="mt-5 pt-3 border-t border-[#EEF3F2] flex items-center justify-between text-xs">
                {opp.stipendOrPrize ? (
                  <span className="font-semibold text-[#1F8A70] text-[11px]">
                    ★ {opp.stipendOrPrize}
                  </span>
                ) : (
                  <span className="text-[11px] text-[#7B8794]">
                    Deadline: {opp.deadline || 'Rolling'}
                  </span>
                )}

                <button
                  onClick={() => alert(`Enrolled / Bookmarked ${opp.title}. Check your university dashboard for updates.`)}
                  className="px-4 py-2 rounded-xl bg-[#167C80] hover:bg-[#126467] text-white font-semibold transition-colors flex items-center space-x-1"
                >
                  <span>Engage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
