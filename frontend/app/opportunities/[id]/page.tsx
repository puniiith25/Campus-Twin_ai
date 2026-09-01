"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { OpportunityItem } from "@/types";
import { fetchOpportunityDetail } from "@/lib/api";
import { Clock, CheckCircle2, ArrowLeft, Award, Sparkles, Building, UserCheck } from "lucide-react";
import Link from "next/link";
import { formatHours } from "@/lib/utils";

export default function OpportunityDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [item, setItem] = useState<OpportunityItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function load() {
      setLoading(true);
      try {
        const res = await fetchOpportunityDetail(id);
        setItem(res);
      } catch (err: any) {
        setError(err.message || "Opportunity not found");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">Loading opportunity details...</div>;
  }

  if (error || !item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="p-4 bg-rose-50 text-rose-700 rounded-xl text-sm border border-rose-200">{error || "Not found"}</div>
        <Link href="/opportunities" className="mt-4 inline-flex items-center text-xs font-semibold text-brand-600">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <Link href="/opportunities" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to directory
      </Link>

      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full border border-brand-200">
                {item.type}
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
                {item.score}% Match Score
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">{item.name}</h1>
            {item.faculty_or_organizer && (
              <p className="text-xs text-slate-500 mt-1 flex items-center">
                <UserCheck className="w-3.5 h-3.5 mr-1" />
                Led by: {item.faculty_or_organizer}
              </p>
            )}
          </div>

          <Link
            href="/path"
            className="px-5 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-glow flex items-center space-x-2 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Add to My Path</span>
          </Link>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Opportunity Overview</h3>
          <p className="text-sm text-slate-700 leading-relaxed">{item.description}</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <span className="text-xs text-slate-500 block">Weekly Commitment</span>
            <span className="text-sm font-bold text-slate-900 flex items-center mt-0.5">
              <Clock className="w-4 h-4 mr-1 text-brand-600" />
              {formatHours(item.hours_per_week)}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 block">Difficulty Level</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">{item.difficulty}</span>
          </div>

          <div>
            <span className="text-xs text-slate-500 block">Department / Organization</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">{item.category_or_department || "Campus Wide"}</span>
          </div>
        </div>

        {/* Skills Developed */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Skills Developed</h3>
          <div className="flex flex-wrap gap-2">
            {item.skills_developed.map((sk) => (
              <span key={sk} className="px-3 py-1 bg-brand-50 text-brand-700 font-semibold text-xs rounded-full border border-brand-200">
                +{sk}
              </span>
            ))}
          </div>
        </div>

        {/* Prerequisites */}
        {item.prerequisites && item.prerequisites.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Prerequisites Required</h3>
            <ul className="space-y-1 text-xs text-slate-700">
              {item.prerequisites.map((pr, idx) => (
                <li key={idx} className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{pr}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
