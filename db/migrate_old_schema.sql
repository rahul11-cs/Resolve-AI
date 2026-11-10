-- ============================================================================
-- Migration Script: Old Schema (INTEGER SOLUTION_ID) -> New Schema (VARCHAR(64))
-- Target: IBM Db2 LUW 12.1+
-- NOTE: Do NOT drop tables silently. Review this script and execute manually.
-- ============================================================================

-- Step 1: Check existing tables
-- If you previously ran db/init/01_schema.sql where:
--   SOLUTIONS.ID was INTEGER
--   FEEDBACK.SOLUTION_ID was INTEGER
-- You must migrate existing vote records to the new VARCHAR(64) slug IDs.

-- Step 2: Backup old tables before modification
-- RENAME TABLE FEEDBACK TO FEEDBACK_LEGACY_BACKUP;
-- RENAME TABLE SOLUTIONS TO SOLUTIONS_LEGACY_BACKUP;

-- Step 3: Run the new schema
-- db2 -tvf db/schema.sql

-- Step 4: Optional data migration if old IDs map to new slugs
-- Example:
-- INSERT INTO FEEDBACK (SOLUTION_ID, SESSION_ID, OUTCOME, USER_OS, CREATED_AT)
-- SELECT 
--   CASE old.SOLUTION_ID
--     WHEN 1 THEN 'py-req-001'
--     WHEN 2 THEN 'py-req-002'
--     WHEN 3 THEN 'py-req-003'
--     WHEN 4 THEN 'node-port-001'
--     WHEN 5 THEN 'node-port-002'
--     WHEN 6 THEN 'node-port-003'
--     WHEN 7 THEN 'npm-resolve-001'
--     WHEN 8 THEN 'docker-engine-001'
--     WHEN 9 THEN 'git-conflict-001'
--     WHEN 10 THEN 'db2-30082'
--     ELSE 'unknown'
--   END AS SOLUTION_ID,
--   old.SESSION_ID,
--   old.OUTCOME,
--   old.USER_OS,
--   old.CREATED_AT
-- FROM FEEDBACK_LEGACY_BACKUP old
-- WHERE old.SOLUTION_ID IN (SELECT CAST(ID AS INTEGER) FROM SOLUTIONS_LEGACY_BACKUP);

-- Step 5: Verify migration
-- SELECT COUNT(*) AS MIGRATED_VOTES FROM FEEDBACK;
-- SELECT * FROM SOLUTION_STATS;

-- Step 6: Drop backup tables only after verifying application integrity
-- DROP TABLE FEEDBACK_LEGACY_BACKUP;
-- DROP TABLE SOLUTIONS_LEGACY_BACKUP;
