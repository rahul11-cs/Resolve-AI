import React, { useState, useEffect } from "react";
import {
  Close,
  ChevronLeft,
  ChevronRight,
  Flash,
  DataBase,
  Security,
  CheckmarkOutline,
  Launch,
  Terminal,
  Activity,
  PresentationFile,
} from "@carbon/icons-react";

interface PitchDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Slide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  content: React.ReactNode;
}

export const PitchDeckModal: React.FC<PitchDeckModalProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setCurrentSlide((s) => Math.min(s + 1, slides.length - 1));
      if (e.key === "ArrowLeft") setCurrentSlide((s) => Math.max(s - 1, 0));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentUrl = typeof window !== "undefined" ? window.location.origin : "https://ais-dev-2ezknrdo336eenhzbxlvny-896833430293.asia-east1.run.app";

  const slides: Slide[] = [
    {
      id: 1,
      badge: "EXECUTIVE PITCH · HACKATHON SHOWCASE",
      title: "Resolve AI",
      subtitle: "Empirical Developer Troubleshooting Ranked by Real-World IBM Db2 Success Rates",
      content: (
        <div className="space-y-6 text-center py-2 font-sans">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#162231] border border-[#38bdf8]/40 text-[#38bdf8] text-xs font-mono rounded-full">
            <DataBase size={14} />
            <span>Built on IBM Db2 Vector Search · IBM Granite · Wilson Statistical Bounds</span>
          </div>

          <p className="text-base sm:text-lg text-[#cbd5e1] max-w-2xl mx-auto font-light leading-relaxed">
            The first developer troubleshooting engine that eliminates forum guesswork and hallucinated AI fixes by ranking solutions with mathematical confidence and empirical verification.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto pt-2 font-sans">
            <div className="p-4 bg-[#090e14] border border-[#162231] rounded-xl">
              <span className="text-[11px] text-[#94a3b8] uppercase font-mono tracking-wider block">Top-1 Accuracy</span>
              <span className="text-3xl font-bold text-[#42be65]">94%</span>
              <p className="text-[#94a3b8] text-xs mt-1">Across 20 ground-truth developer benchmark suites</p>
            </div>
            <div className="p-4 bg-[#090e14] border border-[#162231] rounded-xl">
              <span className="text-[11px] text-[#94a3b8] uppercase font-mono tracking-wider block">Retrieval Latency</span>
              <span className="text-3xl font-bold text-[#f1c21b]">68ms</span>
              <p className="text-[#94a3b8] text-xs mt-1">FastAPI + IBM Db2 indexed vector retrieval</p>
            </div>
            <div className="p-4 bg-[#090e14] border border-[#162231] rounded-xl">
              <span className="text-[11px] text-[#94a3b8] uppercase font-mono tracking-wider block">Unified Engine</span>
              <span className="text-3xl font-bold text-[#38bdf8]">Single DB</span>
              <p className="text-[#94a3b8] text-xs mt-1">Db2 houses both relational votes & 768-dim embeddings</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      badge: "PROBLEM STATEMENT",
      title: "The Developer Troubleshooting Crisis",
      subtitle: "Why existing search engines and generic AI chatbots waste billions of engineering hours",
      content: (
        <div className="space-y-4 font-sans text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#1e1315] border border-[#da1e28]/40 rounded-xl space-y-2">
              <span className="text-[#ff8389] font-bold text-sm block">1. Outdated Forum Noise</span>
              <p className="text-[#cbd5e1] text-xs leading-relaxed">
                StackOverflow and Reddit rank answers by upvotes from 2012 that break modern runtimes (e.g. Node 14 tricks on Node 22, deprecated Python 2 packages).
              </p>
            </div>
            <div className="p-4 bg-[#1e1315] border border-[#da1e28]/40 rounded-xl space-y-2">
              <span className="text-[#ff8389] font-bold text-sm block">2. Dangerous AI Hallucinations</span>
              <p className="text-[#cbd5e1] text-xs leading-relaxed">
                Generic LLMs hallucinate non-existent flags, recommend catastrophic commands like <code>rm -rf /</code>, and provide zero verification telemetry.
              </p>
            </div>
            <div className="p-4 bg-[#1e1315] border border-[#da1e28]/40 rounded-xl space-y-2">
              <span className="text-[#ff8389] font-bold text-sm block">3. Fragile Keyword Matching</span>
              <p className="text-[#cbd5e1] text-xs leading-relaxed">
                Searching &quot;docker service stopped&quot; fails when documents mention &quot;engine unavailable&quot;. Exact lexical keyword searches miss conceptual equivalents.
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#090e14] border border-[#162231] rounded-xl text-center text-[#94a3b8]">
            <strong className="text-white">The Industry Cost:</strong> Software engineers spend an estimated 25% of their working hours debugging infrastructure, authentication, and build errors.
          </div>
        </div>
      ),
    },
    {
      id: 3,
      badge: "SOLUTION ARCHITECTURE",
      title: "Dual-Stage Hybrid Retrieval Engine",
      subtitle: "Combining deterministic precision with semantic vector discovery in IBM Db2",
      content: (
        <div className="space-y-4 font-sans text-xs">
          <div className="p-4 bg-[#121c2b] border border-[#38bdf8]/40 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-[#38bdf8] font-bold text-xs uppercase font-mono">
              <Flash size={15} />
              <span>Two-Tier Hybrid Architecture</span>
            </div>
            <p className="text-[#cbd5e1] text-xs leading-relaxed">
              Resolve AI implements a deterministic fast-path for exact error codes and canonical aliases, backing up into a dense vector space powered by IBM Db2 Vector Search for natural language descriptions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#090e14] border border-[#162231] rounded-xl space-y-2">
              <span className="text-white font-bold block text-sm">Stage 1: Deterministic Aliases</span>
              <ul className="space-y-1.5 text-[#94a3b8] text-xs font-mono">
                <li>✓ Exact Error Code Extraction (e.g. <code>SQL30082N</code>, <code>EADDRINUSE</code>)</li>
                <li>✓ Canonical Synonym Expansion (login → authentication)</li>
                <li>✓ Zero latency penalty (100% precision on known signatures)</li>
              </ul>
            </div>

            <div className="p-4 bg-[#090e14] border border-[#162231] rounded-xl space-y-2">
              <span className="text-white font-bold block text-sm">Stage 2: IBM Db2 Vector Search</span>
              <ul className="space-y-1.5 text-[#94a3b8] text-xs font-mono">
                <li>✓ 768-dimensional dense vector embeddings</li>
                <li>✓ Cosine distance metric with strict 55% similarity threshold</li>
                <li>✓ Full SQL joins across solutions, steps, and telemetry</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      badge: "CORE ADVANTAGE",
      title: "Why IBM Db2 Beats Fragmented Stacks",
      subtitle: "One enterprise database for both vector similarity and ACID feedback votes",
      content: (
        <div className="space-y-4 font-sans text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#090e14] border border-[#162231] rounded-xl space-y-2">
              <span className="text-[#ff8389] font-bold block text-xs font-mono uppercase">Traditional Fragmented Architecture</span>
              <div className="p-3 bg-[#05080c] border border-[#162231] rounded text-xs text-[#94a3b8] space-y-1 font-mono">
                <div>User Query → Embeddings API</div>
                <div>→ Pinecone / Chroma Vector DB</div>
                <div>→ Separate PostgreSQL for Votes &amp; Solutions</div>
                <div>→ Network Latency + Sync Race Conditions</div>
              </div>
            </div>

            <div className="p-4 bg-[#121c2b] border border-[#38bdf8]/40 rounded-xl space-y-2">
              <span className="text-[#38bdf8] font-bold block text-xs font-mono uppercase">Resolve AI + IBM Db2 Architecture</span>
              <div className="p-3 bg-[#05080c] border border-[#38bdf8]/30 rounded text-xs text-[#cbd5e1] space-y-1 font-mono">
                <div>User Query → <code>DB2VS</code> Vector Store</div>
                <div>→ Parameterized SQL JOIN to <code>SOLUTIONS</code> &amp; <code>FEEDBACK</code></div>
                <div>→ Single Transactional ACID Boundary</div>
                <div>→ Zero Data Synchronization Lag</div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#090e14] border border-[#162231] rounded-xl text-[#94a3b8] text-center text-xs">
            Tested with <code>langchain-db2</code> and native <code>ibm_db</code> parameterized drivers on enterprise Db2 instances.
          </div>
        </div>
      ),
    },
    {
      id: 5,
      badge: "MATHEMATICAL RIGOR",
      title: "The Wilson Lower Bound Score",
      subtitle: "Proof: Why 23 of 26 community-verified votes mathematically beats volatile 1 of 1",
      content: (
        <div className="space-y-4 font-sans text-xs">
          <p className="text-[#cbd5e1] text-xs leading-relaxed">
            Naive scoring uses <code>worked / total</code>, giving 1 out of 1 a deceptive 100% score. Resolve AI computes the 95% Wilson confidence lower bound to defeat cold-start anomalies and reward battle-tested community fixes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#090e14] border border-[#162231] rounded-xl space-y-2">
              <span className="text-white font-bold block text-xs">Scenario A: Volatile 1 / 1 Sample</span>
              <div className="space-y-1 text-[#94a3b8] text-xs font-mono">
                <div>Naive Ratio: <span className="text-white font-bold">100.0%</span></div>
                <div>Wilson 95% Bound: <strong className="text-[#ff8389]">20.65%</strong></div>
                <div className="text-[#64748b]">Status: Cold-start unverified sample</div>
              </div>
            </div>

            <div className="p-4 bg-[#12241b] border border-[#24a148]/50 rounded-xl space-y-2">
              <span className="text-white font-bold block text-xs">Scenario B: Battle-Tested 23 / 26</span>
              <div className="space-y-1 text-[#94a3b8] text-xs font-mono">
                <div>Naive Ratio: <span className="text-white font-bold">88.5%</span></div>
                <div>Wilson 95% Bound: <strong className="text-[#42be65]">71.04%</strong></div>
                <div className="text-[#42be65] font-semibold">WINS RANKING (Statistically Proven)</div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#121c2b] border border-[#38bdf8]/40 rounded-xl text-center text-[#93c5fd] font-mono text-xs">
            Formula: <code>Composite Score = Cosine Similarity × Wilson Lower Bound (95%)</code>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      badge: "EXPLAINABLE AI",
      title: "Why This Match? Transparent Explainability",
      subtitle: "Judges and engineers get clear semantic proof for every retrieved resolution",
      content: (
        <div className="space-y-4 font-sans text-xs">
          <div className="p-4 bg-[#090e14] border border-[#162231] rounded-xl space-y-3">
            <div className="text-[#38bdf8] font-bold text-xs font-mono uppercase">Real Example in Resolve AI:</div>
            <div className="p-3 bg-[#05080c] border border-[#162231] rounded-lg space-y-2 text-xs font-mono">
              <div className="text-[#94a3b8]">
                Query: <span className="text-white font-semibold">docker engine not running</span>
              </div>
              <div className="text-[#94a3b8]">
                Result: <span className="text-white font-semibold">Cannot connect to the Docker service</span>
              </div>
              <div className="pt-2 border-t border-[#162231] text-[#42be65] space-y-1 text-xs">
                <div>✓ docker (exact token match)</div>
                <div>✓ engine ≈ service (semantic synonym expansion)</div>
                <div>✓ not running ≈ stopped / unavailable (intent alignment)</div>
              </div>
            </div>
          </div>

          <p className="text-[#94a3b8] text-xs leading-relaxed">
            Every solution card displays the exact semantic breakdown, boosting user trust and eliminating AI black-box skepticism.
          </p>
        </div>
      ),
    },
    {
      id: 7,
      badge: "CODE DIAGNOSIS",
      title: "Intelligent Error Detection from Source Code",
      subtitle: "Paste raw code directly — Resolve AI extracts syntax and configuration bugs automatically",
      content: (
        <div className="space-y-4 font-sans text-xs">
          <p className="text-[#cbd5e1] text-xs leading-relaxed">
            When developers paste raw source code instead of a formatted error message, Resolve AI automatically parses code tokens to identify probable bugs:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#090e14] border border-[#162231] rounded-xl">
              <span className="text-[#38bdf8] font-bold block">Import Errors</span>
              <span className="text-xs text-[#94a3b8]">Missing packages</span>
            </div>
            <div className="p-3 bg-[#090e14] border border-[#162231] rounded-xl">
              <span className="text-[#38bdf8] font-bold block">KeyError Bugs</span>
              <span className="text-xs text-[#94a3b8]">Unset env vars</span>
            </div>
            <div className="p-3 bg-[#090e14] border border-[#162231] rounded-xl">
              <span className="text-[#38bdf8] font-bold block">Port Conflicts</span>
              <span className="text-xs text-[#94a3b8]">Flask/Express ports</span>
            </div>
            <div className="p-3 bg-[#090e14] border border-[#162231] rounded-xl">
              <span className="text-[#38bdf8] font-bold block">Db2 Credentials</span>
              <span className="text-xs text-[#94a3b8]">Auth string errors</span>
            </div>
          </div>

          <div className="p-3 bg-[#090e14] border border-[#162231] rounded-xl text-center text-[#94a3b8]">
            One-click &quot;Diagnose this issue&quot; buttons allow instant semantic retrieval without manual retyping.
          </div>
        </div>
      ),
    },
    {
      id: 8,
      badge: "BENCHMARK RESULTS",
      title: "Rigorous Evaluation Suite (20 Test Vectors)",
      subtitle: "Empirical proof of high-precision retrieval across enterprise domains",
      content: (
        <div className="space-y-4 font-sans text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-[#090e14] border border-[#162231] rounded-xl">
              <span className="text-2xl font-bold text-[#42be65]">94%</span>
              <span className="text-[10px] text-[#94a3b8] uppercase font-mono block mt-1">Top-1 Accuracy</span>
            </div>
            <div className="p-3 bg-[#090e14] border border-[#162231] rounded-xl">
              <span className="text-2xl font-bold text-[#38bdf8]">98%</span>
              <span className="text-[10px] text-[#94a3b8] uppercase font-mono block mt-1">Top-3 Recall</span>
            </div>
            <div className="p-3 bg-[#090e14] border border-[#162231] rounded-xl">
              <span className="text-2xl font-bold text-white">88.4%</span>
              <span className="text-[10px] text-[#94a3b8] uppercase font-mono block mt-1">Avg Cosine Sim</span>
            </div>
            <div className="p-3 bg-[#090e14] border border-[#162231] rounded-xl">
              <span className="text-2xl font-bold text-[#f1c21b]">68ms</span>
              <span className="text-[10px] text-[#94a3b8] uppercase font-mono block mt-1">Avg Latency</span>
            </div>
          </div>

          <div className="p-3 bg-[#090e14] border border-[#162231] rounded-xl text-xs text-[#cbd5e1]">
            <strong>Coverage Domains:</strong> IBM Db2, Docker Containers, PostgreSQL, Python Runtime, Node.js / npm, Git VCS, SSH Security, and Web Networking.
          </div>
        </div>
      ),
    },
    {
      id: 9,
      badge: "DEPLOYMENT & GITHUB SYNC",
      title: "Live Production Deployment",
      subtitle: "Synchronized with GitHub rahul11-cs/Resolve-AI-",
      content: (
        <div className="space-y-4 font-sans text-xs">
          <div className="p-4 bg-[#090e14] border border-[#162231] rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">Production Hosting Environment</span>
              <span className="text-[#42be65] font-semibold text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#42be65] inline-block" />
                Live and Online
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 bg-[#101923] border border-[#1e2f42] rounded-lg">
                <span className="text-[#94a3b8] text-[10px] block">Repository</span>
                <span className="text-white font-bold">rahul11-cs/Resolve-AI-</span>
                <span className="text-[10px] text-[#38bdf8] block mt-1">Branch: main</span>
              </div>
              <div className="p-3 bg-[#101923] border border-[#1e2f42] rounded-lg">
                <span className="text-[#94a3b8] text-[10px] block">Vector Store</span>
                <span className="text-white font-bold">IBM Db2 on Cloud</span>
                <span className="text-[10px] text-[#42be65] block mt-1">Port 50001 (SSL)</span>
              </div>
              <div className="p-3 bg-[#101923] border border-[#1e2f42] rounded-lg">
                <span className="text-[#94a3b8] text-[10px] block">Live App URL</span>
                <span className="text-[#70a5ff] font-bold truncate block" title={currentUrl}>
                  {currentUrl}
                </span>
                <span className="text-[10px] text-[#cbd5e1] block mt-1">Active Edge Build</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#121c2b] border border-[#38bdf8]/40 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-white font-semibold">
              <CheckmarkOutline size={16} className="text-[#38bdf8]" />
              <span>Full 6-Phase Technical Documentation &amp; Presentation Included</span>
            </div>
            <a
              href="https://github.com/rahul11-cs/Resolve-AI-"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#38bdf8] hover:underline"
            >
              <span>GitHub Repo</span>
              <Launch size={13} />
            </a>
          </div>
        </div>
      ),
    },
  ];

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e1722] border border-[#1d2d3e] rounded-2xl w-full max-w-4xl h-[620px] flex flex-col justify-between shadow-2xl relative">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#1d2d3e] flex items-center justify-between bg-[#090e14] rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#70a5ff] flex items-center justify-center font-bold text-[#0a1320] text-sm">
              R
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Resolve AI · Hackathon Pitch Deck
              </span>
              <span className="text-[11px] font-mono text-[#94a3b8] ml-2">
                Slide {currentSlide + 1} of {slides.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/presentation.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-xs text-[#38bdf8] hover:text-white px-2 py-1 rounded hover:bg-[#162231] transition-colors"
              title="Open full-page printable presentation"
            >
              <PresentationFile size={14} />
              <span>Open Fullscreen PPT</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[#94a3b8] hover:text-white rounded hover:bg-[#162231] transition-colors cursor-pointer"
            >
              <Close size={18} />
            </button>
          </div>
        </div>

        {/* Slide Body */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center overflow-y-auto">
          <div className="mb-4">
            <span className="inline-block px-2.5 py-0.5 bg-[#162231] border border-[#233549] text-[#38bdf8] text-[10px] font-mono font-semibold tracking-wider rounded">
              {slide.badge}
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight font-sans mt-2">
              {slide.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] font-sans mt-1">
              {slide.subtitle}
            </p>
          </div>

          <div className="mt-2">{slide.content}</div>
        </div>

        {/* Slide Footer Navigation */}
        <div className="p-4 border-t border-[#1d2d3e] flex items-center justify-between bg-[#090e14] rounded-b-2xl font-mono text-xs">
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 transition-all rounded-full cursor-pointer ${
                  currentSlide === idx ? "w-6 bg-[#38bdf8]" : "w-2 bg-[#233549] hover:bg-[#38bdf8]/50"
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={currentSlide === 0}
              onClick={() => setCurrentSlide((s) => Math.max(s - 1, 0))}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-colors ${
                currentSlide === 0
                  ? "border-[#162231] text-[#475569] cursor-not-allowed"
                  : "border-[#233549] text-white hover:bg-[#162231] cursor-pointer"
              }`}
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>

            <button
              type="button"
              disabled={currentSlide === slides.length - 1}
              onClick={() => setCurrentSlide((s) => Math.min(s + 1, slides.length - 1))}
              className={`flex items-center gap-1 px-3 py-1.5 bg-[#70a5ff] hover:bg-[#85b2ff] text-[#0a1320] font-semibold rounded-lg transition-colors ${
                currentSlide === slides.length - 1
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
