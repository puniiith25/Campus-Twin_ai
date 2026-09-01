"use client";

import React from "react";
import { WhatIfSimulator } from "@/components/what-if/WhatIfSimulator";
import { Sparkles } from "lucide-react";

export default function WhatIfPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full border border-brand-200 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-pulse" />
          <span>Non-Negotiable Core Feature</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">What-If Path Explorer</h1>
        <p className="text-sm text-slate-500 mt-1">
          Modify your candidate journey in real-time. Substitute clubs with research, adjust weekly time limits, or change target career goals.
        </p>
      </div>

      <WhatIfSimulator />
    </div>
  );
}
