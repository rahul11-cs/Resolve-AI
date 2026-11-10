import React from "react";
import { DetectedBug } from "../lib/codeAnalyzer";
import { Flash, ArrowRight, WarningAlt, Code, Information } from "@carbon/icons-react";

interface CodeAnalysisCardProps {
  bugs: DetectedBug[];
  onDiagnose: (canonicalQuery: string) => void;
  onDismiss?: () => void;
}

export const CodeAnalysisCard: React.FC<CodeAnalysisCardProps> = ({
  bugs,
  onDiagnose,
  onDismiss,
}) => {
  if (!bugs || bugs.length === 0) return null;

  return (
    <div className="bg-[#161616] border-2 border-[#0f62fe] p-5 space-y-4 shadow-2xl font-mono text-xs animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2e2e] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#0f62fe] flex items-center justify-center text-white">
            <Flash size={15} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">
              Potential Issues Detected
            </h2>
            <p className="text-[11px] text-[#8d8d8d]">
              Input detected as source code. FixRank AI extracted {bugs.length} likely bugs for immediate diagnosis:
            </p>
          </div>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-[11px] text-[#8d8d8d] hover:text-white transition-colors cursor-pointer self-start sm:self-center"
          >
            Dismiss Analysis
          </button>
        )}
      </div>

      {/* Detected Bugs List */}
      <div className="space-y-3">
        {bugs.map((bug, index) => {
          const severityColor =
            bug.severity === "CRITICAL"
              ? "bg-[#da1e28]/15 text-[#ff8389] border-[#da1e28]/40"
              : bug.severity === "HIGH"
              ? "bg-[#ff832b]/15 text-[#ff832b] border-[#ff832b]/40"
              : bug.severity === "MEDIUM"
              ? "bg-[#f1c21b]/15 text-[#f1c21b] border-[#f1c21b]/40"
              : "bg-[#0f62fe]/15 text-[#4589ff] border-[#0f62fe]/40";

          return (
            <div
              key={bug.id}
              className="bg-[#1f1f1f] border border-[#333333] hover:border-[#0f62fe] p-4 transition-colors space-y-2 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 bg-[#262626] border border-[#393939] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {index + 1}
                  </span>
                  <span className="font-bold text-white text-xs sm:text-sm">
                    {bug.name}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-semibold border ${severityColor}`}>
                    {bug.severity}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] bg-[#141414] border border-[#2e2e2e] text-[#8d8d8d]">
                    {bug.category}
                  </span>
                </div>

                {/* Primary CTA: Diagnose this issue */}
                <button
                  type="button"
                  onClick={() => onDiagnose(bug.canonicalQuery)}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0f62fe] hover:bg-[#0353e9] active:bg-[#002d9c] text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer shrink-0"
                >
                  <span>Diagnose this issue</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Bug Title / Signature */}
              <div className="text-xs text-[#c6c6c6] font-mono">
                <strong className="text-white">Signature:</strong> {bug.title}
              </div>

              {/* Code Snippet if present */}
              {bug.codeSnippet && (
                <div className="flex items-center gap-2 p-2 bg-[#121212] border border-[#262626] text-[11px] text-[#4589ff]">
                  <Code size={13} className="shrink-0 text-[#8d8d8d]" />
                  <span className="text-[#8d8d8d]">Line {bug.line}:</span>
                  <code className="text-white font-mono">{bug.codeSnippet}</code>
                </div>
              )}

              {/* Explanation */}
              <p className="text-[11px] text-[#8d8d8d] leading-relaxed">
                {bug.explanation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
