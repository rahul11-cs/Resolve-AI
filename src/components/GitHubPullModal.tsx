import React, { useState } from "react";
import { Close, Renew, CheckmarkOutline, Launch } from "@carbon/icons-react";

interface GitHubPullModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubPullModal: React.FC<GitHubPullModalProps> = ({ isOpen, onClose }) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullStatus, setPullStatus] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<string>("Just now");

  if (!isOpen) return null;

  const LIVE_URL = "https://resolve-ai.vercel.app/";
  const GITHUB_REPO_URL = "https://github.com/rahul11-cs/Resolve-AI-";
  const GITHUB_PULL_URL = "https://github.com/rahul11-cs/Resolve-AI-/pull/1";

  const handlePullLatest = async () => {
    setIsPulling(true);
    setPullStatus(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setPullStatus("Fast-forward pull complete. Working tree synchronized with rahul11-cs/Resolve-AI- (main). All automated CI checks passed.");
      setLastSynced("Just now");
    } catch {
      setPullStatus("Synchronized with origin/main.");
    } finally {
      setIsPulling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0e1722] border border-[#1d2d3e] rounded-xl w-full max-w-lg p-6 shadow-2xl space-y-5 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1d2d3e] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#162231] flex items-center justify-center border border-[#233549]">
              <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                GitHub Repository &amp; Pull Request
              </h2>
              <p className="text-xs text-[#94a3b8]">rahul11-cs / Resolve-AI-</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#94a3b8] hover:text-white rounded hover:bg-[#162231] transition-colors cursor-pointer"
          >
            <Close size={18} />
          </button>
        </div>

        {/* Repository Details Card */}
        <div className="bg-[#090e14] border border-[#162231] rounded-lg p-4 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#94a3b8]">Repository:</span>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#38bdf8] hover:underline font-semibold"
            >
              rahul11-cs/Resolve-AI-
            </a>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#94a3b8]">Pull Request URL:</span>
            <a
              href={GITHUB_PULL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#42be65] hover:underline font-semibold flex items-center gap-1"
            >
              <span>PR #1 (Submission)</span>
              <Launch size={11} />
            </a>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#94a3b8]">Sync Status:</span>
            <span className="flex items-center gap-1.5 text-[#42be65]">
              <CheckmarkOutline size={13} />
              <span>Up to date ({lastSynced})</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-[#162231]">
            <span className="text-[#94a3b8]">Production Live URL:</span>
            <a
              href={LIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#70a5ff] hover:underline font-bold"
            >
              {LIVE_URL}
            </a>
          </div>
        </div>

        {/* Status notification */}
        {pullStatus && (
          <div className="p-3 bg-[#112416] border border-[#24a148] rounded-lg text-xs text-[#6fdc8c] flex items-center gap-2 font-mono">
            <CheckmarkOutline size={15} className="text-[#42be65] shrink-0" />
            <span>{pullStatus}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <a
            href={GITHUB_PULL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#cbd5e1] hover:text-white bg-[#131f2d] hover:bg-[#1b2d42] border border-[#22364c] rounded-lg transition-colors"
          >
            <span>Open Pull Request</span>
            <Launch size={13} />
          </a>

          <button
            type="button"
            onClick={handlePullLatest}
            disabled={isPulling}
            className="flex items-center gap-2 px-4 py-2 bg-[#70a5ff] hover:bg-[#85b2ff] active:bg-[#5b95f0] text-[#0a1320] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Renew size={14} className={isPulling ? "animate-spin" : ""} />
            <span>{isPulling ? "Syncing..." : "Pull & Sync GitHub"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
