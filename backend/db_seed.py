"""
Resolve AI Database Seeding Engine
Inserts canonical troubleshooting fixes from backend/seed.py into IBM Db2 SOLUTIONS table.
Guarantees strict idempotency: inserts only if ID does not already exist.
Vote counts are NOT seeded; all vote counts start at zero.
"""
import os
import sys
import json
import logging

# Ensure backend directory is in path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from seed import FIXES

logger = logging.getLogger("resolveai.db_seed")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")


def get_db2_connection_string():
    host = os.getenv("DB2_HOST", "")
    port = os.getenv("DB2_PORT", "50000")
    database = os.getenv("DB2_DATABASE") or os.getenv("DB2_NAME", "BLUDB")
    user = os.getenv("DB2_USER", "db2inst1")
    password = os.getenv("DB2_PASSWORD", "")
    security = os.getenv("DB2_SECURITY") or os.getenv("DB2_SSL", "")

    conn_str = (
        f"DATABASE={database};"
        f"HOSTNAME={host};"
        f"PORT={port};"
        f"PROTOCOL=TCPIP;"
        f"UID={user};"
        f"PWD={password};"
    )
    if security.upper() in ("SSL", "TRUE", "1"):
        conn_str += "SECURITY=SSL;"
    return conn_str


def seed_solutions(conn=None) -> int:
    """
    Inserts fixes into SOLUTIONS table only if they do not already exist.
    STEPS is serialized as a JSON array of strings.
    Zero vote rows are inserted into FEEDBACK.
    """
    close_after = False
    if conn is None:
        try:
            import ibm_db
        except ImportError:
            logger.warning("ibm_db driver not installed; database seeding cannot connect to Db2.")
            return 0

        host = os.getenv("DB2_HOST")
        if not host:
            logger.info("DB2_HOST not set; skipping live Db2 database seeding.")
            return 0

        conn_str = get_db2_connection_string()
        try:
            conn = ibm_db.connect(conn_str, "", "")
            close_after = True
            logger.info("Connected to IBM Db2 for seeding.")
        except Exception as exc:
            logger.error(f"Failed to connect to IBM Db2 for seeding: {exc}")
            return 0

    try:
        import ibm_db
        check_sql = "SELECT ID FROM SOLUTIONS WHERE ID = ?"
        check_stmt = ibm_db.prepare(conn, check_sql)

        insert_sql = """
        INSERT INTO SOLUTIONS (ID, TECH, ERROR_CODE, ERROR_TYPE, TITLE, SEARCH_TEXT, STEPS, SOURCE)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """
        insert_stmt = ibm_db.prepare(conn, insert_sql)

        inserted_count = 0
        skipped_count = 0

        for fix in FIXES:
            fix_id = str(fix["id"])
            ibm_db.execute(check_stmt, (fix_id,))
            existing = ibm_db.fetch_assoc(check_stmt)

            if existing:
                skipped_count += 1
                continue

            steps_json = json.dumps(fix.get("steps", []))
            ibm_db.execute(insert_stmt, (
                fix_id,
                str(fix.get("tech", "General")),
                str(fix.get("code", "")),
                str(fix.get("etype", "General")),
                str(fix.get("title", "")),
                str(fix.get("text", "")),
                steps_json,
                str(fix.get("source", "AI_ESTIMATE"))
            ))
            inserted_count += 1

        logger.info(f"Seeding completed: {inserted_count} inserted, {skipped_count} already existed.")
        return inserted_count
    finally:
        if close_after and conn:
            ibm_db.close(conn)


if __name__ == "__main__":
    count = seed_solutions()
    print(f"Db2 seeding process finished. Total newly inserted solutions: {count}")
