/**
 * FixRank Destructive Command Guardrail
 * Detects dangerous shell operations (e.g. recursive deletes, unrestricted permissions,
 * pipe-to-shell, force git pushes, system prunes, and registry edits)
 * and flags them with explicit review warnings and copy confirmations.
 */

export interface DangerousPattern {
  pattern: RegExp;
  reason: string;
}

export const DANGEROUS_PATTERNS: DangerousPattern[] = [
  { pattern: /\brm\s+(-[a-zA-Z]*r[a-zA-Z]*f*|--recursive)\b/i, reason: "Recursive file deletion (`rm -rf` / `rm -r`)" },
  { pattern: /\bchmod\s+(-R\s+)?777\b/i, reason: "World-writable permission granting (`chmod 777`)" },
  { pattern: /\bchown\s+-R\b/i, reason: "Recursive ownership modification (`chown -R`)" },
  { pattern: /(curl|wget)\s+.*?\|\s*(sudo\s+)?(bash|sh)\b/i, reason: "Unverified remote script piped directly to shell (`curl | bash`)" },
  { pattern: /\bsudo\s+.*?\|\s*(bash|sh)\b/i, reason: "Piping commands into root shell (`sudo | sh`)" },
  { pattern: /\bgit\s+push\s+.*--force\b|\bgit\s+push\s+.*-f\b/i, reason: "Destructive remote Git history rewrite (`git push --force`)" },
  { pattern: /\bgit\s+reset\s+--hard\b/i, reason: "Discarding uncommitted work (`git reset --hard`)" },
  { pattern: /\b(DROP\s+TABLE|DROP\s+DATABASE|TRUNCATE\s+TABLE)\b/i, reason: "Destructive SQL DDL statement (`DROP TABLE`)" },
  { pattern: /\bdocker\s+system\s+prune(\s+-a)?\b/i, reason: "Docker volume & image cleanup (`docker system prune`)" },
  { pattern: /\b(reg\s+add|reg\s+delete)\b/i, reason: "Windows system registry edit (`reg add/delete`)" },
  { pattern: /\b(format\s+[A-Za-z]:|mkfs(\.[a-z0-9]+)?)\b/i, reason: "Disk filesystem format (`format` / `mkfs`)" },
  { pattern: /\bdd\s+if=\/dev\/zero\b/i, reason: "Raw block device overwrite (`dd if=/dev/zero`)" },
];

export interface SafetyCheckResult {
  isDangerous: boolean;
  reasons: string[];
}

export function inspectSafety(steps: string): SafetyCheckResult {
  const reasons: string[] = [];
  for (const item of DANGEROUS_PATTERNS) {
    if (item.pattern.test(steps)) {
      reasons.push(item.reason);
    }
  }
  return {
    isDangerous: reasons.length > 0,
    reasons,
  };
}
