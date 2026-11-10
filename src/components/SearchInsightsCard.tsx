import React from "react";
import { SearchInsights, ExtractedErrorCode } from "../lib/intelligence";
import { Flash, CheckmarkOutline, Terminal, Information } from "@carbon/icons-react";

interface SearchInsightsCardProps {
  insights: SearchInsights;
  extractedCode?: ExtractedErrorCode | null;
}

export const SearchInsightsCard: React.FC<SearchInsightsCardProps> = ({
  insights,
  extractedCode,
}) => {
  return (
    <div className="bg-[#161616] border border-[#2e2e2e] p-4 text-xs font-mono space-y-3 shadow-md">
      {/* Top Banner: Extracted Error Code if available */}
      {extractedCode && (
        <div className="p-2.5 bg-[#122338] border border-[#0f62fe] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Terminal size={15} className="text-[#0f62fe] shrink-0" />
            <span className="text-[#8d8d8d]">Detected Signature:</span>
            <span className="font-bold text-white px-2 py-0.5 bg-[#171717] border border-[#393939]">
              Error Code: <strong className="text-[#4589ff]">{extractedCode.errorCode}</strong>
            </span>
            <span className="text-[#8d8d8d]">·</span>
            <span className="text-[#c6c6c6]">Product: <strong className="text-white">{extractedCode.product}</strong></span>
            <span className="text-[#8d8d8d]">·</span>
            <span className="text-[#c6c6c6]">Category: <strong className="text-white">{extractedCode.category}</strong></span>
          </div>
          <span className="text-[10px] uppercase font-semibold text-[#42be65] bg-[#42be65]/10 px-2 py-0.5 border border-[#42be65]/30">
            High-Precision Deterministic Index
          </span>
        </div>
      )}

      {/* Main Grid: Insights Metric Boxes */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#262626] pb-2">
        <div className="flex items-center gap-2 text-white font-semibold text-[11px] uppercase tracking-wider">
          <Flash size={14} className="text-[#0f62fe]" />
          <span>Resolve AI Search Insights & Categorization</span>
        </div>
        <span className="text-[11px] text-[#8d8d8d]">
          Semantic Intent: <strong className="text-white">{insights.detectedIntent}</strong>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {/* Detected Technology */}
        <div className="bg-[#1a1a1a] p-2.5 border border-[#2e2e2e]">
          <span className="text-[10px] text-[#8d8d8d] uppercase tracking-wider block">
            Detected Technology
          </span>
          <span className="font-bold text-white text-sm mt-0.5 block">
            {insights.detectedTechnology}
          </span>
        </div>

        {/* Detected Error Type */}
        <div className="bg-[#1a1a1a] p-2.5 border border-[#2e2e2e]">
          <span className="text-[10px] text-[#8d8d8d] uppercase tracking-wider block">
            Detected Error Type
          </span>
          <span className="font-medium text-[#c6c6c6] text-xs mt-0.5 block truncate" title={insights.detectedErrorType}>
            {insights.detectedErrorType}
          </span>
        </div>

        {/* Query Quality */}
        <div className="bg-[#1a1a1a] p-2.5 border border-[#2e2e2e]">
          <span className="text-[10px] text-[#8d8d8d] uppercase tracking-wider block">
            Query Quality
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#42be65]" />
            <span className="font-semibold text-white text-xs">
              {insights.queryQuality}
            </span>
          </div>
        </div>

        {/* Confidence */}
        <div className="bg-[#1a1a1a] p-2.5 border border-[#2e2e2e]">
          <span className="text-[10px] text-[#8d8d8d] uppercase tracking-wider block">
            Retrieval Confidence
          </span>
          <span className="font-bold text-[#42be65] text-sm mt-0.5 block">
            {insights.confidencePercent}%
          </span>
        </div>
      </div>

      {/* Detected Token Highlights */}
      {insights.detectedTerms.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#8d8d8d]">
          <span>Detected Terms:</span>
          {insights.detectedTerms.map((term) => (
            <span key={term} className="px-1.5 py-0.5 bg-[#222222] border border-[#333333] text-[#c6c6c6]">
              {term}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
