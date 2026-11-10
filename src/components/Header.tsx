import React from "react";
import { Add } from "@carbon/icons-react";

export type TabKey = "troubleshoot" | "knowledgebase" | "stats" | "benchmark";

interface HeaderProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onOpenSubmitFix: () => void;
  onFocusSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenSubmitFix,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0c131a]/95 backdrop-blur-md border-b border-[#1d2d3e] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Left Side: Brand Title & Navigation Tabs matching r.png */}
        <div className="flex items-center gap-5 sm:gap-7">
          {/* Logo / Brand Name */}
          <button
            type="button"
            onClick={() => onTabChange("troubleshoot")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="text-xl font-bold tracking-tight text-white font-sans group-hover:text-[#70a5ff] transition-colors">
              Resolve AI
            </span>
          </button>

          {/* Navigation Tabs matching r.png: Search, Knowledge base, Analytics, Benchmark */}
          <nav className="flex items-center gap-1.5 sm:gap-2.5 text-sm font-sans">
            <button
              type="button"
              onClick={() => onTabChange("troubleshoot")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "troubleshoot"
                  ? "text-white font-semibold bg-[#162231]"
                  : "text-[#94a3b8] hover:text-white"
              }`}
            >
              Search
            </button>

            <button
              type="button"
              onClick={() => onTabChange("knowledgebase")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "knowledgebase"
                  ? "text-white font-semibold bg-[#162231]"
                  : "text-[#94a3b8] hover:text-white"
              }`}
            >
              Knowledge base
            </button>

            <button
              type="button"
              onClick={() => onTabChange("stats")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "stats"
                  ? "text-white font-semibold bg-[#162231]"
                  : "text-[#94a3b8] hover:text-white"
              }`}
            >
              Analytics
            </button>

            <button
              type="button"
              onClick={() => onTabChange("benchmark")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "benchmark"
                  ? "text-white font-semibold bg-[#162231]"
                  : "text-[#94a3b8] hover:text-white"
              }`}
            >
              Benchmark
            </button>
          </nav>
        </div>

        {/* Right Side: Status Indicators matching r.png + Submit Fix */}
        <div className="flex items-center gap-3 sm:gap-5 font-sans text-xs">
          {/* Status indicators exactly matching r.png */}
          <div className="hidden lg:flex items-center gap-4 text-[#94a3b8]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#42be65] inline-block" />
              <span>API online</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#42be65] inline-block" />
              <span>Db2 connected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#42be65] inline-block" />
              <span>Embeddings available</span>
            </div>
          </div>

          {/* Submit Fix Button */}
          <button
            type="button"
            onClick={onOpenSubmitFix}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#70a5ff] hover:bg-[#85b2ff] active:bg-[#5b95f0] text-[#0a1320] font-semibold rounded-lg transition-colors cursor-pointer text-xs"
          >
            <Add size={14} />
            <span>Submit Fix</span>
          </button>
        </div>
      </div>
    </header>
  );
};
