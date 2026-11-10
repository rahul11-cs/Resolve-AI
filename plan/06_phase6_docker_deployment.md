# Phase 6: Docker Compose & Deployment Pipeline

## 1. Goal
Provide a turn-key multi-container orchestration package capable of booting IBM Db2 Community Edition, the FastAPI backend, the React/Vite UI, and Ollama in a single command.

## 2. Docker Compose Architecture (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  db2:
    image: icr.io/db2_community/db2:latest
    container_name: fixrank-db2
    privileged: true
    ports:
      - "50000:50000"
    environment:
      - LICENSE=accept
      - DB2INSTANCE=db2inst1
      - DB2INST1_PASSWORD=${DB2_PASSWORD:-change_me}
      - DBNAME=TESTDB
    volumes:
      - db2data:/database
      - ./db/init:/var/custom
    healthcheck:
      test: ["CMD-SHELL", "su - db2inst1 -c 'db2 connect to TESTDB' || exit 1"]
      interval: 15s
      timeout: 10s
      retries: 10
      start_period: 120s
    restart: unless-stopped

  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: fixrank-api
    ports:
      - "8000:8000"
    environment:
      - DB2_HOST=db2
      - DB2_PORT=50000
      - DB2_NAME=TESTDB
      - DB2_USER=db2inst1
      - DB2_PASSWORD=${DB2_PASSWORD:-change_me}
      - OLLAMA_BASE_URL=http://ollama:11434
      - LLM_MODEL=granite4.2:3b
      - EMBED_MODEL=nomic-embed-text:v1.5
      - FRONTEND_URL=https://resolve-ai.vercel.app
    depends_on:
      db2:
        condition: service_healthy
    restart: unless-stopped

  ui:
    build:
      context: .
      dockerfile: frontend.Dockerfile
    container_name: fixrank-ui
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=https://your-backend.railway.app
    depends_on:
      - api
    restart: unless-stopped

volumes:
  db2data:
```

## 3. Quickstart Commands
```bash
# Clone and prepare environment
cp .env.example .env

# Launch entire cluster
docker compose up --build -d

# Check cluster health
docker compose ps
curl https://your-backend.railway.app/health
```
