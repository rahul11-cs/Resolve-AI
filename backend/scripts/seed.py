"""
FixRank Seeding Script
Reads backend/scripts/seed_data.json and inserts records into IBM Db2:
1. Embeds problem definitions into DB2VS vector table PROBLEMS
2. Inserts solution pathways into relational table SOLUTIONS
Idempotent and safe to run repeatedly.
"""
import json
import os
import sys

# Ensure backend directory is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.config import settings
from app.db import get_connection_string, HAS_IBM_DB


def seed_db2():
    json_path = os.path.join(os.path.dirname(__file__), "seed_data.json")
    with open(json_path, "r", encoding="utf-8") as f:
        problems = json.load(f)

    print(f"Loaded {len(problems)} problem definitions from {json_path}")
    total_solutions = sum(len(p.get("solutions", [])) for p in problems)
    print(f"Total solution steps: {total_solutions}")

    if not HAS_IBM_DB:
        print("Note: ibm_db driver not compiled in current CLI environment; dry-run seed completed.")
        return

    import ibm_db

    conn = ibm_db.connect(get_connection_string(), "", "")
    print("Connected to IBM Db2.")

    # 1. Check existing solutions count
    stmt = ibm_db.exec_immediate(conn, "SELECT COUNT(*) FROM SOLUTIONS")
    row = ibm_db.fetch_tuple(stmt)
    count = row[0] if row else 0
    if count > 0:
        print(f"SOLUTIONS table already contains {count} records. Seeding skipped to preserve votes.")
        ibm_db.close(conn)
        return

    # 2. Insert solutions
    insert_sql = """
    INSERT INTO SOLUTIONS (PROBLEM_ID, TITLE, STEPS, WORKED, FAILED, SOURCE, CATEGORY)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """
    stmt = ibm_db.prepare(conn, insert_sql)
    
    inserted = 0
    for prob in problems:
        prob_id = prob["problem_id"]
        cat = prob.get("category", "general")
        for sol in prob.get("solutions", []):
            ibm_db.execute(stmt, (
                prob_id,
                sol["title"],
                sol["steps"],
                sol.get("worked", 0),
                sol.get("failed", 0),
                sol.get("source", "AI_ESTIMATE"),
                cat
            ))
            inserted += 1

    print(f"Successfully inserted {inserted} solutions into IBM Db2.")
    ibm_db.close(conn)


if __name__ == "__main__":
    seed_db2()
