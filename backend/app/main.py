"""
Resolve AI API Application Entry Point
Re-exports the core FastAPI application from backend.main for modular compatibility.
"""
import sys
import os

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from main import (
    app,
    health_check,
    solve_problem,
    submit_vote,
    get_analytics,
    run_benchmark,
    HealthResponse,
    SolveResponse,
    FeedbackResponse,
    AnalyticsResponse
)

__all__ = [
    "app",
    "health_check",
    "solve_problem",
    "submit_vote",
    "get_analytics",
    "run_benchmark"
]
