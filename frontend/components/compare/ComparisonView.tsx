"use client";

import React, { useState, useEffect } from "react";
import { CampusPath, ComparisonResponse } from "@/types";
import { fetchComparison } from "@/lib/api";
import { Scale, CheckCircle2, Sparkles, RefreshCw, ArrowRight } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";

interface ComparisonViewProps {
  pathA?: CampusPath;
  pathB?: CampusPath;
}

export function ComparisonView({ pathA, pathB }: ComparisonViewProps) {
  const [data, setData] = useState<ComparisonResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetchComparison(pathA, pathB);
        setData(res);
      } catch (err: any) {
        setError(err.message || "Failed to load path comparison");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [pathA, pathB]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <RefreshCw className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-700">Evaluating multi-metric path trade-offs...</p>
      </div>
    );
  }

  if (error || !data) {
    return <div className="p-4 bg-rose-50 text-rose-700 rounded-xl text-sm border border-rose-200">{error || "No data"}</div>;
  }

  const pA = data.path_a;
  const pB = data.path_b;

  const chartData = [
    { subject: 'Goal Match', PathA: pA.metrics.goal_alignment, PathB: pB.metrics.goal_alignment },
    { subject: 'Research', PathA: pA.metrics.research_exposure, PathB: pB.metrics.research_exposure },
    { subject: 'Networking', PathA: pA.metrics.networking_value, PathB: pB.metrics.networking_value },
    { subject: 'Industry', PathA: pA.metrics.industry_exposure, PathB: pB.metrics.industry_exposure },
    { subject: 'Faculty', PathA: pA.metrics.faculty_interaction, PathB: pB.metrics.faculty_interaction },
    { subject: 'Overall Score', PathA: pA.metrics.overall_score, PathB: pB.metrics.overall_score },
  ];

  return (
    <div className="space-y-8">
      {/* Explainable Recommendation Banner */}
      <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 text-white rounded-2xl p-6 shadow-glow">
        <div className="flex items-center space-x-2 text-brand-200 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Explainable Recommendation Engine</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Recommended Choice: {data.recommended_path}</h3>
        <p className="text-sm text-brand-100 leading-relaxed mb-4">{data.reasoning}</p>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Key Differentiators</h4>
          <ul className="space-y-1.5 text-xs text-brand-50">
            {data.differences.map((diff, idx) => (
              <li key={idx} className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{diff}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Radar Chart & Comparison Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col items-center">
          <h4 className="text-base font-bold text-slate-900 mb-2">Multi-Dimensional Metric Radar</h4>
          <p className="text-xs text-slate-500 mb-4">Comparing focus areas across 6 core criteria</p>

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                <Radar name={pA.title} dataKey="PathA" stroke="#7a5af8" fill="#7a5af8" fillOpacity={0.35} />
                <Radar name={pB.title} dataKey="PathB" stroke="#10b981" fill="#10b981" fillOpacity={0.35} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side-by-Side Table */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h4 className="text-base font-bold text-slate-900 mb-4">Metric Comparison Table</h4>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-left">
                  <th className="py-2.5 px-3">Metric</th>
                  <th className="py-2.5 px-3 font-semibold text-brand-600">{pA.title}</th>
                  <th className="py-2.5 px-3 font-semibold text-emerald-600">{pB.title}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-3 font-medium text-slate-700">Weekly Commitment</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{pA.total_hours_per_week}h/wk</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{pB.total_hours_per_week}h/wk</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-medium text-slate-700">Goal Alignment</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{pA.metrics.goal_alignment}%</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{pB.metrics.goal_alignment}%</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-medium text-slate-700">Research Exposure</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{pA.metrics.research_exposure}%</td>
                  <td className="py-3 px-3 font-semibold text-emerald-600 font-bold">{pB.metrics.research_exposure}%</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-medium text-slate-700">Networking Value</td>
                  <td className="py-3 px-3 font-semibold text-brand-600 font-bold">{pA.metrics.networking_value}%</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{pB.metrics.networking_value}%</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-medium text-slate-700">Industry Exposure</td>
                  <td className="py-3 px-3 font-semibold text-brand-600 font-bold">{pA.metrics.industry_exposure}%</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{pB.metrics.industry_exposure}%</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-medium text-slate-700">Faculty Interaction</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{pA.metrics.faculty_interaction}%</td>
                  <td className="py-3 px-3 font-semibold text-emerald-600 font-bold">{pB.metrics.faculty_interaction}%</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">Overall Path Score</td>
                  <td className="py-3 px-3 font-extrabold text-brand-700 text-sm">{pA.metrics.overall_score}/100</td>
                  <td className="py-3 px-3 font-extrabold text-emerald-700 text-sm">{pB.metrics.overall_score}/100</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
