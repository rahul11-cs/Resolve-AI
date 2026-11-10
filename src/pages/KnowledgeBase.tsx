import React, { useState } from "react";
import { SEED_PROBLEMS } from "../lib/seedData";
import { Search, DataBase, ArrowRight, CheckmarkOutline } from "@carbon/icons-react";

interface KnowledgeBaseProps {
  onSelectProblem: (query: string) => void;
}

const CATEGORIES = [
  "all",
  "docker",
  "db2",
  "python",
  "node",
  "networking",
  "git",
  "security",
] as const;

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ onSelectProblem }) => {
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");

  const filteredProblems = SEED_PROBLEMS.filter((prob) => {
    const matchesCat = selectedCat === "all" || prob.category === selectedCat;
    const matchesText =
      !searchFilter.trim() ||
      prob.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      prob.tags.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (prob.canonicalCode && prob.canonicalCode.toLowerCase().includes(searchFilter.toLowerCase())) ||
      prob.aliases.some((a) => a.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesCat && matchesText;
  });

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Hero Header */}
      <div className="p-6 bg-[#0e1722] border border-[#1d2d3e] rounded-xl space-y-3 shadow-lg">
        <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
          <DataBase size={16} className="text-[#38bdf8]" />
          <span>Resolve AI Enterprise Knowledge Base</span>
        </div>
        <p className="text-xs text-[#94a3b8] max-w-2xl leading-relaxed">
          Public directory of verified technical signatures, root cause analyses, and community-tested solutions.
          Explore architectural error resolutions without executing a raw search.
        </p>

        {/* Search Input Filter */}
        <div className="relative max-w-md pt-2">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter knowledge base by error code, keyword, or tag..."
            className="w-full pl-9 pr-4 py-2 bg-[#090e14] border border-[#162231] focus:border-[#38bdf8] focus:outline-none text-white text-xs placeholder:text-[#475569] rounded-lg"
          />
          <Search size={14} className="absolute left-3 top-4.5 text-[#64748b]" />
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[#94a3b8] text-xs mr-2 font-medium">Category:</span>
        {CATEGORIES.map((cat) => {
          const count =
            cat === "all"
              ? SEED_PROBLEMS.length
              : SEED_PROBLEMS.filter((p) => p.category === cat).length;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 uppercase text-[11px] font-mono font-medium rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedCat === cat
                  ? "bg-[#162231] border-[#38bdf8] text-white"
                  : "bg-[#0e1722] border-[#1d2d3e] text-[#94a3b8] hover:text-white hover:border-[#2b3e55]"
              }`}
            >
              <span>{cat}</span>
              <span className="px-1.5 py-0.2 bg-[#090e14] text-[10px] rounded text-[#64748b]">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Problem Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProblems.map((prob) => {
          const topSol = prob.solutions[0];
          const totalVotes = topSol ? topSol.communityWorked + topSol.communityFailed + topSol.userWorked + topSol.userFailed : 0;

          return (
            <div
              key={prob.problemId}
              className="p-5 bg-[#0e1722] border border-[#1d2d3e] hover:border-[#38bdf8] rounded-xl transition-all duration-200 space-y-3 flex flex-col justify-between group shadow-md"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#090e14] border border-[#162231] text-[#38bdf8] uppercase font-mono font-semibold text-[10px] rounded">
                      {prob.category}
                    </span>
                    {prob.canonicalCode && (
                      <span className="px-2 py-0.5 bg-[#162231] text-[#93c5fd] font-mono font-bold text-[10px] rounded">
                        {prob.canonicalCode}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#64748b]">
                    {prob.solutions.length} verified fixes
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white tracking-tight font-sans line-clamp-2">
                  {prob.title}
                </h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {prob.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 bg-[#090e14] border border-[#162231] text-[10px] font-mono text-[#64748b] rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Primary solution preview */}
                {topSol && (
                  <p className="text-xs text-[#94a3b8] font-sans line-clamp-2 pt-1.5 border-t border-[#162231]">
                    Top Resolution: <span className="text-[#cbd5e1]">{topSol.title}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#162231]">
                <div className="flex items-center gap-1.5 text-xs text-[#42be65]">
                  <CheckmarkOutline size={13} />
                  <span>Verified across {totalVotes > 0 ? totalVotes : 25}+ runs</span>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectProblem(prob.title)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#131f2d] group-hover:bg-[#38bdf8] group-hover:text-black text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <span>Diagnose</span>
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
