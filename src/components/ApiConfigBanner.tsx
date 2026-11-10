import React from "react";
import { MisuseOutline } from "@carbon/icons-react";

export const ApiConfigBanner: React.FC = () => {
  const isMissingApiUrl = Boolean(import.meta.env.PROD && !(import.meta.env.VITE_API_URL || "").trim());

  if (!isMissingApiUrl) {
    return null;
  }

  return (
    <div
      role="alert"
      className="bg-[#2d0709] border-b border-[#da1e28] text-white px-4 py-3 text-xs font-mono sticky top-16 z-30 shadow-lg"
    >
      <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3">
        <MisuseOutline size={20} className="text-[#ff8389] shrink-0 mt-0.5 sm:mt-0" />
        <div className="flex-1">
          <p className="font-bold text-[#ffb3b8]">
            Production Configuration Error: VITE_API_URL is missing
          </p>
          <p className="text-[#cbd5e1] text-[11px] mt-0.5">
            This deployment is running in production without a configured backend API URL. Please set{" "}
            <code className="bg-[#121212] px-1.5 py-0.5 rounded text-[#ff8389] font-semibold">
              VITE_API_URL
            </code>{" "}
            in your Vercel Project Settings &gt; Environment Variables pointing to your Railway FastAPI backend (e.g.{" "}
            <code className="bg-[#121212] px-1.5 py-0.5 rounded text-[#70a5ff]">
              https://your-backend.railway.app
            </code>
            ). No hardcoded address or mock endpoint fallback is used.
          </p>
        </div>
      </div>
    </div>
  );
};
