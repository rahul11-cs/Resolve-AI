# Phase 6: Docker and Deployment

## Goal
Run the whole app with one command: `docker compose up --build`.

## Instructions for Bob

### Services
| Service | Image / Build | Port |
|---------|---------------|------|
| db2 | icr.io/db2_community/db2 | 50000 |
| api | ./backend (Dockerfile) | 8000 |
| ui | ./frontend (multi-stage, nginx) | 3000 |
| ollama (optional) | ollama/ollama | 11434 |

### Backend Dockerfile (`backend/Dockerfile`)
- Base `python:3.11-slim`, install system libs needed by `ibm_db` (check its docs), install `requirements.txt`, run as a non-root user, start with `uvicorn app.main:app --host 0.0.0.0 --port 8000`.

### Frontend Dockerfile (`frontend/Dockerfile`)
- Stage 1: `node:20-alpine`, `npm ci`, `npm run build`.
- Stage 2: `nginx:alpine`, copy `dist` to the nginx html folder, add an `nginx.conf` that serves the SPA (fallback to `index.html`).

### docker-compose.yml requirements
- `db2` with `privileged: true`, env from `.env`, named volume `db2data`, and a **healthcheck** (for example a `db2 connect to TESTDB` command, generous `start_period` since first boot is slow).
- `api` has `depends_on: db2: condition: service_healthy`, reads `.env`, uses `DB2_HOST=db2` and `OLLAMA_BASE_URL` pointing to the host's Ollama (`http://host.docker.internal:11434`) or the `ollama` service.
- `ui` depends on `api`.
- Init job or startup script: runs `01_schema.sql` and `seed.py` only if tables are empty (idempotent).
- Restart policy `unless-stopped`.
- If the `ollama` service is included, add a one-time model pull for `granite4.2:3b` and `nomic-embed-text:v1.5`.

### README.md
Include: project summary, architecture diagram (ASCII or Mermaid), prerequisites, quick start, env variables table, how ranking works (Wilson score explained simply), API reference, demo script, troubleshooting (Db2 slow first start, port conflicts, Ollama connection), and security notes.

### Demo script (put in README)
1. Ask: "ModuleNotFoundError: No module named requests".
2. Show the ranked solutions with "AI estimate" badges.
3. Vote Worked on one solution several times using different sessions (or a seed script), and show it climb the ranking and flip to "Community verified".
4. Open the Stats page.

## Expected output
```bash
docker compose down -v
docker compose up --build
docker compose ps        # all services healthy / running
curl localhost:8000/health
```
- UI opens at `http://localhost:3000`.
- The full flow works from a clean start with no manual steps.
- Restarting with `docker compose restart` keeps the votes (volume persists).

## Checkpoint
Show `docker compose ps`, the health check output, and a screenshot description of the working UI. Then summarize the project and list any known limitations.
