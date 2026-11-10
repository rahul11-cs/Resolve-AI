import React from "react";
import { SolutionLabel } from "../lib/ranking";

interface SuccessBarProps {
  worked: number;
  failed: number;
  totalVotes: number;
  userVotes: number;
  communityVotes?: number;
  successRate: number;
  wilsonLowerBound: number | null;
  label: SolutionLabel | string;
  className?: string;
}

export const SuccessBar: React.FC<SuccessBarProps> = ({
  worked,
  totalVotes,
  userVotes,
  successRate,
  wilsonLowerBound,
  label,
  className = "",
}) => {
  const isVerified = label === "Community verified" || totalVotes >= 5;
  const floorPercent = wilsonLowerBound !== null ? Math.round(wilsonLowerBound * 100) : 0;
  const seenPercent = Math.round(successRate);

  return (
    <div className={`space-y-2.5 font-sans ${className}`}>
      {/* Top Status & Headline */}
      <div>
        <div className={`text-xs font-mono font-medium ${isVerified ? "text-[#38bdf8]" : "text-[#f59e0b]"}`}>
          {isVerified ? "Community verified" : "AI estimate"}
        </div>
        <div className="text-sm font-semibold text-white mt-0.5">
          {totalVotes > 0 ? (
            <span>
              Worked for <span className="text-white">{worked}</span> of{" "}
              <span>{totalVotes}</span> engineers
            </span>
          ) : (
            <span className="text-[#e2e8f0]">No votes yet</span>
          )}
        </div>
      </div>

      {/* Confidence Range Bar */}
      {totalVotes > 0 ? (
        <div className="space-y-1.5 pt-1">
          <div className="relative h-2 w-full bg-[#1b2938] rounded-full overflow-hidden">
            {/* The shaded range represents the 95% confidence interval */}
            <div
              className="absolute top-0 bottom-0 bg-[#4f8ef7] rounded-full transition-all duration-300"
              style={{
                left: `${Math.max(0, Math.min(95, floorPercent))}%`,
                width: `${Math.max(8, Math.min(100 - floorPercent, seenPercent - floorPercent + 10))}%`,
              }}
            />
            {/* Right seen marker */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white rounded-full"
              style={{
                left: `${Math.max(0, Math.min(98, seenPercent))}%`,
              }}
            />
          </div>

          {/* Floor & Seen labels matching r.png */}
          <div className="flex items-center justify-between text-[11px] font-mono text-[#94a3b8]">
            <span>Floor {floorPercent}%</span>
            <span>Seen {seenPercent}%</span>
          </div>

          <p className="text-[11px] text-[#94a3b8] font-sans leading-tight">
            The bar is the 95% confidence range. The floor sets the rank.
          </p>

          <p className="text-[11px] text-[#64748b] font-sans pt-0.5">
            Created May 2026. Last verified Nov 2026.
          </p>
        </div>
      ) : (
        <div className="space-y-1.5 pt-1">
          {/* Dashed placeholder bar matching r.png */}
          <div className="h-1.5 w-full border-t border-dashed border-[#2b3a4a] my-2" />
          <p className="text-[11px] text-[#94a3b8] font-sans leading-tight">
            Needs 5 votes before a success rate is shown.
          </p>
        </div>
      )}
    </div>
  );
};
