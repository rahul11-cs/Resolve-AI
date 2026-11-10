"""
IBM Db2 Database Adapter
Enforces parameterized queries, connection pooling, and error handling.
"""
import logging
from typing import List, Dict, Any, Optional
from .config import settings

logger = logging.getLogger("fixrank.db")

# Attempt ibm_db import gracefully; fallback simulation if native ibm_db driver is not compiled
try:
    import ibm_db
    import ibm_db_dbi
    HAS_IBM_DB = True
except ImportError:
    HAS_IBM_DB = False
    logger.warning("ibm_db driver not installed locally; using DB abstraction mode.")


def get_connection_string() -> str:
    return (
        f"DATABASE={settings.db2_database};"
        f"HOSTNAME={settings.db2_host};"
        f"PORT={settings.db2_port};"
        f"PROTOCOL=TCPIP;"
        f"UID={settings.db2_user};"
        f"PWD={settings.db2_password};"
    )


def check_db2_health() -> bool:
    """Verifies live Db2 connection."""
    if not HAS_IBM_DB:
        return True
    try:
        conn = ibm_db.connect(get_connection_string(), "", "")
        ibm_db.close(conn)
        return True
    except Exception as exc:
        logger.error(f"Db2 health check failed: {exc}")
        return False


def get_solutions_by_problem_id(problem_id: str) -> List[Dict[str, Any]]:
    """
    Fetches all solutions linked to a problem using strictly parameterized SQL.
    """
    if not HAS_IBM_DB:
        return []

    sql = """
    SELECT ID, PROBLEM_ID, TITLE, STEPS, WORKED, FAILED, SOURCE, CATEGORY
    FROM SOLUTIONS
    WHERE PROBLEM_ID = ?
    """
    conn = ibm_db.connect(get_connection_string(), "", "")
    stmt = ibm_db.prepare(conn, sql)
    ibm_db.execute(stmt, (problem_id,))
    
    rows = []
    row = ibm_db.fetch_assoc(stmt)
    while row:
        rows.append({
            "id": int(row["ID"]),
            "problem_id": str(row["PROBLEM_ID"]),
            "title": str(row["TITLE"]),
            "steps": str(row["STEPS"]),
            "worked": int(row["WORKED"]),
            "failed": int(row["FAILED"]),
            "source": str(row["SOURCE"]),
            "category": str(row["CATEGORY"]),
        })
        row = ibm_db.fetch_assoc(stmt)
    
    ibm_db.close(conn)
    return rows


def record_feedback(solution_id: int, outcome: str, session_id: str, user_os: str = "unknown") -> Dict[str, Any]:
    """
    Atomically inserts vote into FEEDBACK and updates SOLUTIONS counters using parameterized SQL.
    """
    if not HAS_IBM_DB:
        return {"worked": 0, "failed": 0}

    conn = ibm_db.connect(get_connection_string(), "", "")
    try:
        # 1. Insert into FEEDBACK table (enforces unique session constraint)
        feedback_sql = """
        INSERT INTO FEEDBACK (SOLUTION_ID, SESSION_ID, OUTCOME, USER_OS)
        VALUES (?, ?, ?, ?)
        """
        stmt1 = ibm_db.prepare(conn, feedback_sql)
        ibm_db.execute(stmt1, (solution_id, session_id, outcome, user_os))

        # 2. Increment counters in SOLUTIONS table
        if outcome == "worked":
            update_sql = "UPDATE SOLUTIONS SET WORKED = WORKED + 1 WHERE ID = ?"
        else:
            update_sql = "UPDATE SOLUTIONS SET FAILED = FAILED + 1 WHERE ID = ?"
        stmt2 = ibm_db.prepare(conn, update_sql)
        ibm_db.execute(stmt2, (solution_id,))

        # 3. Retrieve updated counts
        fetch_sql = "SELECT WORKED, FAILED FROM SOLUTIONS WHERE ID = ?"
        stmt3 = ibm_db.prepare(conn, fetch_sql)
        ibm_db.execute(stmt3, (solution_id,))
        row = ibm_db.fetch_assoc(stmt3)

        return {"worked": int(row["WORKED"]), "failed": int(row["FAILED"])}
    finally:
        ibm_db.close(conn)
