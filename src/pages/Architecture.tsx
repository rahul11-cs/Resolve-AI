import React, { useState } from "react";
import {
  DataBase,
  Terminal,
  CloudUpload,
  Flash,
  Security,
  CheckmarkOutline,
  Copy,
  Checkmark,
} from "@carbon/icons-react";

export const Architecture: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const DOCKER_COMPOSE_SNIPPET = `version: '3.8'
services:
  db2:
    image: icr.io/db2_community/db2:latest
    privileged: true
    ports: ["50000:50000"]
    environment:
      - LICENSE=accept
      - DB2INSTANCE=db2inst1
      - DBNAME=TESTDB
    volumes: [db2data:/database]

  api:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      - DB2_HOST=db2
      - DB2_PORT=50000
      - OLLAMA_BASE_URL=http://host.docker.internal:11434
    depends_on: [db2]

  ui:
    build: ./frontend
    ports: ["3000:3000"]`;

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="p-6 bg-[#171717] border border-[#2e2e2e]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#0f62fe] font-semibold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 bg-[#0f62fe] inline-block" />
              Production Enterprise Architecture
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              FixRank System Topology & Cloud Orchestration
            </h1>
            <p className="text-xs text-[#8d8d8d] mt-1 max-w-2xl">
              High-throughput developer knowledge retrieval combining IBM Db2 Vector Search, IBM Granite embeddings, and the Wilson 95% confidence lower-bound mathematical ranking model.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#42be65]/10 border border-[#42be65]/40 text-[#42be65] text-xs font-semibold">
              SaaS Ready · Cloud Targets
            </span>
          </div>
        </div>
      </div>

      {/* Visual Pipeline Flowchart */}
      <div className="p-6 bg-[#171717] border border-[#2e2e2e] space-y-6">
        <div className="flex items-center justify-between border-b border-[#2e2e2e] pb-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            End-to-End Execution Pipeline
          </h2>
          <span className="text-xs text-[#8d8d8d]">Latency Budget: &lt; 85ms</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 text-xs">
          {/* Step 1 */}
          <div className="bg-[#1f1f1f] p-4 border border-[#2e2e2e] flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] text-[#0f62fe] font-bold block uppercase">01 · Client Tier</span>
              <h3 className="font-bold text-white text-sm mt-0.5">React 19 SPA</h3>
              <p className="text-[11px] text-[#8d8d8d] mt-1">
                Vite 8 + Tailwind CSS + IBM Carbon icons. Zero emojis. Keyboard shortcuts (⌘K).
              </p>
            </div>
            <div className="pt-2 border-t border-[#2e2e2e] text-[10px] text-[#c6c6c6]">
              Target: <span className="text-white font-semibold">Vercel Edge</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-[#1f1f1f] p-4 border border-[#2e2e2e] flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] text-[#0f62fe] font-bold block uppercase">02 · API Gateway</span>
              <h3 className="font-bold text-white text-sm mt-0.5">FastAPI Python</h3>
              <p className="text-[11px] text-[#8d8d8d] mt-1">
                Pydantic validation, SlowAPI rate limiting, privacy scrub, and dangerous command filter.
              </p>
            </div>
            <div className="pt-2 border-t border-[#2e2e2e] text-[10px] text-[#c6c6c6]">
              Target: <span className="text-white font-semibold">Railway / Render</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-[#1f1f1f] p-4 border border-[#2e2e2e] flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] text-[#0f62fe] font-bold block uppercase">03 · Embeddings</span>
              <h3 className="font-bold text-white text-sm mt-0.5">IBM Granite</h3>
              <p className="text-[11px] text-[#8d8d8d] mt-1">
                Dense semantic vectorization of code errors and runtime diagnostics (768-dim).
              </p>
            </div>
            <div className="pt-2 border-t border-[#2e2e2e] text-[10px] text-[#c6c6c6]">
              Target: <span className="text-white font-semibold">Ollama / Watsonx</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-[#1f1f1f] p-4 border border-[#2e2e2e] flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] text-[#0f62fe] font-bold block uppercase">04 · Vector Store</span>
              <h3 className="font-bold text-white text-sm mt-0.5">IBM Db2 (DB2VS)</h3>
              <p className="text-[11px] text-[#8d8d8d] mt-1">
                COSINE index on PROBLEMS table with metadata filtering (category, OS).
              </p>
            </div>
            <div className="pt-2 border-t border-[#2e2e2e] text-[10px] text-[#c6c6c6]">
              Target: <span className="text-white font-semibold">IBM Db2 on Cloud</span>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-[#1f1f1f] p-4 border border-[#2e2e2e] flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] text-[#0f62fe] font-bold block uppercase">05 · Ranking Math</span>
              <h3 className="font-bold text-white text-sm mt-0.5">Wilson Bound</h3>
              <p className="text-[11px] text-[#8d8d8d] mt-1">
                Score = Similarity × WilsonLowerBound. 90/100 wins beat volatile 3/3 wins.
              </p>
            </div>
            <div className="pt-2 border-t border-[#2e2e2e] text-[10px] text-[#c6c6c6]">
              Formula: <span className="text-white font-semibold">z = 1.96 (95% CI)</span>
            </div>
          </div>

          {/* Step 6 */}
          <div className="bg-[#1f1f1f] p-4 border border-[#2e2e2e] flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] text-[#0f62fe] font-bold block uppercase">06 · Delivery</span>
              <h3 className="font-bold text-white text-sm mt-0.5">Ranked Fixes</h3>
              <p className="text-[11px] text-[#8d8d8d] mt-1">
                Top 3-5 verified steps with semantic explainability tokens and 1-click Markdown copy.
              </p>
            </div>
            <div className="pt-2 border-t border-[#2e2e2e] text-[10px] text-[#c6c6c6]">
              Output: <span className="text-white font-semibold">Interactive Cards</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Production Cloud Deployment Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        {/* Tier 1 */}
        <div className="bg-[#171717] border border-[#2e2e2e] p-5 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <CloudUpload size={18} className="text-[#0f62fe]" />
            <span>Frontend Tier (Vercel)</span>
          </div>
          <p className="text-[#8d8d8d] text-[11px]">
            Hosted on Vercel Global Edge Network with zero cold starts, single-page client rewrites via <code>vercel.json</code>, and strict HTTP headers.
          </p>
          <div className="bg-[#121212] p-2.5 border border-[#2e2e2e] text-[11px] text-[#c6c6c6] space-y-1">
            <div>• Framework: Vite + React 19</div>
            <div>• CDN Latency: ~18ms globally</div>
            <div>• Deployment: Automatic git push</div>
          </div>
        </div>

        {/* Tier 2 */}
        <div className="bg-[#171717] border border-[#2e2e2e] p-5 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <Terminal size={18} className="text-[#4589ff]" />
            <span>Backend Tier (Railway / Render)</span>
          </div>
          <p className="text-[#8d8d8d] text-[11px]">
            Containerized FastAPI service running non-root Python 3.11 with SlowAPI rate limiters, Pydantic v2 schemas, and prepared SQL execution.
          </p>
          <div className="bg-[#121212] p-2.5 border border-[#2e2e2e] text-[11px] text-[#c6c6c6] space-y-1">
            <div>• Runtime: Python 3.11-slim</div>
            <div>• Port: 8000 (HTTPS reverse proxy)</div>
            <div>• Workers: Uvicorn standard</div>
          </div>
        </div>

        {/* Tier 3 */}
        <div className="bg-[#171717] border border-[#2e2e2e] p-5 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <DataBase size={18} className="text-[#42be65]" />
            <span>Database Tier (IBM Db2 on Cloud)</span>
          </div>
          <p className="text-[#8d8d8d] text-[11px]">
            Managed IBM Db2 enterprise instance housing relational tables (<code>SOLUTIONS</code>, <code>FEEDBACK</code>) alongside the <code>DB2VS</code> vector store.
          </p>
          <div className="bg-[#121212] p-2.5 border border-[#2e2e2e] text-[11px] text-[#c6c6c6] space-y-1">
            <div>• Engine: Db2 12.1+ LUW</div>
            <div>• Vector: DB2VS Cosine Index</div>
            <div>• Connection: TLS/SSL Encrypted</div>
          </div>
        </div>
      </div>

      {/* Production Security & Governance */}
      <div className="p-6 bg-[#171717] border border-[#2e2e2e] space-y-4">
        <div className="flex items-center gap-2">
          <Security size={18} className="text-[#42be65]" />
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            Enterprise Security & Zero-Trust Policies
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#1f1f1f] p-3.5 border border-[#2e2e2e] space-y-1">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <CheckmarkOutline size={14} className="text-[#42be65]" />
              Parameterized SQL Only
            </span>
            <p className="text-[#8d8d8d] text-[11px]">
              Every database call in <code>backend/app/db.py</code> uses prepared statement parameter bindings. Zero string interpolation.
            </p>
          </div>

          <div className="bg-[#1f1f1f] p-3.5 border border-[#2e2e2e] space-y-1">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <CheckmarkOutline size={14} className="text-[#42be65]" />
              Destructive Command Guardrail
            </span>
            <p className="text-[#8d8d8d] text-[11px]">
              Active scanning for <code>rm -rf</code>, <code>chmod 777</code>, <code>sudo | sh</code>, <code>docker system prune</code>, and <code>git push -f</code> with copy confirmation modal.
            </p>
          </div>

          <div className="bg-[#1f1f1f] p-3.5 border border-[#2e2e2e] space-y-1">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <CheckmarkOutline size={14} className="text-[#42be65]" />
              Pre-Query Secret Redaction
            </span>
            <p className="text-[#8d8d8d] text-[11px]">
              Automatic regex scrubbing cleans API tokens, passwords, JWTs, and private keys before submission to vector stores or logs.
            </p>
          </div>

          <div className="bg-[#1f1f1f] p-3.5 border border-[#2e2e2e] space-y-1">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <CheckmarkOutline size={14} className="text-[#42be65]" />
              Unique Vote Session Isolation
            </span>
            <p className="text-[#8d8d8d] text-[11px]">
              Database unique constraint on <code>(solution_id, session_id)</code> prevents ballot stuffing and repeat vote attacks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
