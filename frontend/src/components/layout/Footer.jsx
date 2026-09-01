import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Database, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white">CAMPUS TWIN</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed mb-4">
              "Explore Your Campus. Discover Your Path."
              <br />
              A Databricks Genie powered What-If Explorer discovering relationships across courses, clubs, research, events, and career opportunities.
            </p>
            <div className="flex items-center space-x-2 text-xs text-brand-300 bg-brand-950/60 border border-brand-800/80 px-3 py-2 rounded-lg inline-flex">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              <span>Uses synthetic, anonymized, and open campus-style data. No private student data used.</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Explorer Pages</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/explore" className="hover:text-brand-300 transition-colors">Explore Chat</Link></li>
              <li><Link to="/path" className="hover:text-brand-300 transition-colors">Visual Journey Path</Link></li>
              <li><Link to="/what-if" className="hover:text-brand-300 transition-colors">What-If Scenario Simulator</Link></li>
              <li><Link to="/compare" className="hover:text-brand-300 transition-colors">Path Comparison</Link></li>
              <li><Link to="/opportunities" className="hover:text-brand-300 transition-colors">Opportunity Directory</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Powered By</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center space-x-2"><Database className="w-4 h-4 text-brand-400" /><span>Databricks Free Edition</span></li>
              <li className="flex items-center space-x-2"><Sparkles className="w-4 h-4 text-indigo-400" /><span>Databricks Genie Agent</span></li>
              <li>FastAPI Async Backend</li>
              <li>Vite React SPA</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2026 Campus Twin. Production-Quality Hackathon Prototype.</p>
          <p className="mt-2 sm:mt-0">Designed for student possibility exploration.</p>
        </div>
      </div>
    </footer>
  );
}
