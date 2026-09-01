/**
 * Campus Twin - Placement Readiness & Corporate Eligibility
 * Explainable eligibility matching against Tier-1 & Core campus recruiters.
 */

import React, { useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  TrendingUp,
  Award,
  Building2,
  FileCheck,
  Search,
} from 'lucide-react';
import { StudentProfile, PlacementCompanyRecord } from '../types';
import { getAnalyzedPlacements } from '../services/careerIntelligenceEngine';

interface PlacementsViewProps {
  student: StudentProfile;
  onNavigate: (tab: any) => void;
}

export const PlacementsView: React.FC<PlacementsViewProps> = ({
  student,
  onNavigate,
}) => {
  const [filterTier, setFilterTier] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const records = getAnalyzedPlacements(student);

  const filteredRecords = records.filter((r) => {
    if (filterTier !== 'All' && r.tier !== filterTier) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        r.company.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        r.requiredSkills.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Readiness breakdown metrics
  const placementMetrics = [
    { label: 'Academic Standing (CGPA)', score: student.cgpa >= 8.0 ? 95 : 78, status: 'Strong', note: `${student.cgpa} CGPA clears 95% of cut-offs` },
    { label: 'Technical Prerequisite Skills', score: 76, status: 'Good', note: 'Python & C++ strong; SQL & DSA deepening in progress' },
    { label: 'Project & Portfolio Depth', score: 72, status: 'Good', note: `${student.projects.length} completed projects with live impact` },
    { label: 'Industry & Hackathon Experience', score: 65, status: 'Developing', note: '1 Hackathon; target 1 summer internship or fellowship' },
    { label: 'Online Assessment (OA) Sharpness', score: 80, status: 'Good', note: 'Solid algorithmic fundamentals in C++' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#17212B]">
      {/* Header */}
      <div className="border-b border-[#EEF3F2] pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#167C80] font-semibold mb-1">
            <Briefcase className="w-4 h-4" />
            <span>Campus Placement Intelligence · Demo Recruitment Data</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-[#0B1F33] tracking-tight">
            Placement Readiness
          </h1>
          <p className="text-sm text-[#52606D] mt-1">
            Objective eligibility breakdown and direct preparation strategies for visiting campus recruiters.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('skillgaps')}
            className="px-4 py-2 rounded-xl bg-white border border-[#D1D9E0] text-xs font-semibold text-[#0B1F33] hover:bg-[#F8FAF9] shadow-2xs"
          >
            Review Skill Gaps
          </button>
        </div>
      </div>

      {/* Placement Readiness Breakdown Visual */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EEF3F2] shadow-xs">
        <h2 className="font-display font-bold text-lg text-[#0B1F33] mb-1">
          Placement Dimension Analysis
        </h2>
        <p className="text-xs text-[#52606D] mb-6">
          How your current academic standing, technical skills, and projects map to recruiter screening criteria.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {placementMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#F8FAF9] border border-[#EEF3F2] space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#0B1F33] mb-1">
                  <span>{metric.label}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded ${
                      metric.status === 'Strong'
                        ? 'bg-[#1F8A70]/10 text-[#1F8A70]'
                        : metric.status === 'Good'
                        ? 'bg-[#167C80]/10 text-[#167C80]'
                        : 'bg-[#B7791F]/10 text-[#B7791F]'
                    }`}
                  >
                    {metric.status}
                  </span>
                </div>
                <p className="text-xs text-[#52606D] leading-relaxed">{metric.note}</p>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between text-[11px] text-[#7B8794] mb-1">
                  <span>Readiness Coverage</span>
                  <span className="font-bold text-[#0B1F33]">{metric.score}%</span>
                </div>
                <div className="w-full bg-[#EEF3F2] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#167C80] h-full rounded-full"
                    style={{ width: `${metric.score}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recruiter Eligibility Directory */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-lg text-[#0B1F33]">
              Visiting Recruiters & Eligibility Mapping
            </h2>
            <p className="text-xs text-[#52606D]">
              Synthetic historical hiring criteria benchmarked against your actual profile.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#7B8794]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter companies or roles..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[#D1D9E0] text-xs text-[#17212B]"
              />
            </div>
          </div>
        </div>

        {/* Company Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecords.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-2xl p-6 border border-[#EEF3F2] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-display font-bold text-base text-[#0B1F33]">
                        {rec.company}
                      </h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#EEF3F2] text-[#167C80]">
                        {rec.tier}
                      </span>
                    </div>
                    <div className="text-xs text-[#52606D] font-medium">{rec.role}</div>
                  </div>

                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-md flex items-center space-x-1 shrink-0 ${
                      rec.eligibilityMatch === 'Eligible'
                        ? 'bg-[#1F8A70]/10 text-[#1F8A70]'
                        : rec.eligibilityMatch === 'Borderline CGPA'
                        ? 'bg-[#B7791F]/10 text-[#B7791F]'
                        : 'bg-[#0B1F33]/10 text-[#0B1F33]'
                    }`}
                  >
                    {rec.eligibilityMatch === 'Eligible' && <CheckCircle2 className="w-3 h-3" />}
                    <span>{rec.eligibilityMatch}</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs my-3">
                  <div className="p-2 rounded-lg bg-[#F8FAF9]">
                    <div className="text-[10px] text-[#7B8794]">Historical CTC</div>
                    <div className="font-bold text-[#0B1F33]">{rec.avgPackage}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#F8FAF9]">
                    <div className="text-[10px] text-[#7B8794]">CGPA Cut-off</div>
                    <div className="font-bold text-[#0B1F33]">Min {rec.minCgpa} CGPA</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#EEF3F2]/60 border border-[#D1D9E0]/50">
                    <span className="font-bold text-[#0B1F33]">Eligibility Note: </span>
                    <span className="text-[#52606D]">{rec.eligibilityReason}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F8FAF9] border border-[#EEF3F2]">
                    <span className="font-bold text-[#167C80]">Prep Focus: </span>
                    <span className="text-[#52606D]">{rec.prepRecommendation}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#EEF3F2] flex items-center justify-between text-xs">
                <div className="flex flex-wrap gap-1">
                  {rec.requiredSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded bg-white border border-[#D1D9E0] text-[10px] text-[#52606D]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <span className="text-[11px] text-[#7B8794]">
                  ~{rec.historicalHiresAnnual} hires/yr
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
