/**
 * FixRank Statistical Ranking & Honest Labeling Engine
 * Calculates Wilson Lower Bound (95% confidence) with community-verified and real user votes.
 */

export function wilsonLowerBound(worked: number, failed: number, z = 1.96): number | null {
  const n = worked + failed;
  if (n <= 0) return null;
  
  const p = worked / n;
  const denom = 1.0 + (z * z) / n;
  const centre = p + (z * z) / (2.0 * n);
  const margin = z * Math.sqrt((p * (1.0 - p) + (z * z) / (4.0 * n)) / n);
  const lower = (centre - margin) / denom;
  return Math.max(0.0, Math.min(1.0, lower));
}

export type SolutionLabel = "Community verified" | "AI estimate";

export function determineHonestLabel(
  userWorked: number,
  userFailed: number,
  communityWorked: number,
  communityFailed: number,
  source: string
): SolutionLabel {
  const totalVotes = userWorked + userFailed + communityWorked + communityFailed;

  // Real community verification requires at least 5 community/user votes
  if (totalVotes >= 5 || source === "COMMUNITY") {
    return "Community verified";
  }

  // Otherwise it's an unvoted or cold-start solution
  return "AI estimate";
}

export function finalScore(
  similarity: number,
  totalWorked: number,
  totalFailed: number,
  userVotesCount: number,
  prior = 0.5
): number {
  const n = totalWorked + totalFailed;
  const rawWilson = wilsonLowerBound(totalWorked, totalFailed);
  const wilson = rawWilson !== null ? rawWilson : 0.0;

  // Blending prior: smooth transition over the first 5 votes
  const weight = Math.min(n / 5.0, 1.0);
  const quality = weight * wilson + (1.0 - weight) * prior;
  return Number((similarity * quality).toFixed(4));
}

export interface DetailedMetricSummary {
  worked: number;
  failed: number;
  totalVotes: number;
  userVotes: number;
  communityVotes: number;
  successRate: number;
  wilsonLowerBound: number | null;
  score: number;
  label: SolutionLabel;
}

export function computeDetailedMetrics(
  userWorked: number,
  userFailed: number,
  communityWorked: number,
  communityFailed: number,
  similarity: number,
  source = "COMMUNITY"
): DetailedMetricSummary {
  const totalWorked = userWorked + communityWorked;
  const totalFailed = userFailed + communityFailed;
  const totalVotes = totalWorked + totalFailed;
  const userVotes = userWorked + userFailed;
  const communityVotes = communityWorked + communityFailed;

  const rawWilson = wilsonLowerBound(totalWorked, totalFailed);
  const score = finalScore(similarity, totalWorked, totalFailed, userVotes);
  const label = determineHonestLabel(userWorked, userFailed, communityWorked, communityFailed, source);
  const successRate = totalVotes > 0 ? Number(((totalWorked / totalVotes) * 100).toFixed(1)) : 0;

  return {
    worked: totalWorked,
    failed: totalFailed,
    totalVotes,
    userVotes,
    communityVotes,
    successRate,
    wilsonLowerBound: rawWilson !== null ? Number(rawWilson.toFixed(4)) : null,
    score,
    label,
  };
}
