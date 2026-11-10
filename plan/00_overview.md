# FixRank: Project Overview & Engineering Roadmap

FixRank is an enterprise-grade AI troubleshooting assistant engineered for developer operations and site reliability engineering. Instead of relying on unverified LLM answers or raw popularity votes (which suffer from rich-get-richer biases and vote gaming), FixRank ranks technical solutions using **IBM Db2 Vector Search (DB2VS)** paired with a **Wilson Lower Bound confidence score** derived from real community feedback.

---

## 1. Core Architecture Principles

1. **Db2 as Single Source of Truth**: IBM Db2 Community Edition (12.1.x) serves as both the relational data store (`SOLUTIONS`, `FEEDBACK`) and the vector store (`PROBLEMS` table using `DB2VS` with cosine distance).
2. **Mathematical Ranking (Wilson Score)**:
   $$\text{Final Score} = \text{Cosine Similarity} \times \text{Quality}$$
   $$\text{Quality} = w \cdot \text{WilsonLowerBound} + (1 - w) \cdot \text{Prior}$$
   where $w = \min(n / 5, 1.0)$ blends an unbiased neutral prior ($0.5$) during cold-start.
3. **Honest Labeling & Cold-Start Discipline**:
   - Solutions with $n = \text{worked} + \text{failed} < 5$ are explicitly labeled **"AI estimate"** with no fabricated percentages.
   - Solutions with $n \ge 5$ are labeled **"Community verified"** showing exact fractional counts ("Worked for X of Y engineers") and confidence bounds.
4. **Data-Heavy IBM Carbon Design**:
   - High-contrast monochrome theme with IBM Blue accent (`#0f62fe`).
   - IBM Plex Sans and IBM Plex Mono typography.
   - Zero emojis, sharp border corners, dense tabular figures (`tabular-nums`), and explicit data states.

---

## 2. Phase Milestones Summary

| Phase | Milestone Name | Key Deliverables | Status |
|:---|:---|:---|:---|
| **Phase 1** | Environment & Baseline | Machine check, Ollama models (`granite4.2:3b`, `nomic-embed-text:v1.5`), folder skeleton, `.env` | Completed |
| **Phase 2** | Db2 Relational & Vector Store | `SOLUTIONS` & `FEEDBACK` DDL, `DB2VS` vector table, 40+ seeded developer errors, test search | Completed |
| **Phase 3** | FastAPI Backend & Ranking | `/solve`, `/feedback`, `/stats`, `/health`, Wilson ranking engine, safe step prompt rewriting | Completed |
| **Phase 4** | React + Carbon Frontend | IBM Carbon UI, Solution Cards, Voting actions, Success rate bars, Stats dashboard | Completed |
| **Phase 5** | Security & Guardrails | SQL parameterization, rate limiting, dangerous command filter (`rm -rf`, `chmod 777`), secret sanitization | Completed |
| **Phase 6** | Docker & Cloud Deployment | Multi-container Docker Compose (`db2`, `api`, `ui`, `ollama`), seed automation, documentation | Completed |

---

## 3. Technology Stack

- **Relational & Vector Store**: IBM Db2 12.1 Community Edition (`icr.io/db2_community/db2`)
- **Python Driver & Connectors**: `ibm_db`, `ibm_db_dbi`, `langchain-db2`
- **Embedding & Inference Models**: Ollama (`nomic-embed-text:v1.5` 768-dim, `granite4.2:3b`)
- **Backend API**: Python 3.11+, FastAPI, Pydantic v2, SlowAPI, Uvicorn
- **Frontend SPA**: React 19, TypeScript, Vite 8, Tailwind CSS v4, `@carbon/icons-react`
- **Containerization**: Docker Compose v2, multi-stage Nginx + Python images
