# Phase 2: IBM Db2 Vector & Relational Storage

## 1. Goal
Provision IBM Db2 Community Edition, define normalized schemas with strict foreign keys and unique constraints, initialize the `DB2VS` vector table for developer problems, and seed 40+ error signatures.

## 2. Relational Schema (`db/init/01_schema.sql`)

```sql
-- IBM Db2 DDL for FixRank Solutions and Community Feedback

CREATE TABLE SOLUTIONS (
  ID INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  PROBLEM_ID VARCHAR(64) NOT NULL,
  TITLE VARCHAR(255) NOT NULL,
  STEPS CLOB NOT NULL,
  WORKED INTEGER NOT NULL DEFAULT 0,
  FAILED INTEGER NOT NULL DEFAULT 0,
  SOURCE VARCHAR(32) NOT NULL DEFAULT 'AI_ESTIMATE',
  CATEGORY VARCHAR(64) DEFAULT 'GENERAL',
  CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE FEEDBACK (
  ID INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  SOLUTION_ID INTEGER NOT NULL,
  SESSION_ID VARCHAR(64) NOT NULL,
  OUTCOME VARCHAR(8) NOT NULL,
  USER_OS VARCHAR(32) DEFAULT 'UNKNOWN',
  CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT UQ_VOTE UNIQUE (SOLUTION_ID, SESSION_ID),
  CONSTRAINT FK_SOLUTION FOREIGN KEY (SOLUTION_ID) REFERENCES SOLUTIONS(ID) ON DELETE CASCADE
);

CREATE INDEX IDX_SOLUTIONS_PROB ON SOLUTIONS(PROBLEM_ID);
CREATE INDEX IDX_FEEDBACK_SOL ON FEEDBACK(SOLUTION_ID);
```

## 3. Vector Store Configuration (`backend/app/vectorstore.py`)
- Target Table: `PROBLEMS`
- Distance Metric: `DistanceStrategy.COSINE`
- Embedding Dimension: 768 (`nomic-embed-text:v1.5`)
- Metadata Schema:
  ```json
  {
    "problem_id": "ERR_PY_REQ_001",
    "category": "python",
    "source": "SEED_DATA",
    "tags": ["ModuleNotFoundError", "pip", "virtualenv"]
  }
  ```

## 4. Cold-Start Seeding Strategy
- 40+ developer problems covering Python, Node.js, Docker, Git, Linux system errors, Db2 SQL errors, and web networking (CORS).
- Each problem contains 2 to 4 distinct resolution pathways with explicit step-by-step shell commands.
- Initial state: `WORKED = 0`, `FAILED = 0`, labeled `"AI estimate"`.
