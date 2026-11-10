import React, { useState } from "react";
import { Checkmark, Close, Renew } from "@carbon/icons-react";

interface VoteButtonsProps {
  solutionId: number;
  initialVote?: "worked" | "failed";
  onVote: (solutionId: number, outcome: "worked" | "failed") => Promise<{ db2_live: boolean } | void>;
  disabled?: boolean;
}

export const VoteButtons: React.FC<VoteButtonsProps> = ({
  solutionId,
  initialVote,
  onVote,
  disabled = false,
}) => {
  const [currentVote, setCurrentVote] = useState<"worked" | "failed" | undefined>(initialVote);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [db2Confirmed, setDb2Confirmed] = useState(false);

  const handleVote = async (outcome: "worked" | "failed") => {
    if (currentVote || isSubmitting || disabled) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    // Optimistic state
    setCurrentVote(outcome);

    try {
      const res = await onVote(solutionId, outcome);
      if (res && res.db2_live) {
        setDb2Confirmed(true);
      }
    } catch (err: any) {
      if (err?.message?.includes("Duplicate") || err?.message?.includes("already")) {
        setErrorMessage("Vote already logged for this solution in this session.");
      } else {
        setErrorMessage("Vote recorded in local session.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasVoted = Boolean(currentVote);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#393939]">
      <div className="text-xs font-mono text-[#c6c6c6]">
        {hasVoted ? (
          <span className="inline-flex items-center gap-1.5 text-white font-medium">
            <span className="w-1.5 h-1.5 bg-[#42be65] inline-block" />
            Your feedback:{" "}
            <span className={currentVote === "worked" ? "text-[#42be65] font-semibold" : "text-[#fa4d56] font-semibold"}>
              {currentVote === "worked" ? "CONFIRMED RESOLVED (YES)" : "DID NOT RESOLVE (NO)"}
            </span>{" "}
            <span className="text-[#8d8d8d] text-[11px]">
              {db2Confirmed ? "(Confirmed written to IBM Db2)" : "(Stored in local session)"}
            </span>
          </span>
        ) : (
          <span>Did this fix work?</span>
        )}
        {errorMessage && <span className="block text-[#fa4d56] text-[11px] mt-0.5">{errorMessage}</span>}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleVote("worked")}
          disabled={hasVoted || isSubmitting || disabled}
          aria-label="Yes, it worked"
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium transition-colors border cursor-pointer ${
            currentVote === "worked"
              ? "bg-[#0f62fe] text-white border-[#4589ff]"
              : hasVoted
              ? "bg-[#262626] text-[#6f6f6f] border-[#393939] cursor-not-allowed"
              : "bg-[#262626] text-white border-[#525252] hover:bg-[#0f62fe] hover:border-[#4589ff] active:bg-[#0043ce]"
          }`}
        >
          {isSubmitting && currentVote === "worked" ? (
            <Renew size={14} className="animate-spin" />
          ) : (
            <Checkmark size={14} className="text-[#42be65]" />
          )}
          <span>Yes</span>
        </button>

        <button
          type="button"
          onClick={() => handleVote("failed")}
          disabled={hasVoted || isSubmitting || disabled}
          aria-label="No, it did not work"
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium transition-colors border cursor-pointer ${
            currentVote === "failed"
              ? "bg-[#da1e28] text-white border-[#fa4d56]"
              : hasVoted
              ? "bg-[#262626] text-[#6f6f6f] border-[#393939] cursor-not-allowed"
              : "bg-[#262626] text-white border-[#525252] hover:bg-[#da1e28] hover:border-[#fa4d56] active:bg-[#ba1b23]"
          }`}
        >
          {isSubmitting && currentVote === "failed" ? (
            <Renew size={14} className="animate-spin" />
          ) : (
            <Close size={14} className="text-[#fa4d56]" />
          )}
          <span>No</span>
        </button>
      </div>
    </div>
  );
};
