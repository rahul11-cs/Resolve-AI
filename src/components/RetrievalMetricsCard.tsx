import React from "react";
import { RetrievalMetrics } from "../api/client";
import { Time, DataBase, CheckmarkOutline, Flash } from "@carbon/icons-react";

interface RetrievalMetricsCardProps {
  metrics: RetrievalMetrics;
  matchedProblem: string;
  similarity: number;
}

export const RetrievalMetricsCard: React.FC<RetrievalMetricsCardProps> = ({
  metrics,
  matchedProblem,
  similarity,
}) => {
  const confidenceColor =
    metrics.confidence_level === "High"
      ? "text-[#42be65] border-[#42be65]/40 bg-[#42be65]/10"
      : metrics.confidence_level === "Medium"
      ? "text-[#f1c21b] border-[#f1c21b]/40 bg-[#f1c21b]/10"
      : "text-[#fa4d56] border-[#fa4d56]/40 bg-[#fa4d56]/10";

  return (
    <div className="bg-[#171717] border border-[#2e2e2e] p-4 text-xs font-mono shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2e2e2e] pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Flash size={16} className="text-[#0f62fe]" />
          <span className="font-semibold text-white tracking-wide uppercase text-[11px]">
            Retrieval Performance & Telemetry
          </span>
          {metrics.strategy_tag && (
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#0f62fe]/15 text-[#4589ff] border border-[#0f62fe]/30 uppercase">
              {metrics.strategy_tag}
            </span>
          )}
          <span className="text-[#8d8d8d] hidden sm:inline">·</span>
          <span className="text-[#c6c6c6] truncate max-w-xs hidden sm:inline">
            Signature: <span className="text-white font-medium">{matchedProblem}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#8d8d8d]">Semantic Score:</span>
          <span className="font-bold text-[#42be65] tabular-nums">
            {(similarity * 100).toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Matches Found */}
        <div className="bg-[#1f1f1f] p-3 border border-[#2e2e2e]">
          <span className="text-[#8d8d8d] block text-[10px] uppercase tracking-wider">
            Matches Found
          </span>
          <div className="flex items-center gap-2 mt-1">
            <CheckmarkOutline size={14} className="text-[#4589ff]" />
            <span className="text-lg font-bold text-white tabular-nums">
              {metrics.matches_found}
            </span>
          </div>
        </div>

        {/* Search Time / Latency */}
        <div className="bg-[#1f1f1f] p-3 border border-[#2e2e2e]">
          <span className="text-[#8d8d8d] block text-[10px] uppercase tracking-wider">
            Search Time
          </span>
          <div className="flex items-center gap-2 mt-1">
            <Time size={14} className="text-[#f1c21b]" />
            <span className="text-lg font-bold text-white tabular-nums">
              {metrics.search_latency_ms}ms
            </span>
          </div>
        </div>

        {/* Vector Store */}
        <div className="bg-[#1f1f1f] p-3 border border-[#2e2e2e]">
          <span className="text-[#8d8d8d] block text-[10px] uppercase tracking-wider">
            Vector Store
          </span>
          <div className="flex items-center gap-2 mt-1">
            <DataBase size={14} className="text-[#42be65]" />
            <span className="text-xs font-semibold text-white truncate" title={metrics.vector_store}>
              IBM Db2 (DB2VS)
            </span>
          </div>
        </div>

        {/* Confidence Tier */}
        <div className="bg-[#1f1f1f] p-3 border border-[#2e2e2e]">
          <span className="text-[#8d8d8d] block text-[10px] uppercase tracking-wider">
            Vector Confidence
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 text-xs font-bold border ${confidenceColor}`}>
              {metrics.confidence_level}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
