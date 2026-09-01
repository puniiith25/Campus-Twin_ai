import React, { useState, useEffect } from "react";
import { PathTimeline } from "@/components/paths/PathTimeline";
import { fetchPaths } from "@/lib/api";
import { GitFork, Sparkles, RefreshCw, Scale } from "lucide-react";
import { Link } from "react-router-dom";

export default function PathPage() {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetchPaths("AI Engineer", 6.0);
        setPaths(res?.paths || []);
      } catch (err) {
        setError(err.message || "Failed to load candidate paths");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <RefreshCw className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-700">Constructing data-backed candidate paths...</p>
      </div>
    );
  }

  if (error || paths.length === 0) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-rose-700">{error || "No paths found"}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center space-x-2">
            <span>Your Recommended Campus Paths</span>
            <GitFork className="w-6 h-6 text-brand-600" />
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Generated from Databricks campus datasets for target goal: <span className="font-bold text-slate-800">AI Engineer</span> (Limit: 6 hrs/wk).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/what-if"
            className="px-4 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-glow flex items-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch What-If Explorer</span>
          </Link>
          <Link
            to="/compare"
            className="px-4 py-2.5 bg-white text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center space-x-1.5"
          >
            <Scale className="w-4 h-4" />
            <span>Compare Paths</span>
          </Link>
        </div>
      </div>

      <div className="space-y-12">
        {paths.map((p) => (
          <PathTimeline key={p.path_id} path={p} />
        ))}
      </div>
    </div>
  );
}
