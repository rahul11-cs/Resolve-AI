import React, { useState } from "react";
import {
  Copy,
  Checkmark,
  Warning,
  Document,
  Flag,
} from "@carbon/icons-react";
import { SuccessBar } from "./SuccessBar";
import { SolutionResponseItem } from "../api/client";

interface SolutionCardProps {
  solution: SolutionResponseItem;
  rank: number;
  onVote: (solutionId: number, outcome: "worked" | "failed") => Promise<{ db2_live: boolean } | void>;
  onSelectSimilarIssue?: (issueQuery: string) => void;
}

export const SolutionCard: React.FC<SolutionCardProps> = ({
  solution,
  rank,
  onVote,
  onSelectSimilarIssue,
}) => {
  const [copiedAction, setCopiedAction] = useState<string | null>(null);
  const [showDangerConfirm, setShowDangerConfirm] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [userVoteState, setUserVoteState] = useState<"worked" | "failed" | undefined>(solution.userVote);
  const [isReported, setIsReported] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleCopy = () => {
    if (solution.has_dangerous_commands && !showDangerConfirm) {
      setShowDangerConfirm(true);
      return;
    }
    navigator.clipboard.writeText(solution.steps);
    setCopiedAction("copied");
    setTimeout(() => setCopiedAction(null), 2000);
    setShowDangerConfirm(false);
  };

  const handleVoteClick = async (outcome: "worked" | "failed") => {
    if (isVoting) return;
    setIsVoting(true);
    setUserVoteState(outcome);
    try {
      await onVote(solution.solution_id, outcome);
    } catch (err) {
      console.error("Voting error:", err);
    } finally {
      setIsVoting(false);
    }
  };

  // Format steps into clean numbered rows if not already formatted
  const formattedSteps = solution.steps
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  // Construct matched reason string matching template
  const matchedTermsString =
    solution.explanation?.bulletItems && solution.explanation.bulletItems.length > 0
      ? solution.explanation.bulletItems.map((b) => b.text).join(", ")
      : `${solution.category}, evidence-ranked`;

  return (
    <article className="bg-[#0e1722] border border-[#1d2d3e] hover:border-[#2b3e55] rounded-xl p-5 sm:p-6 transition-all duration-200 shadow-lg">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
        {/* Left Side: Rank Number + Main Fix Content */}
        <div className="flex items-start gap-4 sm:gap-6 flex-1 w-full">
          {/* Large Rank Number matching r.png */}
          <div className="text-4xl sm:text-5xl font-bold text-[#4595f5] shrink-0 w-8 sm:w-10 text-center select-none pt-0.5">
            {rank}
          </div>

          {/* Core Solution Body */}
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight font-sans">
                {solution.title}
              </h2>
              <div className="text-xs sm:text-sm text-[#94a3b8] mt-1 capitalize font-sans">
                {solution.category}, {solution.category === "docker" ? "service availability" : "resolution"}
              </div>

              {/* Matched Because Strip matching r.png */}
              <div className="text-xs text-[#94a3b8] mt-2 font-mono">
                <span>Matched because: </span>
                <span className="font-semibold text-[#cbd5e1]">{matchedTermsString}</span>
              </div>
            </div>

            {/* Dangerous Command Safety Alert */}
            {solution.has_dangerous_commands && (
              <div className="flex items-center gap-2 p-2.5 bg-[#2d1215] border border-[#fa4d56]/40 rounded-lg text-xs text-[#ffb3b8]">
                <Warning size={15} className="text-[#fa4d56] shrink-0" />
                <span>
                  <strong>Safety Review:</strong> Solution contains system changes. Confirm before executing.
                </span>
              </div>
            )}

            {/* Danger Confirmation Modal */}
            {showDangerConfirm && (
              <div className="p-3 bg-[#162231] border border-[#fa4d56] rounded-lg text-xs space-y-2">
                <span className="text-white block font-medium">
                  Copy commands to clipboard?
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(solution.steps);
                      setCopiedAction("copied");
                      setTimeout(() => setCopiedAction(null), 2000);
                      setShowDangerConfirm(false);
                    }}
                    className="px-3 py-1 bg-[#da1e28] hover:bg-[#ba1b23] text-white text-xs font-semibold rounded"
                  >
                    Yes, Copy
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDangerConfirm(false)}
                    className="px-3 py-1 bg-[#090e14] text-[#94a3b8] text-xs rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Code Block Container matching r.png */}
            <div className="relative group bg-[#090e14] border border-[#162231] rounded-lg p-4 font-mono text-xs text-[#cbd5e1] leading-relaxed my-3">
              <button
                type="button"
                onClick={handleCopy}
                className="absolute right-2.5 top-2.5 p-1.5 text-[#94a3b8] hover:text-white bg-[#131f2d] hover:bg-[#1a2d42] border border-[#22364c] rounded transition-colors cursor-pointer"
                title="Copy resolution steps to clipboard"
              >
                {copiedAction === "copied" ? (
                  <Checkmark size={14} className="text-[#42be65]" />
                ) : (
                  <Copy size={14} />
                )}
              </button>

              <div className="space-y-1.5 overflow-x-auto pr-10">
                {formattedSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-[#64748b] select-none font-medium">
                      {step.startsWith(`${idx + 1}.`) ? "" : `${idx + 1}.`}
                    </span>
                    <span className="text-[#e2e8f0] font-mono whitespace-pre-wrap">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback / Voting Section matching r.png */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs text-[#94a3b8] font-sans font-medium">
                Did this fix work?
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isVoting}
                  onClick={() => handleVoteClick("worked")}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                    userVoteState === "worked"
                      ? "bg-[#103823] border-[#24a148] text-[#42be65]"
                      : "bg-[#131f2d] hover:bg-[#1a2d42] border-[#22364c] text-white"
                  }`}
                >
                  Yes, it worked
                </button>

                <button
                  type="button"
                  disabled={isVoting}
                  onClick={() => handleVoteClick("failed")}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                    userVoteState === "failed"
                      ? "bg-[#381418] border-[#da1e28] text-[#ff8389]"
                      : "bg-[#131f2d] hover:bg-[#1a2d42] border-[#22364c] text-white"
                  }`}
                >
                  No, it did not
                </button>
              </div>

              {/* Discreet report affordance */}
              <button
                type="button"
                onClick={() => setShowReportModal(true)}
                disabled={isReported}
                className="ml-auto text-[11px] text-[#64748b] hover:text-[#94a3b8] transition-colors cursor-pointer"
                title="Report incorrect fix"
              >
                {isReported ? "Reported" : "Report"}
              </button>
            </div>

            {/* Report confirmation dialog */}
            {showReportModal && (
              <div className="p-3 bg-[#131f2d] border border-[#22364c] rounded-lg text-xs space-y-2 mt-2">
                <span className="text-white block font-medium">
                  Flag this resolution for verification review?
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsReported(true);
                      setShowReportModal(false);
                    }}
                    className="px-3 py-1 bg-[#fa4d56] text-white text-xs font-semibold rounded"
                  >
                    Confirm Flag
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-3 py-1 bg-[#090e14] text-[#94a3b8] text-xs rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Evidence-Ranked Metrics Column matching r.png */}
        <div className="w-full lg:w-64 shrink-0 lg:border-l lg:border-[#1d2d3e] lg:pl-6 pt-4 lg:pt-0 border-t border-[#1d2d3e] lg:border-t-0">
          <SuccessBar
            worked={solution.worked}
            failed={solution.failed}
            totalVotes={solution.totalVotes}
            userVotes={solution.userVotes}
            successRate={solution.successRate}
            wilsonLowerBound={solution.wilsonLowerBound}
            label={solution.label}
          />
        </div>
      </div>
    </article>
  );
};
