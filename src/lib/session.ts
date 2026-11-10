/**
 * FixRank Session & Vote Isolation Manager
 * Generates and preserves a persistent session_id in localStorage to enforce
 * single-vote integrity per solution per user session.
 */

const SESSION_KEY = "fixrank_session_id";
const VOTES_KEY = "fixrank_user_votes";

export function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = "sess_" + Math.random().toString(36).substring(2, 12) + "_" + Date.now();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function resetSessionId(): string {
  const newSessionId = "sess_" + Math.random().toString(36).substring(2, 12) + "_" + Date.now();
  localStorage.setItem(SESSION_KEY, newSessionId);
  localStorage.removeItem(VOTES_KEY);
  return newSessionId;
}

export interface UserVoteRecord {
  solutionId: number;
  outcome: "worked" | "failed";
  timestamp: number;
}

export function getUserVotes(): Record<number, "worked" | "failed"> {
  try {
    const raw = localStorage.getItem(VOTES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function recordLocalVote(solutionId: number, outcome: "worked" | "failed") {
  const votes = getUserVotes();
  votes[solutionId] = outcome;
  localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
}
