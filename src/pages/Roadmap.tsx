import React, { useState } from "react";
import { Document, Checkmark, Terminal, DataBase, ChartBar } from "@carbon/icons-react";

interface PhaseSpec {
  id: string;
  number: string;
  title: string;
  status: "Completed" | "Verified";
  summary: string;
  deliverables: string[];
  markdownContent: string;
}

const ROADMAP_PHASES: PhaseSpec[] = [
  {
    id: "overview",
    number: "00",
    title: "Project Overview & Engineering Architecture",
    status: "Completed",
    summary: "Single source of truth defining FixRank's core architecture, statistical formulas, and IBM Db2 integration.",
    deliverables: [
      "Db2 as sole relational and vector data store (no FAISS/Postgres/Chroma swaps)",
      "Wilson 95% Confidence Lower Bound mathematical ranking formulation",
      "Honest cold-start labeling (<5 votes = 'AI estimate'; >=5 votes = 'Community verified')",
      "IBM Carbon Design Language monochrome aesthetic with #0f62fe blue accent"
    ],
    markdownContent: `# FixRank: Project Overview & Engineering Roadmap

FixRank is an enterprise-grade AI troubleshooting assistant engineered for developer operations and site reliability engineering. Instead of relying on unverified LLM answers or raw popularity votes (which suffer from rich-get-richer biases and vote gaming), FixRank ranks technical solutions using IBM Db2 Vector Search (DB2VS) paired with a Wilson Lower Bound confidence score derived from real community feedback.

### Mathematical Formulation
Final Score = Cosine Similarity x Quality
Quality = weight * WilsonLowerBound + (1 - weight) * Prior
where weight = min(n / 5, 1.0) blends an unbiased neutral prior (0.5) during cold-start.`
  },
  {
    id: "phase1",
    number: "01",
    title: "Phase 1: Environment & Tooling Verification",
    status: "Verified",
    summary: "Verify system resources, install local AI models (granite4.2:3b, nomic-embed-text:v1.5), and create project skeleton.",
    deliverables: [
      "Hardware check: Linux x86_64 / Node.js 22+ / Python 3.10+",
      "Ollama models: granite4.2:3b and nomic-embed-text:v1.5 pulled and configured",
      "Modular project skeleton: backend/, db/init/, src/, plan/, tests/",
      ".env and .env.example with Db2 credentials and model endpoints"
    ],
    markdownContent: `# Phase 1: Environment & Tooling Verification

### Tools & Models
- Python: 3.10+ with fastapi, uvicorn, langchain-db2, langchain-ollama, ibm_db
- Ollama models: granite4.2:3b (code rewrite) & nomic-embed-text:v1.5 (768-dim embeddings)
- Database: IBM Db2 on Cloud on port 50001 with TLS
- Node.js 22+ with React 19, TypeScript, Vite, Tailwind CSS v4, @carbon/icons-react`
  },
  {
    id: "phase2",
    number: "02",
    title: "Phase 2: IBM Db2 Vector & Relational Storage",
    status: "Verified",
    summary: "Run Db2 Community Edition, define relational DDL schemas, set up DB2VS vector table, and seed 40+ error signatures.",
    deliverables: [
      "Table SOLUTIONS (id, problem_id, steps, worked, failed, source)",
      "Table FEEDBACK (id, solution_id, session_id, outcome, created_at) with UQ_VOTE unique constraint",
      "Table PROBLEMS in DB2VS vector store using COSINE distance strategy",
      "Seeded developer error dataset with 40+ error signatures across Python, Node, Git, Docker, Db2"
    ],
    markdownContent: `# Phase 2: IBM Db2 Vector & Relational Storage

### Relational Schema (db/init/01_schema.sql)
CREATE TABLE SOLUTIONS (
  ID INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  PROBLEM_ID VARCHAR(64) NOT NULL,
  TITLE VARCHAR(255) NOT NULL,
  STEPS CLOB NOT NULL,
  WORKED INTEGER NOT NULL DEFAULT 0,
  FAILED INTEGER NOT NULL DEFAULT 0,
  SOURCE VARCHAR(32) NOT NULL DEFAULT 'AI_ESTIMATE'
);

CREATE TABLE FEEDBACK (
  ID INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  SOLUTION_ID INTEGER NOT NULL,
  SESSION_ID VARCHAR(64) NOT NULL,
  OUTCOME VARCHAR(8) NOT NULL,
  CONSTRAINT UQ_VOTE UNIQUE (SOLUTION_ID, SESSION_ID)
);`
  },
  {
    id: "phase3",
    number: "03",
    title: "Phase 3: Backend API & Wilson Ranking Engine",
    status: "Verified",
    summary: "Build FastAPI endpoints (/solve, /feedback, /stats, /health) and implement Wilson Lower Bound scoring.",
    deliverables: [
      "POST /solve: cosine search (k=10) joined with SOLUTIONS via parameterized SQL",
      "POST /feedback: atomic vote logging enforcing single vote per session with 409 conflict check",
      "Mathematical unit tests: verified 90/100 wins beat 3/3 wins (0.8256 > 0.4385)",
      "Dynamic cold-start prior blending for solutions under 5 votes"
    ],
    markdownContent: `# Phase 3: Backend API & Wilson Ranking Engine

### Key Endpoints:
- POST /solve -> { query, user_os } -> Vector search k=10, join SOLUTIONS, rank by Wilson composite score
- POST /feedback -> { solution_id, outcome, session_id } -> Record vote, increment counters, return updated scores
- GET /stats -> Aggregated community metrics and leaderboard
- GET /health -> Verifies Db2 connection and Ollama model status`
  },
  {
    id: "phase4",
    number: "04",
    title: "Phase 4: Frontend UI (IBM Carbon Design Language)",
    status: "Verified",
    summary: "Construct clean, high-contrast monochrome React interface with @carbon/icons-react, zero emojis, and live voting.",
    deliverables: [
      "High-contrast ProblemForm with preset developer error signature buttons",
      "SolutionCard with rank indices (#01, #02, #03), syntax highlighted steps, and copy affordances",
      "SuccessBar with honest cold-start handling and fractional progress breakdown",
      "VoteButtons with optimistic updates, local storage sync, and duplicate prevention",
      "Analytics Dashboard with interactive Wilson score simulator and top fixes leaderboard"
    ],
    markdownContent: `# Phase 4: Frontend UI (IBM Carbon Design Language)

### Design Specifications:
- Neutral Canvas: #f4f4f4 / High-contrast white and dark slate #161616
- IBM Blue Accent: #0f62fe
- Sharp 0px corners, 1px hairline borders
- IBM Plex Sans and IBM Plex Mono fonts
- Zero emojis across the entire UI`
  },
  {
    id: "phase5",
    number: "05",
    title: "Phase 5: Security Architecture & Guardrails",
    status: "Verified",
    summary: "Implement SQL parameterization, prompt injection quarantine, rate limiting, and dangerous command filter.",
    deliverables: [
      "Parameterised queries in ibm_db with zero string formatting",
      "Destructive command filter detecting rm -rf, chmod 777, curl | bash, DROP TABLE",
      "SlowAPI rate limiting (10 req/min for solve, 30 req/min for feedback)",
      "Strict XML delimiters (<user_query>, <solution>) preventing prompt injection",
      "Secret sanitization scrubbing tokens, keys, and credentials from query inputs"
    ],
    markdownContent: `# Phase 5: Security Architecture & Guardrails

### Guardrail Defenses:
1. SQL Injection: Strict parameter bindings (? placeholders) in ibm_db.prepare & execute.
2. Destructive Commands: UI flags destructive commands with 'Review before running' alerts.
3. Prompt Injection: User input wrapped in strict XML tags; LLM forbidden from inventing success numbers.
4. Privacy: Local client scrub strips API keys and passwords before search.`
  },
  {
    id: "phase6",
    number: "06",
    title: "Phase 6: Docker Compose & Deployment Pipeline",
    status: "Verified",
    summary: "One-command deployment: multi-container orchestration with healthchecks and persistent volumes.",
    deliverables: [
      "docker-compose.yml orchestrating db2, api, ui, and ollama services",
      "Db2 service healthcheck verifying database availability before API launch",
      "Multi-stage Dockerfile for FastAPI (python:3.11-slim) running non-root user",
      "Multi-stage Dockerfile for UI with Nginx SPA routing and reverse proxy",
      "Comprehensive README.md and system architecture diagram"
    ],
    markdownContent: `# Phase 6: Docker Compose & Deployment Pipeline

### One-Command Execution:
$ docker compose up --build -d

Services Booted:
- fixrank-db2: port 50000 (persistent db2data volume)
- fixrank-api: port 8000 (FastAPI backend)
- fixrank-ui: port 3000 (Nginx + React SPA)
- ollama: port 11434 (Granite 4.2:3b & nomic-embed-text)`
  },
];

export const Roadmap: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<PhaseSpec>(ROADMAP_PHASES[0]);

  return (
    <div className="space-y-6">
      {/* Roadmap Header */}
      <div className="p-5 bg-white border border-[#e0e0e0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[#161616] tracking-tight">
            FixRank Development Roadmap & Technical Specifications
          </h2>
          <p className="text-xs text-[#525252] mt-0.5">
            Phased implementation milestones and engineering deliverables across the 6 development phases.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-1 bg-[#0f62fe] text-white font-medium">
            ALL 6 PHASES COMPLETED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Phase Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          {ROADMAP_PHASES.map((phase) => {
            const isSelected = selectedPhase.id === phase.id;
            return (
              <button
                key={phase.id}
                type="button"
                onClick={() => setSelectedPhase(phase)}
                className={`w-full text-left p-3.5 border transition-colors ${
                  isSelected
                    ? "bg-[#161616] text-white border-[#161616]"
                    : "bg-white text-[#161616] border-[#e0e0e0] hover:border-[#8d8d8d]"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className={isSelected ? "text-[#0f62fe] font-bold" : "text-[#525252] font-semibold"}>
                    PHASE {phase.number}
                  </span>
                  <span
                    className={`text-[10px] uppercase px-1.5 py-0.2 ${
                      isSelected ? "bg-[#262626] text-[#42be65]" : "bg-[#f4f4f4] text-[#161616]"
                    }`}
                  >
                    {phase.status}
                  </span>
                </div>
                <div className="text-xs font-semibold mt-1 leading-snug">
                  {phase.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Phase Detail Content */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 bg-white border border-[#e0e0e0] space-y-5">
            <div className="flex items-center justify-between border-b border-[#e0e0e0] pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-[#0f62fe] uppercase">
                  Milestone Specification #{selectedPhase.number}
                </span>
                <h3 className="text-lg font-bold text-[#161616] tracking-tight mt-0.5">
                  {selectedPhase.title}
                </h3>
              </div>
              <span className="px-2.5 py-0.5 text-xs font-mono bg-[#defbe6] text-[#0e6027] border border-[#a7f0ba] font-semibold">
                {selectedPhase.status.toUpperCase()}
              </span>
            </div>

            <p className="text-xs font-mono text-[#525252] leading-relaxed">
              {selectedPhase.summary}
            </p>

            {/* Key Deliverables Checklist */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#161616] block">
                Key Technical Deliverables:
              </span>
              <ul className="space-y-1.5 font-mono text-xs text-[#161616]">
                {selectedPhase.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-[#f4f4f4] p-2 border border-[#e0e0e0]">
                    <Checkmark size={14} className="text-[#0f62fe] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Markdown Specification Box */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-[#525252]">
                <span className="font-semibold uppercase tracking-wider text-[11px]">
                  Technical Specification Snapshot:
                </span>
                <span className="text-[#8d8d8d]">Markdown Plan File</span>
              </div>
              <div className="p-4 bg-[#161616] text-[#f4f4f4] font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap select-text">
                {selectedPhase.markdownContent}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
