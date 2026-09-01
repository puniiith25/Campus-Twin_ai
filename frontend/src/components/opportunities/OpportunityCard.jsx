import React from "react";
import { Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatHours } from "@/lib/utils";

export function OpportunityCard({ item, onAddToPath }) {
  const getBadgeStyle = (type) => {
    const t = (type || "").toLowerCase();
    if (t.includes("course")) return "bg-blue-50 text-blue-700 border-blue-200";
    if (t.includes("club")) return "bg-purple-50 text-purple-700 border-purple-200";
    if (t.includes("research")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (t.includes("fellowship") || t.includes("internship")) return "bg-indigo-50 text-indigo-700 border-indigo-200";
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-md border ${getBadgeStyle(item.type)}`}>
            {item.type}
          </span>
          <span className="text-xs font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
            {item.score}% match
          </span>
        </div>

        <h3 className="font-bold text-base text-slate-900 mb-1.5 line-clamp-1">{item.name}</h3>
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">{item.description}</p>

        {/* Reasons */}
        {item.match_reasons && item.match_reasons.length > 0 && (
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-4">
            <div className="text-[11px] font-medium text-slate-700 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1 shrink-0" />
              <span className="line-clamp-1">{item.match_reasons[0]}</span>
            </div>
          </div>
        )}

        {/* Skills */}
        <div className="flex flex-wrap gap-1 mb-4">
          {(item.skills_developed || []).slice(0, 4).map((s) => (
            <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-medium rounded">
              +{s}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 flex items-center">
          <Clock className="w-3.5 h-3.5 mr-1" />
          {formatHours(item.hours_per_week)}
        </span>

        <div className="flex items-center space-x-2">
          <Link
            to={`/opportunities/${item.id}`}
            className="text-brand-600 hover:text-brand-800 font-semibold flex items-center hover:underline"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
