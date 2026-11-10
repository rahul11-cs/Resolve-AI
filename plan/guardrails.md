# FixRank Guardrails & Implementation Standards

## 1. Non-Negotiable Engineering Rules
- **Db2 Exclusivity**: Never substitute IBM Db2 with SQLite, PostgreSQL, Chroma, FAISS, or DuckDB. All vector storage (`DB2VS`) and transactional persistence (`SOLUTIONS`, `FEEDBACK`) belong in Db2.
- **Pure Parameterized SQL**: Zero raw string formatting. Every SQL execution must pass parameterized tuples.
- **Statistical Integrity**: Success percentages must never be hallucinated by language models. Ratios and confidence scores originate solely from Db2 vote tallies.
- **Cold-Start Transparency**: Solutions with $<5$ votes must display `"AI estimate"` with no percentage bar. Only solutions with $\ge 5$ votes display `"Community verified"` with confidence metrics.
- **Destructive Command Warnings**: Any solution containing high-consequence operations (`rm -rf`, `chmod 777`, `curl | bash`, `DROP TABLE`, `git push --force`) must trigger an active review alert.
- **IBM Carbon Aesthetic**: Zero emojis anywhere in UI or console outputs. Clean, high-density monochrome layout with IBM Blue (`#0f62fe`), 0px-radius borders, and tabular figures.
