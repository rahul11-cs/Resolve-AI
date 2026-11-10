# Phase 3: Backend API & Wilson Ranking Engine

## 1. Goal
Expose high-performance RESTful endpoints using FastAPI, enforce parameterized SQL queries through `ibm_db`, and calculate statistically reliable rankings with the Wilson Lower Bound algorithm.

## 2. Statistical Ranking Algorithm (`ranking.py`)

Raw percentage ratios fail in community triage because an unverified fix with $1 / 1$ ($100\%$) would outrank a robust battle-tested solution with $95 / 100$ ($95\%$). FixRank uses the **Wilson 95% Confidence Interval Lower Bound**:

$$p = \frac{\text{worked}}{n}, \quad n = \text{worked} + \text{failed}, \quad z = 1.96$$
$$\text{Denominator} = 1 + \frac{z^2}{n}$$
$$\text{Centre} = p + \frac{z^2}{2n}$$
$$\text{Margin} = z \cdot \sqrt{\frac{p(1 - p) + \frac{z^2}{4n}}{n}}$$
$$\text{WilsonLowerBound} = \frac{\text{Centre} - \text{Margin}}{\text{Denominator}}$$

### Dynamic Prior Blending
To prevent complete starvation of newly seeded solutions before initial votes are collected:
$$\text{Weight} = \min\left(\frac{n}{5}, 1.0\right)$$
$$\text{Quality} = \text{Weight} \cdot \text{WilsonLowerBound} + (1 - \text{Weight}) \cdot \text{Prior}$$
$$\text{FinalScore} = \text{CosineSimilarity} \times \text{Quality}$$

## 3. Endpoints Specification

### `POST /solve`
- **Request Body**: `{"query": str, "os": Optional[str]}`
- **Processing**:
  1. Vector search against `PROBLEMS` using cosine similarity ($k=10$).
  2. Parameterized query fetching linked rows from `SOLUTIONS`.
  3. Wilson quality score computation and ranking.
  4. Top 5 solutions returned with exact fractional scores and dynamic labels.

### `POST /feedback`
- **Request Body**: `{"solution_id": int, "outcome": "worked" | "failed", "session_id": str, "os": Optional[str]}`
- **Processing**:
  1. Atomically insert vote into `FEEDBACK` (enforces `UQ_VOTE`).
  2. Increment `WORKED` or `FAILED` in `SOLUTIONS`.
  3. Duplicate attempt within the same session returns `HTTP 409 Conflict`.

### `GET /stats`
- Summary metrics: total problems, total verified vs. estimate fixes, average community confidence, top 10 ranked solutions leaderboard.

### `GET /health`
- Connectivity check verifying Db2 database readiness and Ollama status.
