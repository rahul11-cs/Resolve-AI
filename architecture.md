# FixRank: System Architecture & Data Flow

```
+-----------------------------------------------------------------------------------------+
|                                    FIXRANK ARCHITECTURE                                 |
+-----------------------------------------------------------------------------------------+

           USER / ENGINEER BROWSER
                     |
                     |  [1. Query Error Text]
                     v
   +------------------------------------+
   |   React 19 + Carbon Design SPA     |  <-- IBM Carbon Design, Zero Emojis
   |   (IBM Plex Sans / Mono, Tailwind) |  <-- Strict Honest Labeling, Instant Voting
   +------------------------------------+
                     |
                     |  [2. POST /api/solve {query, os}]
                     v
   +------------------------------------+
   |   FastAPI Service (Python 3.11)    |
   |   - SlowAPI Rate Limiting          |
   |   - Input Sanitization & Secret Red|
   |   - Dangerous Command Filter       |
   +------------------------------------+
          |                       |
 [3. Embed Query]        [4. Cosine Vector Search]
          |                       |
          v                       v
   +-------------------+  +-------------------------------------------------------+
   | Ollama Embeddings |  | IBM Db2 12.1.x Community Edition                      |
   | (nomic-embed-text)|  |                                                       |
   +-------------------+  |   TABLE PROBLEMS (DB2VS Vector Store)                 |
                          |   - Embeddings (768-dim, COSINE Distance)             |
                          |   - Metadata {category, problem_id, source}           |
                          |                                                       |
                          |   TABLE SOLUTIONS (Relational, Parameterized SQL)     |
                          |   - ID, PROBLEM_ID, TITLE, STEPS, WORKED, FAILED      |
                          |                                                       |
                          |   TABLE FEEDBACK (Audit Trail & Deduplication)        |
                          |   - ID, SOLUTION_ID, SESSION_ID (UNIQUE), OUTCOME     |
                          +-------------------------------------------------------+
                                                  |
                          +-----------------------+
                          |
                          v
   +---------------------------------------------------------------------+
   | Wilson 95% Confidence Lower Bound Ranking Engine                    |
   | - Blends 0.5 neutral prior during cold start (< 5 votes)            |
   | - Calculates quality score: weight * Wilson + (1-weight) * Prior    |
   | - Produces final composite score: Similarity x Quality              |
   | - Assigns honest labels: "AI estimate" vs "Community verified"      |
   +---------------------------------------------------------------------+
                          |
                          | [5. Ranked 3-5 Solutions Payload]
                          v
   +------------------------------------+
   | Frontend Result Cards Display      |
   | - Rank index (#01, #02, #03)       |
   | - "Worked for X of Y engineers"    |
   | - High-contrast Warning on danger  |
   | - Worked / Didn't work vote action |
   +------------------------------------+
```

---

## Database Schemas in IBM Db2

### 1. `PROBLEMS` Table (DB2VS Vector Store)
- Vector column: `EMBEDDING VECTOR(768, FLOAT32)`
- Distance metric: `DistanceStrategy.COSINE`
- Metadata: `{"problem_id": "...", "category": "...", "source": "SEED_DATA"}`

### 2. `SOLUTIONS` Table (Relational)
```sql
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
```

### 3. `FEEDBACK` Table (Audit & Session Isolation)
```sql
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
```
