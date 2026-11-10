/**
 * FixRank Query Privacy & Secret Sanitization Engine
 * Redacts API keys, JWT tokens, private keys, passwords, emails, and home-directory usernames
 * before any logging, storage, or vector processing.
 */

export interface ScrubResult {
  cleanedText: string;
  hasRedactions: boolean;
  redactedTypes: string[];
}

export function scrubQuery(input: string): ScrubResult {
  let cleaned = input;
  const redactedTypes: string[] = [];

  // 1. Redact Private Key blocks
  if (/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/gi.test(cleaned)) {
    cleaned = cleaned.replace(
      /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/gi,
      "[REDACTED_PRIVATE_KEY]"
    );
    redactedTypes.push("Private Key");
  }

  // 2. Redact Bearer / JWT Tokens (eyJ...)
  if (/Bearer\s+[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/gi.test(cleaned)) {
    cleaned = cleaned.replace(
      /Bearer\s+[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/gi,
      "Bearer [REDACTED_TOKEN]"
    );
    redactedTypes.push("Bearer Token");
  } else if (/eyJ[A-Za-z0-9-_=]{10,}\.[A-Za-z0-9-_=]{10,}\.?[A-Za-z0-9-_.+/=]*/gi.test(cleaned)) {
    cleaned = cleaned.replace(
      /eyJ[A-Za-z0-9-_=]{10,}\.[A-Za-z0-9-_=]{10,}\.?[A-Za-z0-9-_.+/=]*/gi,
      "[REDACTED_JWT]"
    );
    redactedTypes.push("JWT Token");
  }

  // 3. Redact Common API Key formats (OpenAI, AWS, GitHub, Generic 32+ char hex/base64 keys)
  if (/\b(sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{20,}|AKIA[0-9A-Z]{16})\b/g.test(cleaned)) {
    cleaned = cleaned.replace(
      /\b(sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{20,}|AKIA[0-9A-Z]{16})\b/g,
      "[REDACTED_API_KEY]"
    );
    redactedTypes.push("API Key");
  }

  // 4. Redact Passwords in connection strings or CLI args (e.g. password=XYZ, PWD=XYZ, :password@)
  if (/(password|pwd|pass|secret)\s*[:=]\s*['"]?[^\s'";]+['"]?/gi.test(cleaned)) {
    cleaned = cleaned.replace(
      /(password|pwd|pass|secret)\s*[:=]\s*['"]?([^\s'";]+)['"]?/gi,
      "$1=[REDACTED_SECRET]"
    );
    redactedTypes.push("Password / Secret");
  }
  if (/:\/\/[^:\s]+:([^@\s]+)@/g.test(cleaned)) {
    cleaned = cleaned.replace(
      /(:\/\/[^:\s]+:)([^@\s]+)(@)/g,
      "$1[REDACTED_CREDENTIALS]$3"
    );
    redactedTypes.push("URI Credentials");
  }

  // 5. Redact Email addresses
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g.test(cleaned)) {
    cleaned = cleaned.replace(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      "[REDACTED_EMAIL]"
    );
    redactedTypes.push("Email");
  }

  // 6. Redact Home Directory usernames in file paths (/Users/username or /home/username)
  if (/(\/(?:Users|home)\/)[a-zA-Z0-9._-]+(\/)/g.test(cleaned)) {
    cleaned = cleaned.replace(
      /(\/(?:Users|home)\/)[a-zA-Z0-9._-]+(\/)/g,
      "$1[USER]$2"
    );
    redactedTypes.push("User Home Path");
  }

  return {
    cleanedText: cleaned,
    hasRedactions: redactedTypes.length > 0,
    redactedTypes,
  };
}
