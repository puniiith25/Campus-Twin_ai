import React, { useState, useEffect } from "react";
import { fetchOpportunities } from "@/lib/api";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";
import { Grid, Search, RefreshCw } from "lucide-react";

export default function OpportunitiesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedSkill, setSelectedSkill] = useState("All");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetchOpportunities();
        setItems(res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const types = ["All", "Course", "Club", "Event", "Research Project", "Opportunity", "Facility"];
  const skills = ["All", "Python", "Machine Learning", "Deep Learning", "Computer Vision", "Generative AI", "Databricks Unity Catalog", "FastAPI", "Next.js & React"];

  const filtered = items.filter((item) => {
    if (selectedType !== "All" && !(item.type || "").toLowerCase().includes(selectedType.toLowerCase())) return false;
    if (selectedSkill !== "All" && !(item.skills_developed || []).some(s => s.toLowerCase() === selectedSkill.toLowerCase())) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = (item.name || "").toLowerCase().includes(q) || (item.description || "").toLowerCase().includes(q) || (item.skills_developed || []).some(s => s.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center space-x-2">
          <span>Connected Campus Opportunities</span>
          <Grid className="w-6 h-6 text-brand-600" />
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Filter and explore courses, clubs, events, research projects, fellowships, and facilities.
        </p>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search opportunities by title, description, or skill..."
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  Category: {t}
                </option>
              ))}
            </select>

            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
            >
              {skills.map((s) => (
                <option key={s} value={s}>
                  Skill: {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="text-center py-16">
          <RefreshCw className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">Loading dataset records...</p>
        </div>
      ) : (
        <div>
          <div className="text-xs font-semibold text-slate-500 mb-4">Showing {filtered.length} opportunities</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <OpportunityCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
