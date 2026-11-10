# Technical Architecture: Resolve AI

## 1. Executive Summary & Core Philosophy

Resolve AI is an empirical developer troubleshooting engine designed to eliminate forum decay and AI hallucinations. Instead of relying on static upvotes from a decade ago or ungrounded generative responses, Resolve AI ranks resolutions by **real-world community verification rates** stored natively in **IBM Db2 on Cloud**, scoring every fix through the **Wilson 95% Confidence Interval Lower Bound** and conversational diagnostics powered by **LangChain Core**.

---

## 2. Unified IBM Db2 Relational & Vector Storage Layer

Unlike fragmented architectures that require a dedicated vector database (Pinecone/Chroma) alongside a transactional relational store, Resolve AI consolidates all state into **IBM Db2**:

```text
+-----------------------------------------------------------------------------------+
|                                  USER QUERY                                       |
|                  "docker engine not running / socket error"                       |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                       STAGE 1: DETERMINISTIC FAST-PATH                            |
|             Exact Error Code Extraction (SQL30082N, EADDRINUSE)                   |
|                       Canonical Synonym Hash Lookup                               |
+-----------------------------------------------------------------------------------+
                                          | (fallback if not exact match)
                                          v
+-----------------------------------------------------------------------------------+
|                        STAGE 2: IBM Db2 VECTOR SEARCH                             |
|          768-dim Dense Embeddings (IBM Granite 278M / nomic-embed)                |
|           Cosine Similarity Evaluation on DB2VS Table (Min Sim: 55.0%)            |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                    TRANSACTIONAL ACID RETRIEVAL (ONE DB)                          |
|         SELECT s.id, s.title, s.steps, stat.worked, stat.failed                   |
|         FROM SOLUTIONS s                                                          |
|         JOIN SOLUTION_STATS stat ON s.id = stat.solution_id                       |
|         WHERE s.problem_id = ?                                                    |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                     WILSON 95% CONFIDENCE RANKING ENGINE                          |
|         Score = Cosine_Similarity * Wilson_Lower_Bound(worked, failed)            |
|         Proves 23/26 (Floor: 71.04%) > Volatile 1/1 (Floor: 20.65%)               |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                    LANGCHAIN CORE CONVERSATIONAL RAG ASSISTANT                    |
|      RunnableSequence[PromptTemplate -> Db2Retriever -> OutputParser]              |
|              Destructive Shell Command Safety Guardrails                          |
+-----------------------------------------------------------------------------------+
```

---

## 3. IBM Db2 Schema Specification

```sql
-- 1. Solutions table
CREATE TABLE SOLUTIONS (
    ID VARCHAR(64) NOT NULL PRIMARY KEY,
    PROBLEM_ID VARCHAR(64) NOT NULL,
    TITLE VARCHAR(255) NOT NULL,
    STEPS CLOB NOT NULL,
    CATEGORY VARCHAR(32) NOT NULL,
    OS_TARGET VARCHAR(16) DEFAULT 'all',
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Transactional Feedback table with unique session constraint
CREATE TABLE FEEDBACK (
    ID BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    SOLUTION_ID VARCHAR(64) NOT NULL,
    SESSION_ID VARCHAR(64) NOT NULL,
    OUTCOME VARCHAR(16) NOT NULL, -- 'worked' or 'failed'
    USER_OS VARCHAR(16) DEFAULT 'all',
    VOTED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT UQ_SOLUTION_SESSION UNIQUE (SOLUTION_ID, SESSION_ID)
);

-- 3. Dynamic Stats View (No hardcoded counters)
CREATE VIEW SOLUTION_STATS AS
SELECT 
    s.ID AS SOLUTION_ID,
    COALESCE(SUM(CASE WHEN f.OUTCOME = 'worked' THEN 1 ELSE 0 END), 0) AS WORKED,
    COALESCE(SUM(CASE WHEN f.OUTCOME = 'failed' THEN 1 ELSE 0 END), 0) AS FAILED,
    COUNT(f.ID) AS TOTAL_VOTES
FROM SOLUTIONS s
LEFT JOIN FEEDBACK f ON s.ID = f.SOLUTION_ID
GROUP BY s.ID;

-- 4. Vector Storage Table
CREATE TABLE DB2VS (
    ID VARCHAR(64) NOT NULL PRIMARY KEY,
    PROBLEM_ID VARCHAR(64) NOT NULL,
    TEXT_CONTENT CLOB NOT NULL,
    EMBEDDING VARBINARY(3072), -- 768 float32 values
    METADATA CLOB
);
```

---

## 4. LangChain Core RAG Chain Integration

Resolve AI employs **LangChain Core** to manage the contextual prompt formulation and retrieval pipeline:

```typescript
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

// Prompt Template enforcing empirical evidence citation
const prompt = PromptTemplate.fromTemplate(`
GROUND TRUTH FROM IBM Db2:
{context}

USER QUERY:
{query}

Generate actionable command steps, cite the Wilson confidence lower bound,
and flag dangerous operations.
`);

const chain = RunnableSequence.from([
  prompt,
  outputParser
]);
```

---

## 5. Mathematical Proof: Wilson Lower Bound

The lower bound $W$ for a 95% confidence interval ($z = 1.96$) is computed as:

$$W = \frac{\hat{p} + \frac{z^2}{2n} - z \sqrt{\frac{\hat{p}(1-\hat{p}) + \frac{z^2}{4n}}{n}}}{1 + \frac{z^2}{n}}$$

Where $\hat{p} = \frac{\text{worked}}{n}$ and $n = \text{worked} + \text{failed}$.

### Empirical Comparison:
- **Sample A (Volatile):** 1 worked, 0 failed ($n=1, \hat{p}=1.0$).  
  $W = 20.65\%$.
- **Sample B (Verified):** 23 worked, 3 failed ($n=26, \hat{p}=0.885$).  
  $W = 71.04\%$.

**Sample B wins the ranking decisively**, protecting developers from cold-start anomalies.
