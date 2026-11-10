# Judging & Evaluation Criteria (100-Point Scale)

Submissions for the IBM Db2 TechX Workshop are evaluated on a 100-point scale across five comprehensive criteria:

## 1. IBM Db2 Integration & Depth (30 Points - 30%)
- **Relational & Vector Unification (15 pts):** Uses IBM Db2 as the authoritative datastore for relational entities (solutions, feedback votes, audit logs) and dense vector representations (`DB2VS`). Avoids dual-database complexity.
- **Data Integrity & Relational Soundness (10 pts):** Implements dynamic views (`SOLUTION_STATS`) using `LEFT JOIN` without pre-baked or hardcoded success counters. Foreign key constraints and unique compound indexes enforce 1-vote-per-session integrity.
- **Enterprise Connectivity & Drivers (5 pts):** Production-grade TLS configuration on port 50001 with parameterized queries.

## 2. Innovation & Real-World Impact (25 Points - 25%)
- **Solving Real Engineering Pain (10 pts):** Targets the estimated 25% of developer time lost to outdated troubleshooting threads, broken forum answers, and hallucinated LLM shell scripts.
- **Mathematical Wilson Confidence Lower Bound (10 pts):** Solves the small-sample cold-start problem. Statistically establishes why 23 of 26 community-verified fixes outrank a volatile 1 of 1 success.
- **Semantic Understanding (5 pts):** Discovers conceptual equivalence across developer terminology without requiring exact keyword syntax.

## 3. Technical Architecture & AI Integration (20 Points - 20%)
- **LangChain Core RAG Implementation (10 pts):** Uses `@langchain/core` runnables (`PromptTemplate`, `RunnableSequence`, `StringOutputParser`) to query Db2 vector memory and synthesize actionable diagnostic guidance.
- **Dual-Stage Retrieval (5 pts):** Fast-path deterministic error code matcher backed by continuous vector retrieval.
- **Safety & Destructive Command Guardrails (5 pts):** Proactive parsing and warning for dangerous shell commands (`rm -rf`, `chmod 777`).

## 4. Reproducibility & Code Quality (15 Points - 15%)
- **Zero Secrets Enforced (5 pts):** Strict enforcement of zero credentials in git history; comprehensive `.env.example`.
- **Clean Architecture & Types (5 pts):** TypeScript Strict Mode, full component decoupling, and clean build.
- **Standalone In-Memory Fallback (5 pts):** Clean offline fallback mode when external database credentials are not supplied.

## 5. Documentation & Presentation (10 Points - 10%)
- **PowerPoint (.pptx) Deck (4 pts):** 8-slide hackathon-level presentation deck downloadable directly from the app.
- **40-Second Video Demonstration (3 pts):** Clear video demo walkthrough in README.md.
- **Interactive Pitch Deck & Visual Architecture (3 pts):** In-app pitch deck modal and comprehensive `architecture.md`.
