import React, { useState, useEffect, useRef } from "react";
import { Renew, Code } from "@carbon/icons-react";
import { isSourceCode } from "../lib/codeAnalyzer";
import { detectTechnologyAndErrorType, extractErrorCodeSignature } from "../lib/intelligence";

interface ProblemFormProps {
  onSubmit: (query: string, userOs: string) => void;
  isLoading: boolean;
  activeQuery?: string;
  searchInputRef?: React.RefObject<HTMLTextAreaElement | null>;
  totalFixesCount?: number;
}

const SAMPLE_BUGGY_CODE = `import os
import requests
from flask import Flask

app = Flask(__name__)
db_password = os.environ['DB2_PASSWORD']

@app.route('/health')
def health():
    return {'status': 'ok'}

if __name__ == '__main__':
    app.run(port=5000)`;

const SUGGESTIONS = [
  { label: "docker engine not running", query: "docker engine not running" },
  { label: "port 3000 in use", query: "Error: listen EADDRINUSE: address already in use :::3000" },
  { label: "db2 login failed", query: "SQL30082N Security processing failed with reason AUTHENTICATION" },
  { label: "requests module missing", query: "ModuleNotFoundError: No module named 'requests'" },
];

export const ProblemForm: React.FC<ProblemFormProps> = ({
  onSubmit,
  isLoading,
  activeQuery,
  searchInputRef,
  totalFixesCount = 5,
}) => {
  const [query, setQuery] = useState(activeQuery || "docker engine not running");
  const [selectedOs, setSelectedOs] = useState<string>("all");
  const internalRef = useRef<HTMLTextAreaElement | null>(null);
  const targetRef = searchInputRef || internalRef;
  const prevActiveQueryRef = useRef(activeQuery);

  const isCodeDetected = isSourceCode(query);

  useEffect(() => {
    if (activeQuery !== undefined && activeQuery !== prevActiveQueryRef.current) {
      prevActiveQueryRef.current = activeQuery;
      setQuery(activeQuery);
    }
  }, [activeQuery]);

  // Global Ctrl+K / Cmd+K handler
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        targetRef.current?.focus();
        targetRef.current?.select();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [targetRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    prevActiveQueryRef.current = query.trim();
    onSubmit(query.trim(), selectedOs);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Derive live metadata matching template
  const techInfo = detectTechnologyAndErrorType(query);
  const errorCodeInfo = extractErrorCodeSignature(query);
  const words = query.trim().split(/\s+/).filter((w) => w.length > 2);
  const queryQuality = query.length > 30 && words.length >= 4 ? "High" : words.length >= 2 ? "High" : "Moderate";
  const confidencePercent = Math.min(96, Math.max(74, Math.round((techInfo.confidence || 0.74) * 100)));

  return (
    <div className="space-y-4">
      {/* Search Input Card matching r.png */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block text-xs sm:text-sm font-sans text-[#94a3b8]">
          Paste the error you are seeing
        </label>

        {/* Prompt Input Container matching r.png */}
        <div className="bg-[#101923] border border-[#1e2f42] focus-within:border-[#3b82f6] rounded-xl p-2 sm:p-2.5 flex items-center gap-3 transition-colors shadow-lg">
          {/* Blue Prompt Symbol '>' */}
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#3b82f6] pl-2 select-none shrink-0">
            &gt;
          </div>

          {/* Text input / expandable area */}
          <textarea
            ref={targetRef}
            rows={isCodeDetected ? 6 : 1}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            placeholder="docker engine not running..."
            className="flex-1 bg-transparent text-white font-mono text-sm sm:text-base focus:outline-none placeholder:text-[#475569] resize-none leading-relaxed py-1.5"
            required
          />

          {/* Action button matching r.png: solid light blue with dark text */}
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className={`px-5 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold tracking-wide transition-all shrink-0 cursor-pointer ${
              !query.trim() || isLoading
                ? "bg-[#1f2d3d] text-[#64748b] cursor-not-allowed"
                : "bg-[#70a5ff] hover:bg-[#85b2ff] active:bg-[#5b95f0] text-[#0a1320]"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Renew size={14} className="animate-spin" />
                <span>Searching...</span>
              </span>
            ) : (
              "Find fixes"
            )}
          </button>
        </div>

        {/* Live Sub-bar Metadata Row matching r.png */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs text-[#94a3b8] font-sans px-1 pt-0.5">
          <div>
            Technology <strong className="text-white font-semibold ml-1">{techInfo.technology}</strong>
          </div>
          <div>
            Error type <strong className="text-white font-semibold ml-1">{techInfo.errorType}</strong>
          </div>
          <div>
            Error code <strong className="text-white font-semibold ml-1">{errorCodeInfo ? errorCodeInfo.errorCode : "none found"}</strong>
          </div>
          <div>
            Query quality <strong className="text-white font-semibold ml-1">{queryQuality}</strong>
          </div>
          <div>
            Confidence <strong className="text-white font-semibold ml-1">{confidencePercent}%</strong>
          </div>
        </div>
      </form>

      {/* Quick Suggestions & Code Mode Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#162231] text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[#64748b] text-[11px]">Quick Samples:</span>
          {SUGGESTIONS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setQuery(item.query);
                prevActiveQueryRef.current = item.query;
                onSubmit(item.query, selectedOs);
              }}
              className="px-2.5 py-1 bg-[#101923] hover:bg-[#162231] border border-[#1e2f42] hover:border-[#3b82f6] text-[#94a3b8] hover:text-white rounded text-[11px] transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setQuery(SAMPLE_BUGGY_CODE);
              prevActiveQueryRef.current = SAMPLE_BUGGY_CODE;
              onSubmit(SAMPLE_BUGGY_CODE, selectedOs);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] bg-[#101923] border border-[#3b82f6]/40 text-[#60a5fa] hover:bg-[#3b82f6] hover:text-[#0a1320] rounded transition-colors cursor-pointer"
          >
            <Code size={12} />
            <span>Paste Buggy Code</span>
          </button>
        </div>
      </div>
    </div>
  );
};
