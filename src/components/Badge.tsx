import React from "react";
import { SolutionLabel } from "../lib/ranking";

interface BadgeProps {
  label: SolutionLabel | string;
  source?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, className = "" }) => {
  if (label === "Community verified") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-mono font-medium tracking-wide text-[#38bdf8] ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] inline-block" />
        Community verified
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-mono font-medium tracking-wide text-[#f59e0b] ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] inline-block" />
      AI estimate
    </span>
  );
};
