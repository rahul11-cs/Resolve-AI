# Phase 3: Backend (FastAPI)

## Goal
Expose the API: solve, feedback, stats, health, with the Wilson-based ranking.

## Instructions for Bob
Structure inside `backend/app/`: `main.py`, `config.py`, `db.py`, `vectorstore.py`, `ranking.py`, `llm.py`, `schemas.py`, `routes/`.

### Ranking (`ranking.py`)
```python
import math

def wilson_lower_bound(worked: int, failed: int, z: float = 1.96) -> float:
    n = worked + failed
    if n == 0:
        return 0.0
    p = worked / n
    denom = 1 + z**2 / n
    centre = p + z**2 / (2 * n)
    margin = z * math.sqrt((p * (1 - p) + z**2 / (4 * n)) / n)
    return (centre - margin) / denom

def final_score(similarity: float, worked: int, failed: int, prior: float = 0.5) -> float:
    n = worked + failed
    wilson = wilson_lower_bound(worked, failed) if n >= 1 else 0.0
    # Blend with a neutral prior while votes are few so new solutions still appear
    weight = min(n / 5, 1.0)
    quality = weight * wilson + (1 - weight) * prior
    return similarity * quality
```
Label: `"AI estimate"` if `worked + failed < 5`, else `"Community verified"`.

### Endpoints
- `POST /solve` body `{ "query": str }`
  1. Vector search PROBLEMS with k=10.
  2. Fetch linked SOLUTIONS via parameterised `ibm_db` SQL.
  3. Compute `final_score`, sort descending, keep top 5.
  4. Ask the LLM (granite4.2:3b) to rewrite each solution's steps clearly for the user's exact query. The LLM must NOT invent success numbers. Numbers come only from Db2.
  5. Return JSON: `[{solution_id, title, steps, worked, failed, success_rate, score, label}]`.
- `POST /feedback` body `{ "solution_id": int, "outcome": "worked" | "failed", "session_id": str }`
  - Insert into FEEDBACK (unique per solution + session), update WORKED/FAILED in one transaction. Return the updated counts.
- `GET /stats` returns total votes, top 10 solutions by score, and counts of AI-estimate vs community-verified.
- `GET /health` checks the Db2 connection and Ollama reachability.

### Requirements
- Pydantic models for every request and response.
- Parameterised SQL only.
- Config read from `.env` via `config.py`.
- Clear error messages and proper HTTP status codes.
- Unit tests for `ranking.py` (3/3 wins must rank below 90/100 wins).

## Expected output
```bash
uvicorn app.main:app --reload --port 8000
curl -X POST localhost:8000/solve -H "Content-Type: application/json" -d '{"query":"ModuleNotFoundError no module named requests"}'
curl -X POST localhost:8000/feedback -H "Content-Type: application/json" -d '{"solution_id":1,"outcome":"worked","session_id":"demo1"}'
curl localhost:8000/stats
curl localhost:8000/health
```
- `/solve` returns ranked JSON.
- After a vote, `/solve` shows changed counts and score for that solution.
- A repeated vote with the same session returns a clear 409 error.
- `pytest` passes.

## Checkpoint
Show the curl outputs and test results. Wait for my OK before Phase 4.
