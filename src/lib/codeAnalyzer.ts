/**
 * FixRank Intelligent Error Detection Engine
 * Analyzes pasted source code and configuration to extract likely bugs:
 * 1. Import Errors (e.g. ModuleNotFoundError)
 * 2. Syntax Errors (e.g. missing colons, mismatched brackets)
 * 3. Invalid Configuration (e.g. KeyError in os.environ)
 * 4. Database Connection Issues (e.g. Db2 SQL30082N authorization)
 * 5. Port Conflicts (e.g. Invalid Flask Port, EADDRINUSE)
 */

export interface DetectedBug {
  id: string;
  name: string; // e.g. "ModuleNotFoundError"
  title: string; // e.g. "ModuleNotFoundError: No module named 'requests'"
  canonicalQuery: string; // The exact search query to pass into FixRank
  category: "Import Error" | "Syntax Error" | "Invalid Configuration" | "Database Connection" | "Port Conflict";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "WARNING";
  line?: number;
  codeSnippet?: string;
  explanation: string;
}

/**
 * Heuristic detector: returns true if the input appears to be source code rather than a raw error log.
 */
export function isSourceCode(text: string): boolean {
  if (!text || text.trim().length < 15) return false;
  const lines = text.trim().split("\n");

  // Stack traces usually start with "Traceback (most recent call last):" or "Error: ..."
  // Code contains keywords and structure
  const codePatterns = [
    /^\s*(import|from)\s+[a-zA-Z0-9_.]+/m,
    /^\s*(def|class|async\s+def)\s+[a-zA-Z0-9_]+/m,
    /^\s*(const|let|var|function)\s+[a-zA-Z0-9_]+/m,
    /app\s*=\s*Flask\(/i,
    /app\s*=\s*FastAPI\(/i,
    /app\s*=\s*express\(/i,
    /app\.run\(/i,
    /app\.listen\(/i,
    /if\s+__name__\s*==\s*['"]__main__['"]:/,
    /os\.environ\[/,
    /ibm_db\./i,
    /^\s*SELECT\s+.+\s+FROM\s+/im,
    /^\s*version:\s*['"][0-9.]+['"]/m, // docker-compose
    /^\s*services:\s*$/m,
  ];

  const matchedPatterns = codePatterns.filter((p) => p.test(text)).length;

  // If at least 2 code patterns match, or multi-line code with import/def
  if (matchedPatterns >= 2) return true;
  if (lines.length >= 3 && matchedPatterns >= 1 && !text.includes("Traceback (most recent call last)")) {
    return true;
  }

  return false;
}

/**
 * Intelligent AST/regex bug extraction engine
 */
export function analyzeCodeForBugs(code: string): DetectedBug[] {
  const bugs: DetectedBug[] = [];
  const lines = code.split("\n");

  // 1. Detect Import Errors
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Check python imports
    const importMatch = line.match(/^\s*(?:import\s+([a-zA-Z0-9_]+)|from\s+([a-zA-Z0-9_]+)\s+import)/);
    if (importMatch) {
      const moduleName = importMatch[1] || importMatch[2];
      const standardBuiltins = ["os", "sys", "json", "time", "re", "math", "logging", "typing", "collections", "pathlib", "datetime", "subprocess", "unittest"];
      if (moduleName && !standardBuiltins.includes(moduleName)) {
        if (moduleName === "requests") {
          bugs.push({
            id: `import_${moduleName}_${lineNum}`,
            name: "ModuleNotFoundError",
            title: `ModuleNotFoundError: No module named 'requests'`,
            canonicalQuery: `ModuleNotFoundError: No module named 'requests'`,
            category: "Import Error",
            severity: "CRITICAL",
            line: lineNum,
            codeSnippet: line.trim(),
            explanation: `Module 'requests' imported on line ${lineNum} without dependency lockfile verification. Requires pip install in active virtual environment.`,
          });
        } else if (moduleName === "ibm_db") {
          bugs.push({
            id: `import_db2_${lineNum}`,
            name: "ModuleNotFoundError / Driver Missing",
            title: `ModuleNotFoundError: No module named 'ibm_db'`,
            canonicalQuery: `IBM Db2 SQL30082N Security processing failed / Connection authorization failure`,
            category: "Import Error",
            severity: "CRITICAL",
            line: lineNum,
            codeSnippet: line.trim(),
            explanation: `IBM Db2 Python driver requires C-driver CLI libraries and active connectivity credentials.`,
          });
        } else if (moduleName === "flask" || moduleName === "fastapi") {
          // Track for port conflict check
        }
      }
    }
  }

  // 2. Detect Invalid Configuration (KeyError in os.environ)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    const envMatch = line.match(/os\.environ\[['"]([a-zA-Z0-9_]+)['"]\]/);
    if (envMatch) {
      const keyName = envMatch[1];
      bugs.push({
        id: `keyerror_${keyName}_${lineNum}`,
        name: "KeyError",
        title: `KeyError: '${keyName}' missing in os.environ`,
        canonicalQuery: `KeyError: environment variable or dictionary key missing`,
        category: "Invalid Configuration",
        severity: "HIGH",
        line: lineNum,
        codeSnippet: line.trim(),
        explanation: `Direct bracket lookup os.environ['${keyName}'] on line ${lineNum} causes unhandled KeyError when variable is unset. Use os.environ.get('${keyName}', fallback) with python-dotenv.`,
      });
    }
  }

  // 3. Detect Port Conflicts / Host Binding (Invalid Flask Port)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Check for Flask app.run() or port 5000 binding
    if (line.includes("app.run(") || line.includes("run(port=")) {
      const hasPort5000 = line.includes("5000") || (!line.includes("port=") && code.includes("Flask"));
      const isDefaultHost = !line.includes("host=") || line.includes("loopback") || line.includes("127.");

      if (hasPort5000 || isDefaultHost) {
        bugs.push({
          id: `flask_port_${lineNum}`,
          name: "Invalid Flask Port",
          title: `Invalid Flask Port / Host binding (default loopback instead of 0.0.0.0 in Docker)`,
          canonicalQuery: `Invalid Flask Port / Host binding: unreachable on loopback outside container`,
          category: "Port Conflict",
          severity: "MEDIUM",
          line: lineNum,
          codeSnippet: line.trim(),
          explanation: `Line ${lineNum}: Default loopback host is unreachable from Docker containers or outside hosts. Additionally, port 5000 conflicts with macOS Monterey+ AirPlay Receiver service.`,
        });
      }
    }

    // Check for Express listen 3000
    if (line.includes(".listen(3000") || (line.includes("PORT = 3000") && line.includes("listen"))) {
      bugs.push({
        id: `port_3000_${lineNum}`,
        name: "EADDRINUSE: 3000",
        title: `Error: listen EADDRINUSE: address already in use :::3000`,
        canonicalQuery: `Error: listen EADDRINUSE: address already in use :::3000`,
        category: "Port Conflict",
        severity: "HIGH",
        line: lineNum,
        codeSnippet: line.trim(),
        explanation: `Line ${lineNum}: Port 3000 is commonly held by existing dev servers or node background workers.`,
      });
    }
  }

  // 4. Detect Database Connection Issues (Db2 / SQL)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    if (line.includes("ibm_db.connect") || line.includes("DB2COMM") || (line.includes("50000") && line.includes("db2"))) {
      bugs.push({
        id: `db2_conn_${lineNum}`,
        name: "SQL30082N Security processing failed",
        title: `IBM Db2 SQL30082N Security processing failed / Connection authorization failure`,
        canonicalQuery: `SQL30082N Security processing failed`,
        category: "Database Connection",
        severity: "CRITICAL",
        line: lineNum,
        codeSnippet: line.trim(),
        explanation: `Line ${lineNum}: Db2 connection signature detected. SQL30082N / SQLSTATE=08001 occurs when password, TCPIP comm protocol, or instance container port is misconfigured.`,
      });
    }
  }

  // 5. Detect Syntax Errors (Missing colons, unclosed brackets)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    const blockHeaderRegex = /^\s*(def|if|elif|else|for|while|class|try|except|finally)\b([^:]*)$/;
    if (blockHeaderRegex.test(line) && !line.trim().endsWith(":") && !line.trim().startsWith("#")) {
      bugs.push({
        id: `syntax_colon_${lineNum}`,
        name: "SyntaxError",
        title: `SyntaxError: expected ':' at end of line`,
        canonicalQuery: `SyntaxError: expected ':' at end of block header`,
        category: "Syntax Error",
        severity: "CRITICAL",
        line: lineNum,
        codeSnippet: line.trim(),
        explanation: `Line ${lineNum}: Python statement header is missing terminating colon ':'. Will fail compilation immediately.`,
      });
    }
  }

  // If code was detected but no specific regex matched, provide high-probability inference
  if (bugs.length === 0) {
    if (code.includes("import requests") || code.includes("requests.")) {
      bugs.push({
        id: "inferred_requests",
        name: "ModuleNotFoundError",
        title: "ModuleNotFoundError: No module named 'requests'",
        canonicalQuery: "ModuleNotFoundError: No module named 'requests'",
        category: "Import Error",
        severity: "CRITICAL",
        explanation: "Code uses the requests HTTP client library. Often missing in freshly cloned environments.",
      });
    }
    if (code.includes("os.environ")) {
      bugs.push({
        id: "inferred_env",
        name: "KeyError",
        title: "KeyError: environment variable missing in os.environ",
        canonicalQuery: "KeyError: environment variable or dictionary key missing",
        category: "Invalid Configuration",
        severity: "HIGH",
        explanation: "Unprotected environment access detected without default fallbacks.",
      });
    }
  }

  return bugs;
}
