# Phase 2: Db2 Memory

## Goal
Run Db2, create the relational tables, create the DB2VS vector store for problems, seed data, and prove similarity search works.

## Instructions for Bob
1. Start Db2 Community Edition in Docker (vector support needs a recent Db2 12.1.x image, so verify the current image tag in IBM docs):

```bash
docker run -d --name db2 --privileged=true -p 50000:50000 \
  -e LICENSE=accept -e DB2INSTANCE=db2inst1 \
  -e DB2INST1_PASSWORD=change_me -e DBNAME=TESTDB \
  -v db2data:/database \
  icr.io/db2_community/db2
docker logs -f db2
```
Wait for the "Setup has completed" message (first start takes several minutes).

2. Create relational tables with `ibm_db` (file `db/init/01_schema.sql` plus `backend/app/db.py` helper). Every query must be parameterised.

```sql
CREATE TABLE SOLUTIONS (
  ID INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  PROBLEM_ID VARCHAR(64) NOT NULL,
  STEPS CLOB NOT NULL,
  WORKED INTEGER NOT NULL DEFAULT 0,
  FAILED INTEGER NOT NULL DEFAULT 0,
  SOURCE VARCHAR(32) NOT NULL DEFAULT 'AI_ESTIMATE'
);

CREATE TABLE FEEDBACK (
  ID INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  SOLUTION_ID INTEGER NOT NULL,
  SESSION_ID VARCHAR(64) NOT NULL,
  OUTCOME VARCHAR(8) NOT NULL,
  CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  CONSTRAINT UQ_VOTE UNIQUE (SOLUTION_ID, SESSION_ID),
  FOREIGN KEY (SOLUTION_ID) REFERENCES SOLUTIONS(ID)
);
```

3. Create the vector store in `backend/app/vectorstore.py` using langchain-db2's `DB2VS`:
   - table name `PROBLEMS`
   - distance strategy COSINE
   - embeddings from `OllamaEmbeddings(model=EMBED_MODEL)`
   - each document: `page_content` = the problem text, metadata = `{"category": ..., "source": ..., "problem_id": ...}`
   - Use the exact API from the langchain-db2 docs.

4. Seed 30-50 developer errors in `backend/scripts/seed_data.json` (for example `ModuleNotFoundError`, `CORS error`, `npm ERR! ERESOLVE`, `port already in use`, `Docker daemon not running`, `Git merge conflict`, `permission denied (publickey)`). Each problem has 2-4 solutions with clear numbered steps. Mark all as `AI_ESTIMATE` with WORKED=0, FAILED=0.

5. Write `backend/scripts/seed.py` that inserts problems into DB2VS and solutions into SOLUTIONS. Make it idempotent (safe to run twice).

6. Write `backend/scripts/test_search.py`: search "No module named requests" with k=10 and print the top matches with similarity and their linked solutions.

## Expected output
- `docker ps` shows `db2` healthy.
- `seed.py` prints counts, for example `Inserted 40 problems, 120 solutions`.
- `test_search.py` prints the ModuleNotFoundError problem as the top hit with its solutions.

## Checkpoint
Show the output of each script. Wait for my OK before Phase 3.
