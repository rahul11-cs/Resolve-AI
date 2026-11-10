# Phase 1: Environment & Tooling Verification

## 1. Goal
Confirm runtime environment prerequisites, install all required dependencies and local AI models, and scaffold the modular project tree.

## 2. Technical Specifications
- **Operating System**: Linux x86_64 / macOS / Windows WSL2
- **Python**: 3.10+ (tested with 3.10.12 and 3.11)
- **Node.js**: 20+ (current: v22.23.2)
- **LLM Engine**: Ollama endpoint configured via `EMBED_BASE_URL`
  - Model 1: `granite4.2:3b` (IBM Granite 3B instruct for precise command rewrite)
  - Model 2: `nomic-embed-text:v1.5` (768-dimensional dense vector embeddings)
- **Database Engine**: IBM Db2 12.1.x Community Edition on port 50000

## 3. Project Skeleton
```
fixrank/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── db.py
│   │   ├── llm.py
│   │   ├── ranking.py
│   │   ├── schemas.py
│   │   ├── vectorstore.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── feedback.py
│   │       ├── health.py
│   │       ├── solve.py
│   │       └── stats.py
│   ├── scripts/
│   │   ├── seed.py
│   │   ├── seed_data.json
│   │   └── test_search.py
│   ├── tests/
│   │   ├── test_api.py
│   │   └── test_ranking.py
│   ├── Dockerfile
│   └── requirements.txt
├── db/
│   └── init/
│       └── 01_schema.sql
├── plan/
│   ├── 00_overview.md
│   ├── 01_phase1_environment.md
│   ├── 02_phase2_db2_memory.md
│   ├── 03_phase3_backend.md
│   ├── 04_phase4_frontend.md
│   ├── 05_phase5_security.md
│   ├── 06_phase6_docker_deployment.md
│   └── guardrails.md
├── src/
│   ├── api/
│   │   └── client.ts
│   ├── components/
│   │   ├── Badge.tsx
│   │   ├── Header.tsx
│   │   ├── ProblemForm.tsx
│   │   ├── SolutionCard.tsx
│   │   ├── SuccessBar.tsx
│   │   └── VoteButtons.tsx
│   ├── lib/
│   │   ├── ranking.ts
│   │   ├── safety.ts
│   │   └── session.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Roadmap.tsx
│   │   └── Stats.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

## 4. Verification Checkpoint
- Python dependencies installed: `fastapi`, `uvicorn`, `langchain-db2`, `langchain-ollama`, `ibm_db`, `python-dotenv`, `pydantic`, `slowapi`.
- Node dependencies installed: `@carbon/icons-react`, `tailwindcss`, `react`, `react-dom`, `motion`.
- `.env.example` provides default configuration without committing sensitive credentials.
