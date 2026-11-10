# FixRank: Master Prompt for IBM Bob

Paste this whole file into IBM Bob first. Then feed it one phase file at a time.

```
Build "FixRank", an AI troubleshooting assistant that ranks fixes by real success rates, storing everything in IBM Db2.

Features: user describes a problem; app returns 3-5 ranked solutions with steps and a "worked for X of Y people" score; Worked / Didn't work buttons update the score; stats dashboard; seeded with sample developer-error problems.

Stack: React + Vite + TS + Tailwind, @carbon/icons-react, no emojis, clean IBM-like UI. FastAPI. langchain-db2 + langchain-ollama (granite4.2:3b, nomic-embed-text:v1.5). Db2 CE on localhost:50000/TESTDB, creds from .env.

Db2: DB2VS table PROBLEMS (COSINE, metadata {category, source}); search k=10, then join to SOLUTIONS via ibm_db with parameterised SQL. Tables SOLUTIONS(id, problem_id, steps, worked, failed, source) and FEEDBACK(id, solution_id, session_id, outcome, created_at).

Ranking: score = similarity x Wilson lower bound of worked/(worked+failed). Cold-start solutions are labelled "AI estimate" until 5+ votes, then "Community verified".

First check my machine and wait for my OK. Build in 6 phases with commands + expected output. Prove each phase before moving on. Never swap Db2 for another store.
```

## Phases

| # | File | Goal |
|---|------|------|
| 1 | phase-1-environment.md | Machine check, tools, models, project skeleton |
| 2 | phase-2-db2-memory.md | Db2 tables, DB2VS vector store, seed data |
| 3 | phase-3-backend.md | FastAPI endpoints and ranking logic |
| 4 | phase-4-frontend.md | React UI |
| 5 | phase-5-security.md | Hardening |
| 6 | phase-6-docker-deployment.md | Docker Compose and README |

## Rules for Bob (apply to every phase)

- Stop at the end of each phase and wait for my "OK".
- Show the exact commands and the expected output.
- Never replace Db2 with SQLite, Postgres, Chroma, FAISS or any other store.
- Check the current langchain-db2 documentation for exact class and method names instead of guessing.
- No emojis in the UI or code comments.
- Secrets only in `.env`.
