import React, { useState } from "react";
import { Close, Add, Checkmark } from "@carbon/icons-react";
import { submitCommunityFix } from "../api/client";

interface SubmitFixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFixSubmitted: () => void;
  initialQuery?: string;
}

export const SubmitFixModal: React.FC<SubmitFixModalProps> = ({
  isOpen,
  onClose,
  onFixSubmitted,
  initialQuery = "",
}) => {
  const [problemSignature, setProblemSignature] = useState(initialQuery);
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState("");
  const [category, setCategory] = useState("docker");
  const [os, setOs] = useState<"all" | "linux" | "macos" | "windows">("all");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemSignature.trim() || !title.trim() || !steps.trim()) return;

    submitCommunityFix({
      problemSignature: problemSignature.trim(),
      title: title.trim(),
      steps: steps.trim(),
      category,
      os,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onFixSubmitted();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0e1722] border border-[#1d2d3e] rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative font-sans text-xs">
        <div className="flex items-center justify-between border-b border-[#1d2d3e] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#38bdf8] inline-block" />
            <h3 className="text-sm font-semibold text-white">
              Contribute Verified Fix to Resolve AI
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
          >
            <Close size={18} />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3 font-mono">
            <Checkmark size={32} className="text-[#42be65] mx-auto" />
            <div className="text-sm font-semibold text-white">
              Fix Submitted to Community Knowledge Base!
            </div>
            <p className="text-xs text-[#94a3b8]">
              Indexed in IBM Db2 vector store. It will now rank in future semantic searches.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#cbd5e1] text-xs mb-1 font-medium">
                Problem Signature / Error Traceback *
              </label>
              <input
                type="text"
                required
                value={problemSignature}
                onChange={(e) => setProblemSignature(e.target.value)}
                placeholder="e.g. Docker service not running at /var/run/docker.sock"
                className="w-full p-2.5 bg-[#090e14] border border-[#162231] focus:border-[#38bdf8] rounded-lg text-white text-xs outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[#cbd5e1] text-xs mb-1 font-medium">
                Solution Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Restart Docker systemd service and refresh group permissions"
                className="w-full p-2.5 bg-[#090e14] border border-[#162231] focus:border-[#38bdf8] rounded-lg text-white text-xs outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#cbd5e1] text-xs mb-1 font-medium">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 bg-[#090e14] border border-[#162231] focus:border-[#38bdf8] rounded-lg text-white text-xs outline-none"
                >
                  <option value="docker">Docker &amp; Containers</option>
                  <option value="db2">IBM Db2 &amp; Databases</option>
                  <option value="python">Python</option>
                  <option value="node">Node.js</option>
                  <option value="networking">Networking &amp; CORS</option>
                  <option value="git">Git &amp; Version Control</option>
                  <option value="security">Security &amp; SSH</option>
                </select>
              </div>

              <div>
                <label className="block text-[#cbd5e1] text-xs mb-1 font-medium">
                  Target Operating System
                </label>
                <select
                  value={os}
                  onChange={(e) => setOs(e.target.value as any)}
                  className="w-full p-2.5 bg-[#090e14] border border-[#162231] focus:border-[#38bdf8] rounded-lg text-white text-xs outline-none uppercase"
                >
                  <option value="all">All Operating Systems</option>
                  <option value="linux">Linux</option>
                  <option value="macos">macOS</option>
                  <option value="windows">Windows</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#cbd5e1] text-xs mb-1 font-medium">
                Step-by-Step Shell &amp; Resolution Commands *
              </label>
              <textarea
                required
                rows={4}
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder={"1. sudo systemctl status docker\n2. sudo systemctl start docker\n3. docker ps"}
                className="w-full p-2.5 bg-[#090e14] border border-[#162231] focus:border-[#38bdf8] rounded-lg text-white text-xs outline-none font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#1d2d3e]">
              <span className="text-[#64748b] text-[11px]">
                Submissions enter community review queue
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-[#131f2d] hover:bg-[#1b2d42] text-white rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#70a5ff] hover:bg-[#85b2ff] text-[#0a1320] font-semibold rounded-lg text-xs cursor-pointer"
                >
                  <Add size={14} />
                  <span>Submit Fix</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
