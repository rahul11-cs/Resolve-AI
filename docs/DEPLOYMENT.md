# Resolve AI - Production Deployment & IBM Db2 Setup Guide

This guide details the exact steps to provision and deploy Resolve AI with IBM Db2 as the source of truth for fixes, votes, and search analytics.

---

## 1. Database Provisioning & Schema Setup

Resolve AI requires IBM Db2 LUW 12.1+ or IBM Db2 on Cloud.

### Step 1: Execute Primary Schema
Open the IBM Cloud Db2 web console (or the local Db2 CLP command line) and run `db/schema.sql`:

```bash
# Via Db2 Command Line Processor (CLP)
db2 connect to BLUDB user resolve_app using 'your_db2_password'
db2 -td/ -vf db/schema.sql
```

Or copy the contents of `db/schema.sql` directly into the SQL Editor of the **IBM Db2 Web Console** and execute.

This creates:
- `SOLUTIONS`: Canonical and community fixes keyed by slug (`ID VARCHAR(64)`).
- `FEEDBACK`: Community votes with a unique constraint on `(SOLUTION_ID, SESSION_ID)`.
- `SEARCH_LOG`: Real-time query telemetry and latency audit table.
- Indexes: `IDX_SOL_TECH`, `IDX_SOL_ERRCODE`, `IDX_FDB_SOLID`, `IDX_SLOG_CREATED`.
- View: `SOLUTION_STATS`: Computes `WORKED`, `FAILED`, `VOTES`, and `LAST_VERIFIED` dynamically via `LEFT JOIN`.

### Step 2: (Optional) Native Vector Extension
If running IBM Db2 LUW 12.1.2+ with native vector capabilities, run `db/schema_vectors.sql`:

```bash
db2 -td/ -vf db/schema_vectors.sql
```

*Note: The application functions in hybrid vector mode if this table is omitted.*

### Step 3: (If Migrating from Legacy Integer Schema)
If your Db2 instance previously ran `db/init/01_schema.sql` where `FEEDBACK.SOLUTION_ID` was an `INTEGER`:
Do NOT drop tables silently. Refer to `db/migrate_old_schema.sql` to back up legacy data and migrate vote rows to the new text slug format.

---

## 2. Environment Configuration

Configure production environment variables in your deployment environment (e.g., Railway, Render, or Docker):

```ini
# IBM Db2 on Cloud Configuration
DB2_HOST=dashdb-enterprise-yp-dal12.services.dal.bluemix.net
DB2_PORT=50001
DB2_DATABASE=BLUDB
DB2_USER=resolve_app
DB2_PASSWORD=your_secure_db2_password
DB2_SECURITY=SSL

# Application Configuration
FRONTEND_ORIGIN=http://localhost:3000
PORT=8000
```

*Note: When `DB2_HOST` is unset or empty, the backend runs in standalone in-memory mode for local development and test runners.*

---

## 3. Starting the API Backend

Install dependencies and start the Uvicorn server:

```bash
# Install dependencies
pip install -r backend/requirements.txt

# Start API service
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

On initial startup with an empty `SOLUTIONS` table, Resolve AI will automatically seed the canonical developer fixes via `backend/db_seed.py`. Vote counts will start at zero with no fabricated community data.

---

## 4. Verification & Health Checks

Verify your deployment against the live API endpoints:

```bash
# 1. Health check (verifies live connection to SYSIBM.SYSDUMMY1)
curl http://localhost:8000/health
# Expected: {"status": "healthy", "database": "connected", "vector_store": "db2", ...}

# 2. Test semantic solve
curl -X POST http://localhost:8000/api/solve \
  -H "Content-Type: application/json" \
  -d '{"query": "docker engine not running"}'

# 3. Test vote submission
curl -X POST http://localhost:8000/api/vote \
  -H "Content-Type: application/json" \
  -d '{"solution_id": "docker-service-001", "outcome": "worked", "session_id": "sess-verify-1"}'

# 4. Test analytics telemetry
curl http://localhost:8000/api/analytics
```
