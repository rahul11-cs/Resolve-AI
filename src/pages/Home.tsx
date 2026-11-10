import React, { useState, useEffect } from "react";
import { ProblemForm } from "../components/ProblemForm";
import { SolutionCard } from "../components/SolutionCard";
import { CodeAnalysisCard } from "../components/CodeAnalysisCard";
import { solveProblem, submitFeedback, SolveResult } from "../api/client";
import {
  Renew,
  MisuseOutline,
  CheckmarkOutline,
  Add,
  Flash,
  DataBase,
  Security,
} from "@carbon/icons-react";

interface HomeProps {
  onRefreshStats?: () => void;
  onOpenSubmitFix: () => void;
  searchInputRef?: React.RefObject<HTMLTextAreaElement | null>;
  initialQueryOverride?: string | null;
}

const SMART_SUGGESTIONS = [
  { label: "docker engine not running", query: "docker engine not running" },
  { label: "cannot connect to docker service", query: "Cannot connect to the Docker service at unix:///var/run/docker.sock" },
  { label: "port 3000 already in use", query: "Error: listen EADDRINUSE: address already in use :::3000" },
  { label: "SQL30082N Db2 login failed", query: "SQL30082N Security processing failed with reason AUTHENTICATION" },
  { label: "pip requests missing", query: "ModuleNotFoundError: No module named 'requests'" },
];

export const Home: React.FC<HomeProps> = ({
  onRefreshStats,
  onOpenSubmitFix,
  searchInputRef,
  initialQueryOverride,
}) => {
  const [activeQuery, setActiveQuery] = useState(
    initialQueryOverride || "docker engine not running"
  );
  const [currentOs, setCurrentOs] = useState("all");
  const [result, setResult] = useState<SolveResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeSearch = async (targetQuery: string, userOs = "all") => {
    setIsLoading(true);
    setError(null);
    setActiveQuery(targetQuery);
    setCurrentOs(userOs);

    try {
      const data = await solveProblem(targetQuery, userOs);
      setResult(data);
    } catch (err: any) {
      setError(err?.message || "Failed to query vector knowledge base.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQueryOverride) {
      executeSearch(initialQueryOverride, currentOs);
    } else {
      executeSearch(activeQuery, currentOs);
    }
  }, [initialQueryOverride]);

  const handleVote = async (solutionId: number, outcome: "worked" | "failed") => {
    const res = await submitFeedback(solutionId, outcome, currentOs);
    if (result) {
      const updated = await solveProblem(result.query, currentOs);
      setResult(updated);
    }
    if (onRefreshStats) onRefreshStats();
    return res;
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Search Input Box & Live Metadata Row matching r.png */}
      <ProblemForm
        onSubmit={executeSearch}
        isLoading={isLoading}
        activeQuery={activeQuery}
        searchInputRef={searchInputRef}
        totalFixesCount={result?.solutions?.length || 5}
      />

      {/* Intelligent Code Bug Extraction Card (if code pasted) */}
      {result && result.detected_bugs && result.detected_bugs.length > 0 && (
        <CodeAnalysisCard
          bugs={result.detected_bugs}
          onDiagnose={(bugQuery) => executeSearch(bugQuery, currentOs)}
        />
      )}

      {/* Redaction Notice */}
      {result && result.had_redactions && (
        <div className="p-3 bg-[#112416] border border-[#24a148] rounded-lg text-xs text-[#6fdc8c] flex items-center gap-2 font-mono">
          <CheckmarkOutline size={15} className="text-[#42be65] shrink-0" />
          <span>
            Client Privacy Scrub: Redacted {result.redacted_types.join(", ")} prior to vector processing.
          </span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-[#2d0709] border border-[#da1e28] rounded-lg text-xs text-[#ffb3b8] font-mono">
          <strong className="text-[#ff8389]">Search Exception:</strong> {error}
        </div>
      )}

      {/* Results Section */}
      <div className="space-y-4 pt-2">
        {isLoading ? (
          <div className="p-12 bg-[#0e1722] border border-[#1d2d3e] rounded-xl text-center space-y-3 font-mono">
            <Renew size={28} className="animate-spin text-[#4595f5] mx-auto" />
            <div className="text-sm font-semibold text-white">
              Querying IBM Db2 Vector Store & Computing Wilson Lower Bounds...
            </div>
            <div className="text-xs text-[#94a3b8]">
              Evaluating vector embeddings across developer troubleshooting clusters
            </div>
          </div>
        ) : result && result.no_match ? (
          /* Empty State */
          <div className="p-8 bg-[#0e1722] border border-[#1d2d3e] rounded-xl text-left space-y-5 font-mono">
            <div className="flex items-start gap-4">
              <MisuseOutline size={32} className="text-[#fa4d56] shrink-0 mt-1" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white font-sans">
                  No verified community fixes found for this error.
                </h3>
                <p className="text-xs text-[#94a3b8]">
                  Similarity score ({((result.similarity || 0) * 100).toFixed(1)}%) is below the minimum threshold (55.0%).
                </p>
              </div>
            </div>

            {/* Smart Suggestions Chips */}
            <div className="bg-[#090e14] p-4 rounded-lg border border-[#162231] space-y-2.5 text-xs">
              <span className="font-semibold text-white uppercase tracking-wider text-[11px] block">
                Suggested verified queries:
              </span>
              <div className="flex flex-wrap gap-2">
                {SMART_SUGGESTIONS.map((sug) => (
                  <button
                    key={sug.label}
                    type="button"
                    onClick={() => executeSearch(sug.query, currentOs)}
                    className="px-3 py-1.5 bg-[#101923] hover:bg-[#162231] border border-[#1e2f42] hover:border-[#3b82f6] text-[#cbd5e1] hover:text-white rounded transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="text-[#3b82f6]">→</span>
                    <span>{sug.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#94a3b8]">
                Know the fix for this issue? Submit it to the community index.
              </span>
              <button
                type="button"
                onClick={onOpenSubmitFix}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#70a5ff] hover:bg-[#85b2ff] text-[#0a1320] text-xs font-semibold rounded-lg cursor-pointer"
              >
                <Add size={14} />
                <span>Submit Fix for this Error</span>
              </button>
            </div>
          </div>
        ) : result && result.solutions.length > 0 ? (
          <div className="space-y-4">
            {/* Header matching r.png: "X fixes, ranked by evidence" */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
              {result.solutions.length} fixes, ranked by evidence
            </h2>

            {/* Ranked Solution Cards matching r.png */}
            <div className="space-y-4">
              {result.solutions.map((sol, index) => (
                <SolutionCard
                  key={sol.solution_id}
                  solution={sol}
                  rank={index + 1}
                  onVote={handleVote}
                  onSelectSimilarIssue={(issueQuery) => executeSearch(issueQuery, currentOs)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Feature Highlights Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
        <div className="p-4 bg-[#0e1722] border border-[#1d2d3e] rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <Flash size={16} className="text-[#3b82f6]" />
            <span>Semantic Vector Retrieval</span>
          </div>
          <p className="text-[#94a3b8] text-xs leading-relaxed font-sans">
            Finds fixes by conceptual equivalence, not fragile keywords. &quot;docker stopped&quot; accurately resolves to &quot;service not running&quot;.
          </p>
        </div>

        <div className="p-4 bg-[#0e1722] border border-[#1d2d3e] rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <DataBase size={16} className="text-[#42be65]" />
            <span>Wilson Confidence Scoring</span>
          </div>
          <p className="text-[#94a3b8] text-xs leading-relaxed font-sans">
            Eliminates cold-start anomalies. Statistically proves 23 of 26 community-verified resolutions outrank volatile 1 of 1 samples.
          </p>
        </div>

        <div className="p-4 bg-[#0e1722] border border-[#1d2d3e] rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <Security size={16} className="text-[#fa4d56]" />
            <span>Destructive Command Guardrail</span>
          </div>
          <p className="text-[#94a3b8] text-xs leading-relaxed font-sans">
            Audits solutions for destructive shell operations (<code>rm -rf</code>, <code>chmod 777</code>) with confirmation checks.
          </p>
        </div>
      </div>
    </div>
  );
};
