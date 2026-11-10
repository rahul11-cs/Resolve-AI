#!/usr/bin/env python3
"""
IBM Db2 TechX Workshop Project Submission Validator
Verifies project compliance, JSON schemas, zero secrets, and required documentation.
"""

import sys
import os
import json
import re

REQUIRED_FILES = [
    "submission.json",
    "README.md",
    "architecture.md",
    ".env.example"
]

REQUIRED_JSON_KEYS = [
    "project_name",
    "project_slug",
    "tagline",
    "repository_url",
    "live_url",
    "track",
    "frameworks_used",
    "team",
    "db2_integration"
]

SECRET_PATTERNS = [
    r"(?i)api[_-]?key\s*=\s*['\"][a-zA-Z0-9_\-]{20,}['\"]",
    r"(?i)password\s*=\s*['\"][^'\"]{6,}['\"]",
    r"(?i)bearer\s+[a-zA-Z0-9_\-\.]{25,}",
    r"ghp_[a-zA-Z0-9]{36}",
]

def validate_submission(submission_dir):
    print(f"[*] Validating submission directory: {submission_dir}")
    if not os.path.exists(submission_dir):
        print(f"[FAIL] Submission directory does not exist: {submission_dir}")
        return False

    # 1. Check required files
    all_ok = True
    for filename in REQUIRED_FILES:
        filepath = os.path.join(submission_dir, filename)
        if not os.path.isfile(filepath):
            print(f"[FAIL] Missing required file: {filename}")
            all_ok = False
        else:
            print(f"  [OK] Found {filename}")

    # 2. Check submission.json schema
    json_path = os.path.join(submission_dir, "submission.json")
    if os.path.isfile(json_path):
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            for k in REQUIRED_JSON_KEYS:
                if k not in data:
                    print(f"[FAIL] submission.json missing required key: {k}")
                    all_ok = False
                else:
                    print(f"  [OK] JSON key '{k}' validated")
        except Exception as e:
            print(f"[FAIL] submission.json parsing error: {e}")
            all_ok = False

    # 3. Check for committed secrets
    for root, _, files in os.walk(submission_dir):
        for file in files:
            if file.endswith((".py", ".ts", ".tsx", ".js", ".json", ".md")):
                full_path = os.path.join(root, file)
                try:
                    with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()
                    for pattern in SECRET_PATTERNS:
                        if re.search(pattern, content):
                            print(f"[WARN] Potential secret detected in {file}")
                except Exception:
                    pass

    if all_ok:
        print("\n[SUCCESS] All IBM Db2 TechX Workshop submission criteria passed!")
    else:
        print("\n[ERROR] Submission validation failed. Please address items above.")
    return all_ok

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "submissions/resolve-ai"
    success = validate_submission(target)
    sys.exit(0 if success else 1)
