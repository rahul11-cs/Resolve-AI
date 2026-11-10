/**
 * Resolve AI Intelligence Engine
 * - Automatic Technology & Error Type Detection
 * - Exact Error Code & Product Signature Extraction
 * - Search Insights Synthesis (Quality, Terms, Intent, Confidence)
 * - AI Recommended Actions Generator
 * - Similar Issues Vector Discovery
 */

export interface DetectedTechInfo {
  technology: string;
  errorType: string;
  confidence: number;
  icon?: string;
}

export interface ExtractedErrorCode {
  errorCode: string;
  product: string;
  category: string;
  rawSignature?: string;
  confidence: number;
}

export interface SearchInsights {
  queryQuality: "Optimal" | "High" | "Moderate" | "Low";
  detectedTerms: string[];
  matchedCategory: string;
  detectedTechnology: string;
  detectedErrorType: string;
  confidencePercent: number;
  detectedIntent: "Troubleshooting" | "Root Cause Analysis" | "Configuration Audit" | "Dependency Resolution";
}

export interface SimilarIssue {
  code: string;
  title: string;
  category: string;
  similarity: number;
}

/**
 * 1. Automatic Technology & Error Type Detection
 */
export function detectTechnologyAndErrorType(query: string): DetectedTechInfo {
  const q = query.toLowerCase();

  // Technology matching
  let tech = "General";
  let conf = 0.85;

  if (q.includes("db2") || q.includes("ibm_db") || q.includes("sql30082n") || q.includes("sqlcode") || q.includes("sqlstate")) {
    tech = "Db2";
    conf = 0.98;
  } else if (q.includes("docker") || q.includes("container") || q.includes("docker.sock")) {
    tech = "Docker";
    conf = 0.96;
  } else if (q.includes("postgres") || q.includes("pg_") || q.includes("psql") || q.includes("5432")) {
    tech = "PostgreSQL";
    conf = 0.95;
  } else if (q.includes("python") || q.includes("pip") || q.includes("modulenotfounderror") || q.includes("keyerror") || q.includes("requests") || q.includes("venv")) {
    tech = "Python";
    conf = 0.96;
  } else if (q.includes("npm") || q.includes("node") || q.includes("eaddrinuse") || q.includes("eresolve") || q.includes("express")) {
    tech = "Node.js";
    conf = 0.95;
  } else if (q.includes("react") || q.includes("hydration") || q.includes("nextjs") || q.includes("jsx") || q.includes("hooks")) {
    tech = "React";
    conf = 0.94;
  } else if (q.includes("git") || q.includes("merge") || q.includes("rebase") || q.includes("ssh") || q.includes("publickey")) {
    tech = "Git";
    conf = 0.93;
  } else if (q.includes("kube") || q.includes("k8s") || q.includes("pod") || q.includes("ingress") || q.includes("crashloopbackoff")) {
    tech = "Kubernetes";
    conf = 0.95;
  } else if (q.includes("linux") || q.includes("systemctl") || q.includes("chmod") || q.includes("lsof") || q.includes("permission denied")) {
    tech = "Linux";
    conf = 0.90;
  }

  // Error type matching
  let errorType = "General Error";
  if (q.includes("login") || q.includes("auth") || q.includes("credential") || q.includes("password") || q.includes("denied") || q.includes("sql30082n")) {
    errorType = "Authentication / Access Control";
  } else if (q.includes("service") || q.includes("stopped") || q.includes("unavailable") || q.includes("not running") || q.includes("engine")) {
    errorType = "Service Availability";
  } else if (q.includes("port") || q.includes("eaddrinuse") || q.includes("listen") || q.includes("bind") || q.includes("3000") || q.includes("5000")) {
    errorType = "Port Conflict / Socket Binding";
  } else if (q.includes("not found") || q.includes("modulenotfound") || q.includes("import") || q.includes("missing") || q.includes("package")) {
    errorType = "Missing Dependency / Module Resolution";
  } else if (q.includes("eresolve") || q.includes("peer") || q.includes("conflict") || q.includes("tree")) {
    errorType = "Dependency Tree Mismatch";
  } else if (q.includes("cors") || q.includes("origin") || q.includes("access-control")) {
    errorType = "Cross-Origin Policy (CORS)";
  } else if (q.includes("merge") || q.includes("conflict") || q.includes("branch")) {
    errorType = "Version Control Conflict";
  } else if (q.includes("crash") || q.includes("oom") || q.includes("memory")) {
    errorType = "Resource Exhaustion / OOM";
  }

  return { technology: tech, errorType, confidence: conf };
}

/**
 * 2. Exact Error Code & Product Signature Extraction
 */
export function extractErrorCodeSignature(query: string): ExtractedErrorCode | null {
  const q = query.trim();

  // Db2 SQL codes (e.g. SQL30082N, SQL1013N, SQL30081N)
  const db2Match = q.match(/\b(SQL\d{4,5}[A-Z]?)\b/i) || q.match(/(SQLCODE\s*=\s*-?\d+)/i);
  if (db2Match || q.toLowerCase().includes("sql30082n")) {
    const code = db2Match ? db2Match[1].toUpperCase() : "SQL30082N";
    return {
      errorCode: code,
      product: "IBM Db2",
      category: "Authentication & Security",
      rawSignature: q,
      confidence: 0.99,
    };
  }

  // POSIX / Node error codes (e.g. EADDRINUSE, ERESOLVE, ECONNREFUSED)
  const posixMatch = q.match(/\b(E[A-Z]{5,14})\b/);
  if (posixMatch) {
    const code = posixMatch[1];
    return {
      errorCode: code,
      product: code === "ERESOLVE" ? "npm CLI" : "Node.js / POSIX",
      category: code === "EADDRINUSE" ? "Port Conflict" : "Dependency Resolution",
      rawSignature: q,
      confidence: 0.98,
    };
  }

  // Python Exception types (e.g. ModuleNotFoundError, KeyError, SyntaxError)
  const pyMatch = q.match(/\b(ModuleNotFoundError|KeyError|ImportError|SyntaxError|TypeError|ValueError)\b/);
  if (pyMatch) {
    const code = pyMatch[1];
    return {
      errorCode: code,
      product: "Python 3 Runtime",
      category: code === "ModuleNotFoundError" ? "Package Import" : code === "KeyError" ? "Dictionary / Environment" : "Language Runtime",
      rawSignature: q,
      confidence: 0.98,
    };
  }

  // TypeScript codes (e.g. TS2339)
  const tsMatch = q.match(/\b(TS\d{4,5})\b/i);
  if (tsMatch) {
    return {
      errorCode: tsMatch[1].toUpperCase(),
      product: "TypeScript Compiler",
      category: "Type Checker / Interface Definition",
      confidence: 0.97,
    };
  }

  // Docker socket issue
  if (q.toLowerCase().includes("docker.sock") || q.toLowerCase().includes("docker service")) {
    return {
      errorCode: "DOCKER_SERVICE_SOCKET",
      product: "Docker Engine",
      category: "Service Communication & Socket",
      confidence: 0.94,
    };
  }

  return null;
}

/**
 * 3. Search Insights Synthesis
 */
export function generateSearchInsights(query: string, matchedProblemTitle: string, similarity: number): SearchInsights {
  const tech = detectTechnologyAndErrorType(query);
  const words = query.trim().split(/\s+/).filter((w) => w.length > 2);
  const quality = query.length > 40 && words.length >= 4 ? "Optimal" : words.length >= 2 ? "High" : "Moderate";

  return {
    queryQuality: quality,
    detectedTerms: words.slice(0, 5),
    matchedCategory: tech.technology,
    detectedTechnology: tech.technology,
    detectedErrorType: tech.errorType,
    confidencePercent: Math.round(similarity * 100),
    detectedIntent: query.includes("how") || query.includes("fix") ? "Root Cause Analysis" : "Troubleshooting",
  };
}

/**
 * 4. AI-Powered Recommended Actions
 */
export function getRecommendedActions(category: string, errorType: string, _solutionTitle: string): string[] {
  const cat = category.toLowerCase();

  if (cat === "db2" || errorType.includes("Authentication")) {
    return [
      "Verify DB2USER credentials and password inside the container",
      "Check DB2COMM TCPIP communication protocol is active (`db2set DB2COMM=TCPIP`)",
      "Validate listener port 50000 matches instance svcename",
      "Retry connection after forceful instance restart (`db2stop force && db2start`)",
    ];
  }

  if (cat === "docker" || errorType.includes("Service Availability")) {
    return [
      "Check systemd service status (`sudo systemctl status docker`)",
      "Verify Docker socket ownership and group membership (`sudo usermod -aG docker $USER`)",
      "Restart Docker background service or Desktop VM process",
      "Inspect `/var/run/docker.sock` permissions and available disk space",
    ];
  }

  if (cat === "networking" || errorType.includes("Port")) {
    return [
      "Identify the lingering PID binding the port (`lsof -i :3000` or `:5000`)",
      "Terminate orphan processes gracefully (`npx kill-port 3000`)",
      "Bind server host to `0.0.0.0` for Docker / external connectivity",
      "Retry server startup with alternate port fallback (`PORT=3001 npm run dev`)",
    ];
  }

  if (cat === "python" || errorType.includes("Dependency") || errorType.includes("Import")) {
    return [
      "Verify active interpreter binary (`which python` / `which python3`)",
      "Install required package into the active virtual environment (`pip install <pkg>`)",
      "Ensure virtualenv is activated (`source .venv/bin/activate`)",
      "Audit `requirements.txt` and verify lockfile checksums",
    ];
  }

  return [
    "Verify environment configuration and variable definitions",
    "Inspect background services and network connectivity",
    "Apply verified command steps in clean isolated sandbox",
    "Re-run verification test suite to confirm resolution",
  ];
}

/**
 * 5. Similar Issues Vector Discovery
 */
export const SIMILAR_ISSUES_CATALOG: Record<string, SimilarIssue[]> = {
  db2: [
    { code: "SQL1013N", title: "SQL1013N Database alias not found in directory", category: "Db2", similarity: 0.88 },
    { code: "SQL30081N", title: "SQL30081N Communication error detected on TCP/IP socket", category: "Db2", similarity: 0.85 },
    { code: "SQL1224N", title: "SQL1224N Db2 server not accepting requests or out of memory", category: "Db2", similarity: 0.81 },
  ],
  docker: [
    { code: "DOCKER_PORT", title: "docker: Error response: driver failed programming external connectivity", category: "Docker", similarity: 0.89 },
    { code: "DOCKER_OOM", title: "Container exited with status 137 (OOMKilled by Linux cgroup)", category: "Docker", similarity: 0.84 },
    { code: "DOCKER_BUILD", title: "failed to solve with frontend dockerfile.v0: failed to read dockerfile", category: "Docker", similarity: 0.79 },
  ],
  node: [
    { code: "ECONNREFUSED", title: "Error: connect ECONNREFUSED connection refused to service", category: "Node.js", similarity: 0.87 },
    { code: "ERR_HEADERS", title: "ERR_HTTP_HEADERS_SENT: Cannot set headers after they are sent", category: "Node.js", similarity: 0.83 },
    { code: "MODULE_NOT_FOUND", title: "Cannot find module 'express' or its type definitions", category: "Node.js", similarity: 0.81 },
  ],
  python: [
    { code: "ImportError", title: "ImportError: cannot import name 'X' from partially initialized module", category: "Python", similarity: 0.86 },
    { code: "TypeError", title: "TypeError: 'NoneType' object is not subscriptable", category: "Python", similarity: 0.82 },
    { code: "RecursionError", title: "RecursionError: maximum recursion depth exceeded in comparison", category: "Python", similarity: 0.78 },
  ],
  networking: [
    { code: "EADDRNOTAVAIL", title: "Error: bind EADDRNOTAVAIL: address not available", category: "Networking", similarity: 0.87 },
    { code: "ETIMEDOUT", title: "connect ETIMEDOUT: remote host unreachable after 30s", category: "Networking", similarity: 0.84 },
    { code: "ECONNRESET", title: "read ECONNRESET: connection reset by peer socket", category: "Networking", similarity: 0.82 },
  ],
};

export function getSimilarIssues(category: string, currentProblemId: string): SimilarIssue[] {
  const cat = category.toLowerCase();
  const pool = SIMILAR_ISSUES_CATALOG[cat] || SIMILAR_ISSUES_CATALOG["db2"];
  return pool.filter((issue) => !currentProblemId.includes(issue.code));
}
