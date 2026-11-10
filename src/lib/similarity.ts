/**
 * FixRank Enterprise Multi-Stage Semantic Retrieval Engine
 * 1. Match Exact Error Codes & Aliases First (Deterministic Fast Path)
 * 2. Domain-Specific Synonym Expansion
 * 3. Continuous Mathematical Vector Cosine Similarity (Fallback with 0.55 threshold)
 */

import { SeedProblem } from "./seedData";

export const MIN_SIMILARITY_THRESHOLD = 0.55;

export const SYNONYM_MAP: Record<string, string[]> = {
  // Authentication & Credentials
  login: ["authentication", "auth", "credentials", "sign-in", "access", "password"],
  auth: ["authentication", "login", "credentials", "authorization", "security"],
  authentication: ["login", "credentials", "auth", "authorization", "security"],
  credentials: ["login", "password", "username", "token", "auth", "secret"],
  password: ["credentials", "secret", "token", "pass"],

  // Failure & Errors
  failed: ["failure", "error", "rejected", "denied", "exception", "abort"],
  failure: ["failed", "error", "denied", "crash"],
  denied: ["permission", "rejected", "failed", "forbidden", "unauthorized"],
  permission: ["denied", "forbidden", "access", "unauthorized", "sudo"],

  // Service / Engine states
  stopped: ["down", "terminated", "inactive", "not running", "dead", "offline", "unavailable"],
  down: ["stopped", "offline", "inactive", "not running"],
  running: ["active", "up", "started"],
  service: ["engine", "process", "server", "socket", "background"],
  engine: ["service", "runtime", "background"],

  // Database & Db2
  db2: ["ibm_db", "database", "db2inst1", "sql30082n", "sqlstate-08001"],
  database: ["db", "db2", "postgres", "sql", "ibm_db"],

  // Networking & Ports
  port: ["listener", "socket", "address", "bind", "eaddrinuse"],
  conflict: ["collision", "in use", "overlap", "mismatch"],
  listen: ["binding", "port", "socket", "address"],

  // Code / Dependencies
  missing: ["not found", "unresolved", "unavailable", "absent"],
  module: ["package", "dependency", "library"],
  import: ["modulenotfounderror", "importerror", "require"],
  resolve: ["dependency", "tree", "eresolve", "peer"],
  kill: ["terminate", "stop", "close", "lsof"],
};

export function splitTokens(text: string): string[] {
  // Splits on whitespace, punctuation, AND camelCase boundaries (e.g. ModuleNotFoundError -> module, not, found, error)
  const expanded = text.replace(/([a-z])([A-Z])/g, "$1 $2");
  return expanded
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

export function normalizeSignature(text: string): string {
  return splitTokens(text).join(" ");
}

/**
 * Expands user query with domain-specific synonyms to maximize vector alignment
 */
export function expandSynonyms(query: string): string {
  const tokens = splitTokens(query);
  const additions = new Set<string>();

  for (const token of tokens) {
    const syns = SYNONYM_MAP[token];
    if (syns) {
      for (const s of syns) {
        additions.add(s);
      }
    }
  }

  if (additions.size === 0) return query;
  return `${query} ${Array.from(additions).join(" ")}`;
}

export interface ExactMatchResult {
  problem: SeedProblem;
  similarity: number;
  matchType: "EXACT_ERROR_CODE" | "CANONICAL_ALIAS";
  matchedRule: string;
}

/**
 * Step 1: Exact error code and alias matching before vector search
 */
export function matchExactErrorCodeOrAlias(query: string, problems: SeedProblem[]): ExactMatchResult | null {
  const rawClean = query.trim();
  const normalizedQuery = normalizeSignature(rawClean);
  if (!normalizedQuery) return null;

  // 1. Exact canonical error code check (e.g. SQL30082N, EADDRINUSE, ERESOLVE, ModuleNotFoundError, KeyError)
  for (const prob of problems) {
    if (prob.canonicalCode) {
      const codeNorm = prob.canonicalCode.toLowerCase();
      // Regex check for word boundary of error code in user query
      const codeRegex = new RegExp(`(^|[^a-zA-Z0-9])${codeNorm}([^a-zA-Z0-9]|$)`, "i");
      if (codeRegex.test(rawClean) || normalizedQuery === codeNorm) {
        return {
          problem: prob,
          similarity: 1.0,
          matchType: "EXACT_ERROR_CODE",
          matchedRule: `Exact error code matched: ${prob.canonicalCode}`,
        };
      }
    }
  }

  // 2. Exact or substring alias check
  for (const prob of problems) {
    for (const alias of prob.aliases) {
      const normAlias = normalizeSignature(alias);
      if (normAlias === normalizedQuery) {
        return {
          problem: prob,
          similarity: 0.995,
          matchType: "CANONICAL_ALIAS",
          matchedRule: `Exact alias match: "${alias}" → ${prob.title}`,
        };
      }
    }
  }

  // 3. High-confidence subset alias check (e.g. "db2 login failed" matching alias containing all tokens)
  const queryTokens = new Set(splitTokens(normalizedQuery));
  if (queryTokens.size >= 2) {
    for (const prob of problems) {
      for (const alias of prob.aliases) {
        const aliasTokens = splitTokens(alias);
        const allPresent = aliasTokens.length >= 2 && aliasTokens.every((t) => queryTokens.has(t));
        const queryAllInAlias = queryTokens.size >= 2 && Array.from(queryTokens).every((t) => aliasTokens.includes(t));
        if (allPresent || queryAllInAlias) {
          return {
            problem: prob,
            similarity: 0.985,
            matchType: "CANONICAL_ALIAS",
            matchedRule: `Canonical alias match: "${alias}"`,
          };
        }
      }
    }
  }

  return null;
}

export function extractVectorFeatures(text: string): Map<string, number> {
  const map = new Map<string, number>();
  const words = splitTokens(text);

  for (const word of words) {
    if (word.length > 1) {
      const weight = word.length > 3 ? 1.5 : 1.0;
      map.set(`w:${word}`, (map.get(`w:${word}`) || 0) + weight);

      if (word.length >= 3) {
        for (let i = 0; i <= word.length - 3; i++) {
          const trigram = word.substring(i, i + 3);
          map.set(`tri:${trigram}`, (map.get(`tri:${trigram}`) || 0) + 0.4);
        }
      }
    }
  }

  return map;
}

export function computeCosineSimilarity(query: string, document: string, tags: string[] = []): number {
  if (!query.trim() || !document.trim()) return 0.0;

  const calculatePair = (a: string, b: string): number => {
    const vecA = extractVectorFeatures(a);
    const vecB = extractVectorFeatures(b);

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (const [, val] of vecA.entries()) {
      normA += val * val;
    }

    for (const [key, valB] of vecB.entries()) {
      normB += valB * valB;
      const valA = vecA.get(key);
      if (valA !== undefined) {
        dotProduct += valA * valB;
      }
    }

    if (normA === 0 || normB === 0) return 0.0;
    const rawCosine = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));

    const wordsA = new Set(splitTokens(a).filter((w) => w.length > 2));
    const wordsB = new Set(splitTokens(b).filter((w) => w.length > 2));
    let common = 0;
    wordsA.forEach((w) => {
      if (wordsB.has(w)) common++;
    });
    const overlap = wordsA.size > 0 ? common / wordsA.size : 0.0;

    return 0.5 * rawCosine + 0.5 * overlap;
  };

  const simTitle = calculatePair(query, document);
  const fullDoc = tags.length > 0 ? `${document} ${tags.join(" ")}` : document;
  const simFull = tags.length > 0 ? calculatePair(query, fullDoc) * 1.15 : simTitle;

  const bestSim = Math.max(simTitle, simFull);
  return Number(Math.max(0.0, Math.min(1.0, bestSim)).toFixed(4));
}

