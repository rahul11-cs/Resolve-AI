-- ============================================================================
-- IBM Db2 Vector Store Extension for Resolve AI
-- Target: IBM Db2 LUW 12.1.2+ with Native Vector Capability
-- OPTIONAL: The application runs fine in hybrid/in-memory mode without this table.
-- ============================================================================

BEGIN
  DECLARE CONTINUE HANDLER FOR SQLSTATE '42710' BEGIN END;
  EXECUTE IMMEDIATE '
    CREATE TABLE SOLUTION_VECTORS (
      SOLUTION_ID VARCHAR(64) NOT NULL PRIMARY KEY,
      EMBEDDING VECTOR(768, FLOAT32),
      CONSTRAINT FK_VEC_SOLUTION FOREIGN KEY (SOLUTION_ID) REFERENCES SOLUTIONS(ID) ON DELETE CASCADE
    )
  ';
END;
/
