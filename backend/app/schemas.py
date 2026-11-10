"""
Pydantic Schemas for FixRank API Request and Response Payloads.
Enforces strict character limits, sanitization, and output structure.
"""
from typing import List, Optional
from pydantic import BaseModel, Field, constr


class SolveRequest(BaseModel):
    query: constr(min_length=3, max_length=1000) = Field(
        ...,
        description="The developer error message or troubleshooting query",
        example="ModuleNotFoundError: No module named requests"
    )
    user_os: Optional[str] = Field(default="all", max_length=32)


class SolutionItem(BaseModel):
    solution_id: int
    problem_id: str
    title: str
    steps: str
    worked: int
    failed: int
    total_votes: int
    success_rate: float
    wilson_lower_bound: float
    score: float
    similarity: float
    label: str
    category: str
    has_dangerous_commands: bool = False
    source: str = "AI_ESTIMATE"


class SolveResponse(BaseModel):
    query: str
    matched_problem: Optional[str] = None
    similarity: float
    total_found: int
    solutions: List[SolutionItem]


class FeedbackRequest(BaseModel):
    solution_id: int
    outcome: constr(pattern="^(worked|failed)$")
    session_id: constr(min_length=4, max_length=64)
    user_os: Optional[str] = "unknown"


class FeedbackResponse(BaseModel):
    success: bool
    solution_id: int
    outcome: str
    worked: int
    failed: int
    total_votes: int
    label: str
    message: str


class StatsResponse(BaseModel):
    total_problems: int
    total_solutions: int
    total_votes: int
    total_worked: int
    total_failed: int
    verified_solutions_count: int
    estimate_solutions_count: int
    average_confidence: float
    top_solutions: List[SolutionItem]


class HealthResponse(BaseModel):
    status: str
    database: str
    embeddings: str
    db2_connected: bool
    db2_host: Optional[str] = None
    ollama_reachable: bool = True
    ollama_model: str = "ibm-granite/granite-3.0-8b-instruct"
