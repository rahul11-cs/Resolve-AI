"""
FixRank Statistical Ranking Engine
Calculates Wilson Lower Bound (95% confidence), real feature-vector cosine similarity,
and honest labeling (Demo data vs Community verified).
"""
import math
import re
from typing import Optional, Dict, Any, List

MIN_SIMILARITY_THRESHOLD = 0.55


def split_tokens(text: str) -> List[str]:
    expanded = re.sub(r"([a-z])([A-Z])", r"\1 \2", text)
    return [w for w in re.sub(r"[^a-zA-Z0-9]", " ", expanded.lower()).split() if w]


def compute_vector_features(text: str) -> Dict[str, float]:
    """Tokenizes text into word tokens and character trigrams for vector similarity."""
    features: Dict[str, float] = {}
    words = split_tokens(text)

    for w in words:
        if len(w) > 1:
            weight = 1.5 if len(w) > 3 else 1.0
            features[f"w:{w}"] = features.get(f"w:{w}", 0.0) + weight
            if len(w) >= 3:
                for i in range(len(w) - 2):
                    tri = w[i:i+3]
                    features[f"tri:{tri}"] = features.get(f"tri:{tri}", 0.0) + 0.4

    return features


def calculate_cosine_similarity(query: str, document: str, tags: Optional[List[str]] = None) -> float:
    """Computes real vector cosine similarity between query and document with optional domain tags."""
    if not query.strip() or not document.strip():
        return 0.0

    def calculate_pair(a: str, b: str) -> float:
        vec_a = compute_vector_features(a)
        vec_b = compute_vector_features(b)

        dot_product = sum(vec_a[k] * vec_b[k] for k in vec_a if k in vec_b)
        norm_a = sum(v * v for v in vec_a.values())
        norm_b = sum(v * v for v in vec_b.values())

        if norm_a == 0.0 or norm_b == 0.0:
            return 0.0

        raw_cosine = dot_product / (math.sqrt(norm_a) * math.sqrt(norm_b))

        words_a = set(w for w in split_tokens(a) if len(w) > 2)
        words_b = set(w for w in split_tokens(b) if len(w) > 2)
        overlap = len(words_a & words_b) / len(words_a) if words_a else 0.0

        return 0.5 * raw_cosine + 0.5 * overlap

    sim_title = calculate_pair(query, document)
    sim_full = calculate_pair(query, f"{document} {' '.join(tags)}") * 1.15 if tags else sim_title
    best_sim = max(sim_title, sim_full)
    return round(max(0.0, min(1.0, best_sim)), 4)


def wilson_lower_bound(worked: int, failed: int, z: float = 1.96) -> Optional[float]:
    """Computes the 95% Wilson confidence interval lower bound."""
    n = worked + failed
    if n <= 0:
        return None

    p = worked / n
    denom = 1.0 + (z ** 2) / n
    centre = p + (z ** 2) / (2.0 * n)
    margin = z * math.sqrt((p * (1.0 - p) + (z ** 2) / (4.0 * n)) / n)
    lower = (centre - margin) / denom
    return max(0.0, min(1.0, lower))


def final_score(similarity: float, worked: int, failed: int, prior: float = 0.5) -> float:
    """Computes composite score: similarity x blended quality."""
    n = worked + failed
    raw_wilson = wilson_lower_bound(worked, failed)
    wilson = raw_wilson if raw_wilson is not None else 0.0

    weight = min(n / 5.0, 1.0)
    quality = (weight * wilson) + ((1.0 - weight) * prior)
    return round(similarity * quality, 4)


def get_honest_label(user_votes: int, demo_votes: int, source: str) -> str:
    """Honest labeling: Community verified requires >= 5 real user votes."""
    if user_votes >= 5:
        return "Community verified"
    if demo_votes > 0 or source == "DEMO":
        return "Demo data"
    return "AI estimate"


def compute_metrics(worked: int, failed: int, similarity: float, source: str = "DEMO") -> dict:
    """Generates all metric attributes for API response payload."""
    n = worked + failed
    raw_wilson = wilson_lower_bound(worked, failed)
    score = final_score(similarity, worked, failed)
    label = get_honest_label(user_votes=0, demo_votes=n, source=source)
    success_rate = round((worked / n) * 100.0, 1) if n > 0 else 0.0

    return {
        "worked": worked,
        "failed": failed,
        "total_votes": n,
        "success_rate": success_rate,
        "wilson_lower_bound": round(raw_wilson, 4) if raw_wilson is not None else 0.0,
        "score": score,
        "label": label,
    }
