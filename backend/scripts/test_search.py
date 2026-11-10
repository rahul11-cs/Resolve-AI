"""
FixRank Search Test Script
Simulates k=10 search for "No module named requests" and displays ranked results.
"""
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.ranking import compute_metrics


def test_search():
    query = "No module named requests"
    print(f"Executing FixRank Vector Search for query: '{query}'")
    print("-" * 60)
    
    # Demonstration of ranked output based on seed data
    results = [
        {"title": "Install requests package in current active environment", "worked": 42, "failed": 2, "sim": 0.95},
        {"title": "Explicitly invoke pip with python3 module flag", "worked": 19, "failed": 1, "sim": 0.92},
        {"title": "Recreate corrupted Python virtual environment", "worked": 0, "failed": 0, "sim": 0.88},
    ]

    for rank, res in enumerate(results, 1):
        m = compute_metrics(res["worked"], res["failed"], res["sim"])
        print(f"#{rank} [{m['label'].upper()}] {res['title']}")
        print(f"   Similarity: {res['sim']:.2f} | Wilson Bound: {m['wilson_lower_bound']:.3f} | Score: {m['score']:.4f}")
        print(f"   Votes: Worked={m['worked']}, Failed={m['failed']} (Success: {m['success_rate']}%)")
        print()


if __name__ == "__main__":
    test_search()
