"use client";

import React, { useState } from "react";
import { WhatIfScenario, WhatIfResponse, CampusPath } from "@/types";
import { runWhatIfScenario } from "@/lib/api";
import { Sparkles, ArrowRight, RefreshCw, CheckCircle2, XCircle, TrendingUp, TrendingDown, Clock, Scale } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PathTimeline } from "../paths/PathTimeline";

interface WhatIfSimulatorProps {
  initialBasePath?: CampusPath;
}

export function WhatIfSimulator({ initialBasePath }: WhatIfSimulatorProps) {
  const [operation, setOperation] = useState<string>("REPLACE");
  const [target, setTarget] = useState<string>("AI Club");
  const [replacementType, setReplacementType] = useState<string>("Research");
  const [timeLimit, setTimeLimit] = useState<number>(6.0);

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<WhatIfResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const presets = [
    { label: "What if I replace AI Club with Research?", op: "REPLACE", tgt: "AI Club", repl: "Research", hours: 6 },
    { label: "What if I only have 4 hours per week?", op: "REDUCE_TIME", tgt: "", repl: "", hours: 4 },
    { label: "What if I remove the Club component?", op: "REMOVE", tgt: "AI Club", repl: "", hours: 6 },
    { label: "What if I expand to 10 hours per week?", op: "INCREASE_TIME", tgt: "", repl: "", hours: 10 },
  ];

  const handleRunPreset = (preset: typeof presets[0]) => {
    setOperation(preset.op);
    setTarget(preset.tgt);
    setReplacementType(preset.repl);
    setTimeLimit(preset.hours);
    executeScenario(preset.op, preset.tgt, preset.repl, preset.hours);
  };

  const executeScenario = async (
    op = operation,
    tgt = target,
    repl = replacementType,
    limit = timeLimit
  ) => {
    setLoading(true);
    setError(null);
    try {
      const scenario: WhatIfScenario = {
        operation: op,
        target: tgt,
        replacement_type: repl,
        new_time_limit: limit,
      };
      const data = await runWhatIfScenario(scenario, "path_career_focus", initialBasePath);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to execute What-If simulation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Control Panel Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">What-If Path Simulator</h2>
            <p className="text-xs text-slate-500">
              Experiment with path modifications in real time to understand trade-offs before committing.
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Quick Scenario Presets
          </label>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleRunPreset(p)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-brand-50 hover:border-brand-300 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:text-brand-700 transition-all flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3 text-brand-500" />
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Scenario Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Action Type</label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="REPLACE">Replace Component</option>
              <option value="REMOVE">Remove Component</option>
              <option value="REDUCE_TIME">Change Time Budget</option>
            </select>
          </div>

          {operation === "REPLACE" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Component</label>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="e.g. AI Club"
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Substitute With</label>
                <select
                  value={replacementType}
                  onChange={(e) => setReplacementType(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="Research">Faculty Research</option>
                  <option value="Networking">Industry Networking</option>
                  <option value="Skill">Skill Building</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Weekly Limit: <span className="font-bold text-brand-600">{timeLimit} hrs/wk</span>
            </label>
            <input
              type="range"
              min={2}
              max={15}
              step={1}
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="w-full accent-brand-600 mt-2"
            />
          </div>
        </div>

        <button
          onClick={() => executeScenario()}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold rounded-xl text-sm shadow-glow flex items-center justify-center space-x-2 transition-all"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Databricks Genie is Recalculating Path...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Simulate What-If Scenario</span>
            </>
          )}
        </button>

        {error && <div className="mt-4 p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">{error}</div>}
      </div>

      {/* Scenario Results */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Visual Diff Card */}
          <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center space-x-2 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Scale className="w-4 h-4 text-brand-400" />
              <span>What-If Visual Diff & Trade-Off Summary</span>
            </div>
            <p className="text-sm text-slate-200 mb-6 leading-relaxed">{result.explanation}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 mb-6">
              <div>
                <h4 className="text-xs font-bold text-brand-200 uppercase tracking-wider mb-2">Actionable Changes</h4>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {result.changes.map((c, idx) => (
                    <li key={idx} className="flex items-center space-x-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">Trade-Off Analysis</h4>
                <ul className="space-y-1.5 text-xs">
                  {result.trade_offs.map((t, idx) => {
                    const isPos = t.startsWith("+") || t.startsWith("✓");
                    return (
                      <li key={idx} className={`flex items-center space-x-1.5 ${isPos ? 'text-emerald-300' : 'text-amber-300'}`}>
                        {isPos ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>{t}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Metric Comparison Deltas */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {result.metric_comparisons.map((m, idx) => {
                const isPositive = m.delta >= 0;
                return (
                  <div key={idx} className="bg-white/5 p-3 rounded-lg border border-white/10 text-center">
                    <div className="text-xs text-slate-400 font-medium">{m.metric_name}</div>
                    <div className="text-lg font-bold text-white mt-0.5">{m.alternative_val}</div>
                    <div className={`text-xs font-semibold mt-0.5 flex items-center justify-center ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPositive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                      {m.delta > 0 ? `+${m.delta}` : m.delta}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side-by-Side Path Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                <span>BEFORE (Original Career Path)</span>
              </div>
              <PathTimeline path={result.original_path} showWhatIfButton={false} />
            </div>

            <div>
              <div className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-2 flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                <span>AFTER (What-If Alternative Path)</span>
              </div>
              <PathTimeline path={result.alternative_path} showWhatIfButton={false} />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
