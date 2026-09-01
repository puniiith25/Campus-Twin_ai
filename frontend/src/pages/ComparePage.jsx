import React from "react";
import { ComparisonView } from "@/components/compare/ComparisonView";
import { Scale } from "lucide-react";

export default function ComparePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center space-x-2">
          <span>Path Comparison & Trade-Off Engine</span>
          <Scale className="w-6 h-6 text-brand-600" />
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Evaluate candidate paths side-by-side across goal alignment, time commitment, research exposure, networking value, industry exposure, and faculty interaction.
        </p>
      </div>

      <ComparisonView />
    </div>
  );
}
