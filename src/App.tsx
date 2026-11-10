/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { Terminal } from "@carbon/icons-react";
import { Header, TabKey } from "./components/Header";
import { Home } from "./pages/Home";
import { KnowledgeBase } from "./pages/KnowledgeBase";
import { Stats } from "./pages/Stats";
import { Benchmark } from "./pages/Benchmark";
import { SubmitFixModal } from "./components/SubmitFixModal";
import { ApiConfigBanner } from "./components/ApiConfigBanner";
import { LangChainChatModal } from "./components/LangChainChatModal";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("troubleshoot");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedInitialQuery, setSelectedInitialQuery] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLTextAreaElement | null>(null);

  const handleFocusSearch = () => {
    if (activeTab !== "troubleshoot") {
      setActiveTab("troubleshoot");
    }
    setTimeout(() => {
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    }, 50);
  };

  const handleFixSubmitted = () => {
    setRefreshKey((k) => k + 1);
  };

  const handleSelectFromKnowledgeBase = (query: string) => {
    setSelectedInitialQuery(query);
    setActiveTab("troubleshoot");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1016] text-white selection:bg-[#38bdf8] selection:text-black font-sans">
      {/* Top Header matching r.png */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSubmitFix={() => setIsSubmitModalOpen(true)}
        onFocusSearch={handleFocusSearch}
      />

      {/* Production Configuration Warning Banner (visible only if VITE_API_URL missing in production) */}
      <ApiConfigBanner />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {activeTab === "troubleshoot" && (
          <Home
            key={`home_${refreshKey}`}
            initialQueryOverride={selectedInitialQuery}
            onRefreshStats={() => setRefreshKey((k) => k + 1)}
            onOpenSubmitFix={() => setIsSubmitModalOpen(true)}
            searchInputRef={searchInputRef}
          />
        )}
        {activeTab === "knowledgebase" && (
          <KnowledgeBase onSelectProblem={handleSelectFromKnowledgeBase} />
        )}
        {activeTab === "stats" && <Stats key={`stats_${refreshKey}`} />}
        {activeTab === "benchmark" && <Benchmark />}
      </main>

      {/* Submit Community Fix Modal */}
      <SubmitFixModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onFixSubmitted={handleFixSubmitted}
      />

      {/* Floating Bottom-Right AI Assistant Launcher Box */}
      {!isAssistantOpen && (
        <button
          type="button"
          onClick={() => setIsAssistantOpen(true)}
          aria-label="Open AI Assistant"
          title="Open Resolve AI Assistant"
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-[#0e1722]/95 hover:bg-[#162231] border border-[#38bdf8]/45 hover:border-[#38bdf8] text-white shadow-2xl shadow-black/60 backdrop-blur-md transition-all cursor-pointer group"
        >
          <span className="w-8 h-8 rounded-xl bg-[#162231] group-hover:bg-[#1e2f42] border border-[#38bdf8]/40 flex items-center justify-center text-[#38bdf8]">
            <Terminal size={17} />
          </span>
          <span className="text-left pr-1">
            <span className="block text-xs font-semibold text-white leading-tight">
              AI Assistant
            </span>
            <span className="block text-[10px] font-mono text-[#38bdf8] leading-tight">
              LangChain RAG
            </span>
          </span>
        </button>
      )}

      {/* Floating Bottom-Right AI Assistant Panel */}
      <LangChainChatModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      {/* Production Footer */}
      <footer className="bg-[#080d14] text-[#94a3b8] border-t border-[#1d2d3e] py-8 px-4 sm:px-8 text-xs font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-white font-bold tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#38bdf8] inline-block" />
              Resolve AI
            </span>
            <span>·</span>
            <span>Empirical Evidence-Ranked Developer Troubleshooting</span>
            <span>·</span>
            <span>Hosted at resolve-ai.vercel.app</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[#94a3b8]">
            <span>Cloud Architecture:</span>
            <span className="text-[#cbd5e1]">IBM Db2 on Cloud</span>
            <span>·</span>
            <span className="text-[#cbd5e1]">IBM Granite Embeddings</span>
            <span>·</span>
            <span className="text-[#cbd5e1]">Wilson Confidence Ranking</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
