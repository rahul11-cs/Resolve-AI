# IBM Db2 TechX Workshop: Submission Guide

This guide details the requirements and process for submitting your project to the IBM Db2 TechX Workshop Hackathon.

## 1. Submission Structure

All participant projects must be placed in a dedicated folder under `submissions/<project-slug>/`:
```
submissions/resolve-ai/
├── README.md               # Complete project documentation & rubric alignment
├── architecture.md         # Database schemas, ERDs, and RAG pipelines
├── submission.json         # Metadata configuration for CI automated evaluation
├── .env.example            # Sanitized environment variable template
├── src/                    # Source code directory or link to root implementation
└── docs/screenshots/       # High-resolution screenshots of the working product
```

## 2. Validation

Run the automated validator prior to submitting your pull request:
```bash
python3 scripts/validate_submission.py submissions/resolve-ai
```

## 3. Mandatory Pull Request

1. Fork `rahul11-cs/Resolve-AI-` or push your feature branch.
2. Open a Pull Request targeting `main` with title: `[Submission] Resolve AI - Empirical Troubleshooting Ranked by Db2`.
3. Fill out the pull request checklist in `.github/PULL_REQUEST_TEMPLATE.md`.
4. Ensure CI validation passes.
