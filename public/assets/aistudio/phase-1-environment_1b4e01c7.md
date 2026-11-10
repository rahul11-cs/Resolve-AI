# Phase 1: Environment

## Goal
Confirm my machine can run the stack, install every tool and model, and create the project skeleton.

## Instructions for Bob
1. **Check my machine first and report back, then wait for my OK:**
   - OS, total RAM, free disk space
   - Docker (and whether Docker Desktop is running)
   - Python 3.11+, Node 20+, npm, git
   - Ollama installed and running
2. If RAM is 8 GB or less, tell me and propose lighter settings (smaller model, limiting Db2 memory) before continuing.
3. Create this structure:

```
fixrank/
  backend/
    app/
    scripts/
    requirements.txt
  frontend/
  db/
    init/
  .env
  .env.example
  .gitignore
  docker-compose.yml   (placeholder, completed in Phase 6)
  README.md
```

4. Create `.env.example` (and a real `.env` copied from it):

```
DB2_HOST=localhost
DB2_PORT=50000
DB2_NAME=TESTDB
DB2_USER=db2inst1
DB2_PASSWORD=change_me
OLLAMA_BASE_URL=http://localhost:11434
LLM_MODEL=granite4.2:3b
EMBED_MODEL=nomic-embed-text:v1.5
FRONTEND_ORIGIN=http://localhost:5173
```

5. `.gitignore` must include `.env`, `node_modules`, `__pycache__`, `.venv`, `dist`.
6. Pull models:

```bash
ollama pull granite4.2:3b
ollama pull nomic-embed-text:v1.5
ollama list
```

7. Create a venv and install dependencies:

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate    Mac/Linux: source .venv/bin/activate
pip install fastapi "uvicorn[standard]" langchain-db2 langchain-ollama ibm_db python-dotenv pydantic slowapi
pip freeze > requirements.txt
```

## Expected output
- `ollama list` shows both models.
- `python -c "import fastapi, langchain_db2, langchain_ollama, ibm_db; print('ok')"` prints `ok`.
- Folder structure exists and `.env` is ignored by git.

## Checkpoint
Show me the results of the machine check and each command, then wait for my OK before Phase 2.
