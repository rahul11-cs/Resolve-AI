import React, { useState, useEffect } from "react";
import { getStats, resetCommunityData, OverallStats } from "../api/client";
import { wilsonLowerBound } from "../lib/ranking";
import { ChartBar, Renew, Reset, Flash, Time, CheckmarkOutline, Activity, ChartLineData } from "@carbon/icons-react";

export const Stats: React.FC = () => {
  const [stats, setStats] = useState<OverallStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Wilson interactive simulator parameters
  const [simAWorked, setSimAWorked] = useState(3);
  const [simAFailed, setSimAFailed] = useState(0);
  const [simBWorked, setSimBWorked] = useState(90);
  const [simBFailed, setSimBFailed] = useState(10);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getStats();
      setStats(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReset = () => {
    if (confirm("Reset all local vote mutations back to default seed data?")) {
      resetCommunityData();
      loadData();
    }
  };

  const boundA = wilsonLowerBound(simAWorked, simAFailed);
  const boundB = wilsonLowerBound(simBWorked, simBFailed);
  const totalA = simAWorked + simAFailed;
  const totalB = simBWorked + simBFailed;
  const rateA = totalA > 0 ? ((simAWorked / totalA) * 100).toFixed(1) : "0.0";
  const rateB = totalB > 0 ? ((simBWorked / totalB) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-8 font-mono">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-6 bg-[#171717] border border-[#2e2e2e]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#0f62fe] font-semibold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 bg-[#0f62fe] inline-block" />
            Global Telemetry & Analytics
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Resolve AI Performance & Resolution Intelligence
          </h1>
          <p className="text-xs text-[#8d8d8d] mt-0.5">
            Real-time analytics across IBM Db2 vector retrieval, Wilson confidence bounds, and category success rates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#222222] hover:bg-[#2e2e2e] border border-[#393939] text-white transition-colors cursor-pointer"
          >
            <Renew size={14} className={isLoading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#222222] hover:bg-[#da1e28]/20 border border-[#da1e28] text-[#fa4d56] transition-colors cursor-pointer"
          >
            <Reset size={14} />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-[#171717] border border-[#2e2e2e] space-y-1">
            <span className="text-[10px] text-[#8d8d8d] uppercase tracking-wider block">
              Resolution Success Rate
            </span>
            <span className="text-2xl font-bold text-[#42be65] tabular-nums block">
              {stats.resolution_success_rate}%
            </span>
            <span className="text-[11px] text-[#8d8d8d]">
              Across verified resolutions
            </span>
          </div>

          <div className="p-4 bg-[#171717] border border-[#2e2e2e] space-y-1">
            <span className="text-[10px] text-[#8d8d8d] uppercase tracking-wider block">
              Average Similarity
            </span>
            <span className="text-2xl font-bold text-[#0f62fe] tabular-nums block">
              {stats.average_similarity}%
            </span>
            <span className="text-[11px] text-[#8d8d8d]">
              Cosine vector alignment
            </span>
          </div>

          <div className="p-4 bg-[#171717] border border-[#2e2e2e] space-y-1">
            <span className="text-[10px] text-[#8d8d8d] uppercase tracking-wider block">
              Average Search Latency
            </span>
            <span className="text-2xl font-bold text-[#f1c21b] tabular-nums block">
              {stats.avg_search_latency_ms}ms
            </span>
            <span className="text-[11px] text-[#8d8d8d]">
              IBM Db2 index retrieval
            </span>
          </div>

          <div className="p-4 bg-[#171717] border border-[#2e2e2e] space-y-1">
            <span className="text-[10px] text-[#8d8d8d] uppercase tracking-wider block">
              Community Contributions
            </span>
            <span className="text-2xl font-bold text-[#a56eff] tabular-nums block">
              {stats.total_solutions}
            </span>
            <span className="text-[11px] text-[#8d8d8d]">
              Total verified solution graphs
            </span>
          </div>
        </div>
      )}

      {/* Visual Observation Graphs & Category Analytics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Visual Category Success Rate Bars */}
          <div className="bg-[#171717] border border-[#2e2e2e] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e2e2e] pb-3">
              <div className="flex items-center gap-2">
                <CheckmarkOutline size={16} className="text-[#42be65]" />
                <h3 className="font-semibold text-white uppercase tracking-wider text-xs">
                  Category Success Rate Distribution
                </h3>
              </div>
              <span className="text-[#8d8d8d] text-[11px]">Ranked by Wilson Lower Bound</span>
            </div>

            <div className="space-y-4 pt-1">
              {stats.top_categories.map((cat) => (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#0f62fe] inline-block" />
                      {cat.category}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#8d8d8d]">{cat.count} verified fixes</span>
                      <span className="text-[#42be65] font-bold tabular-nums">
                        {cat.success_rate}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-[#222222] overflow-hidden flex items-center">
                    <div
                      className="h-full bg-gradient-to-r from-[#0f62fe] to-[#42be65] transition-all duration-500"
                      style={{ width: `${cat.success_rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Query Volume & Average Similarity Chart */}
          <div className="bg-[#171717] border border-[#2e2e2e] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e2e2e] pb-3">
              <div className="flex items-center gap-2">
                <Flash size={16} className="text-[#f1c21b]" />
                <h3 className="font-semibold text-white uppercase tracking-wider text-xs">
                  Most Searched Problem Signatures
                </h3>
              </div>
              <span className="text-[#8d8d8d] text-[11px]">Query Volume vs Similarity</span>
            </div>

            <div className="space-y-2.5">
              {stats.top_searches.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-[#1f1f1f] border border-[#2e2e2e] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[#c6c6c6] text-xs font-semibold truncate max-w-xs" title={item.query}>
                      {item.query}
                    </span>
                    <div className="flex items-center gap-3 shrink-0 text-[11px]">
                      <span className="text-[#8d8d8d]">{item.count} queries</span>
                      <span className="text-[#42be65] font-bold">{item.avg_similarity}% sim</span>
                    </div>
                  </div>

                  <div className="h-1.5 w-full bg-[#141414] overflow-hidden">
                    <div
                      className="h-full bg-[#0f62fe]"
                      style={{ width: `${item.avg_similarity}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Wilson Algorithm Simulator */}
      <div className="p-6 bg-[#171717] border border-[#2e2e2e] space-y-5">
        <div className="border-b border-[#2e2e2e] pb-3">
          <div className="flex items-center gap-2">
            <ChartBar size={18} className="text-[#0f62fe]" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Wilson Lower Bound Simulator (Proof: 90/100 Beats 3/3)
            </h3>
          </div>
          <p className="text-xs text-[#c6c6c6] mt-1">
            Naive scoring uses <code>worked / total</code>, giving 3 out of 3 a deceptive 100% score. The Wilson score computes the 95% confidence interval lower bound, ensuring statistically robust solutions with 90 out of 100 outrank small volatile samples.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Scenario A */}
          <div className={`p-4 border ${boundA !== null && boundB !== null && boundA > boundB ? "border-[#0f62fe] bg-[#16223b]" : "border-[#2e2e2e] bg-[#1a1a1a]"}`}>
            <div className="flex items-center justify-between pb-2 border-b border-[#2e2e2e]">
              <span className="font-semibold text-sm text-white">Scenario A (Low Volume)</span>
              {boundA !== null && boundB !== null && boundA > boundB && (
                <span className="text-[#4589ff] font-bold">WINS RANKING</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 my-3">
              <div>
                <label className="block text-[11px] text-[#8d8d8d]">Worked Votes</label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={simAWorked}
                  onChange={(e) => setSimAWorked(Number(e.target.value) || 0)}
                  className="w-full p-2 bg-[#121212] border border-[#393939] text-sm tabular-nums text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#8d8d8d]">Failed Votes</label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={simAFailed}
                  onChange={(e) => setSimAFailed(Number(e.target.value) || 0)}
                  className="w-full p-2 bg-[#121212] border border-[#393939] text-sm tabular-nums text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[#2e2e2e]">
              <div className="flex justify-between">
                <span className="text-[#8d8d8d]">Naive Ratio:</span>
                <span className="font-semibold text-white">{rateA}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4589ff] font-semibold">Wilson 95% Bound:</span>
                <span className="font-bold text-[#4589ff] text-sm">
                  {boundA !== null ? `${(boundA * 100).toFixed(2)}%` : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Scenario B */}
          <div className={`p-4 border ${boundA !== null && boundB !== null && boundB > boundA ? "border-[#0f62fe] bg-[#16223b]" : "border-[#2e2e2e] bg-[#1a1a1a]"}`}>
            <div className="flex items-center justify-between pb-2 border-b border-[#2e2e2e]">
              <span className="font-semibold text-sm text-white">Scenario B (High Volume)</span>
              {boundB !== null && boundB > (boundA || 0) && (
                <span className="text-[#4589ff] font-bold">WINS RANKING</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 my-3">
              <div>
                <label className="block text-[11px] text-[#8d8d8d]">Worked Votes</label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={simBWorked}
                  onChange={(e) => setSimBWorked(Number(e.target.value) || 0)}
                  className="w-full p-2 bg-[#121212] border border-[#393939] text-sm tabular-nums text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#8d8d8d]">Failed Votes</label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={simBFailed}
                  onChange={(e) => setSimBFailed(Number(e.target.value) || 0)}
                  className="w-full p-2 bg-[#121212] border border-[#393939] text-sm tabular-nums text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[#2e2e2e]">
              <div className="flex justify-between">
                <span className="text-[#8d8d8d]">Naive Ratio:</span>
                <span className="font-semibold text-white">{rateB}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4589ff] font-semibold">Wilson 95% Bound:</span>
                <span className="font-bold text-[#4589ff] text-sm">
                  {boundB !== null ? `${(boundB * 100).toFixed(2)}%` : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
