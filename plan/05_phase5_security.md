# Phase 5: Security Architecture & Dangerous Command Guardrails

## 1. Goal
Harden FixRank against prompt injection, SQL injection, malicious command execution, and ballot manipulation.

## 2. Security Defense Layers

### Layer 1: Strictly Parameterized Database Access
- All `ibm_db` queries execute via prepared statements with bound parameter tuples (`ibm_db.prepare` & `ibm_db.execute`).
- Zero string interpolation (`f"SELECT ..."` or `%s` concatenation).

### Layer 2: Destructive Shell Command Filter (`lib/safety.ts` & `backend/app/ranking.py`)
Developer troubleshooting steps are evaluated for catastrophic commands before presentation to users:
- High-risk patterns flagged:
  - `rm -rf /`, `rm -rf *`, `rm -r`
  - `chmod 777`, `chmod -R 777`
  - `curl | bash`, `wget | sh`, `curl | sudo bash`
  - `git push --force`, `git push -f`
  - `DROP TABLE`, `DROP DATABASE`, `TRUNCATE`
  - `mkfs`, `dd if=/dev/zero`
- When detected, the UI displays a high-contrast IBM Carbon Warning banner: `"Review before running: step contains destructive file system or permission modifications"`.

### Layer 3: Secret Redaction & Privacy
- User queries are scanned for accidental pastes containing API tokens, bearer keys, private RSA keys, or passwords.
- PII and credentials are sanitized before logging or vector search submission.

### Layer 4: Vote Tampering & Ballot Stuffing Protection
- Session-based unique constraint on `(SOLUTION_ID, SESSION_ID)` in Db2.
- Duplicate vote requests return `409 Conflict`.
- Demo votes injected for testing are tagged with `SOURCE = 'DEMO'` and visually labeled.

### Layer 5: Prompt Injection Quarantine
- When rewrites are processed by LLM (`granite4.2:3b`), query strings are enclosed in strict XML delimiters `<user_query>` and `<solution_steps>`.
- System instructions forbid LLM from generating or altering numerical success metrics. All metrics originate exclusively from Db2.
