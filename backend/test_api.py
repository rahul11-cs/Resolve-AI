"""
Resolve AI - API Integration and Retrieval Test Suite
Tests in-memory execution path:
1. Health endpoint returns not_configured and memory vector store.
2. Solve endpoint retrieves ranked fixes for 'docker engine not running'.
3. Vote endpoint records votes and rejects duplicates with HTTP 409.
4. Benchmark endpoint evaluates 20 ground-truth query vectors.
5. Analytics endpoint aggregates category distributions and latency metrics.
"""
import os
import sys
import unittest

# Ensure backend directory is in path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from fastapi.testclient import TestClient
from main import app, IN_MEMORY_FEEDBACK, IN_MEMORY_SEARCH_LOGS


class TestResolveAIAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Force in-memory mode for tests
        if "DB2_HOST" in os.environ:
            del os.environ["DB2_HOST"]
        cls.client = TestClient(app)

    def setUp(self):
        # Clear in-memory state before each test
        IN_MEMORY_FEEDBACK.clear()
        IN_MEMORY_SEARCH_LOGS.clear()

    def test_health_in_memory(self):
        """1. Health check returns healthy, database=not_configured, vector_store=memory."""
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["database"], "not_configured")
        self.assertFalse(data["db2_connected"])
        self.assertEqual(data["vector_store"], "memory")
        self.assertIsNone(data["db2_host"])

    def test_solve_docker_engine_not_running(self):
        """2. Solve returns results for 'docker engine not running' above 0.55 threshold."""
        payload = {"query": "docker engine not running", "user_os": "all"}
        response = self.client.post("/solve", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertGreater(data["total_found"], 0)
        self.assertGreaterEqual(data["similarity"], 0.55)
        self.assertTrue(len(data["solutions"]) > 0)

        # Top solution should address Docker engine/service
        top_sol = data["solutions"][0]
        self.assertIn("docker", top_sol["category"].lower())
        self.assertIn("docker-engine-001", top_sol["id"])
        self.assertTrue("engine" in top_sol["title"].lower() or "service" in top_sol["title"].lower())
        self.assertFalse(top_sol["has_dangerous_commands"])

    def test_vote_recorded_once_and_duplicate_flagged(self):
        """3. Vote is recorded once and duplicate vote in same session returns HTTP 409."""
        sol_id = "docker-engine-001"
        session_id = "session-test-uuid-001"

        # First vote: worked
        vote_payload = {
            "solution_id": sol_id,
            "outcome": "worked",
            "session_id": session_id,
            "user_os": "linux"
        }
        res1 = self.client.post("/vote", json=vote_payload)
        self.assertEqual(res1.status_code, 200)
        data1 = res1.json()
        self.assertTrue(data1["success"])
        self.assertEqual(data1["worked"], 1)
        self.assertEqual(data1["failed"], 0)
        self.assertEqual(data1["total_votes"], 1)

        # Second duplicate vote in same session must return HTTP 409
        res2 = self.client.post("/vote", json=vote_payload)
        self.assertEqual(res2.status_code, 409)
        self.assertIn("already submitted feedback", res2.json()["detail"].lower())

        # Third vote from a distinct session: failed
        session_id_2 = "session-test-uuid-002"
        vote_payload_2 = {
            "solution_id": sol_id,
            "outcome": "failed",
            "session_id": session_id_2,
            "user_os": "macos"
        }
        res3 = self.client.post("/vote", json=vote_payload_2)
        self.assertEqual(res3.status_code, 200)
        data3 = res3.json()
        self.assertEqual(data3["worked"], 1)
        self.assertEqual(data3["failed"], 1)
        self.assertEqual(data3["total_votes"], 2)

    def test_benchmark_returns_20_rows(self):
        """4. Benchmark returns exactly 20 ground-truth evaluation rows with high accuracy."""
        response = self.client.get("/benchmark")
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data["total_queries"], 20)
        self.assertEqual(len(data["results"]), 20)
        self.assertGreaterEqual(data["top1_accuracy"], 90.0)

        # Verify each row has valid evaluation structure
        for row in data["results"]:
            self.assertIn("id", row)
            self.assertIn("query", row)
            self.assertIn("similarity", row)
            self.assertIn("latency_ms", row)
            self.assertIn("is_top1_match", row)
            self.assertTrue(row["is_top1_match"])

    def test_analytics_aggregation(self):
        """5. Analytics endpoint aggregates category distributions and vote counts."""
        # Perform a search to generate a search log
        self.client.post("/solve", json={"query": "pip install requests"})

        # Submit a vote
        self.client.post("/vote", json={
            "solution_id": "py-requests-001",
            "outcome": "worked",
            "session_id": "sess-analytics-1",
            "user_os": "linux"
        })

        response = self.client.get("/analytics")
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertGreater(data["searches"], 0)
        self.assertEqual(data["total_votes"], 1)
        self.assertIn("Python", data["by_category"])
        self.assertIn("Db2", data["by_category"])
        self.assertIn("Docker", data["by_category"])


if __name__ == "__main__":
    unittest.main()
