# Phase 4: Frontend UI (IBM Carbon Design Language)

## 1. Goal
Construct a high-contrast, data-dense, professional troubleshooting interface adhering to the IBM Carbon Design System aesthetic. Zero emojis, precise monochrome styling with IBM Blue accent (`#0f62fe`), tabular numerals, and responsive layouts.

## 2. Component Taxonomy

- **Header (`src/components/Header.tsx`)**:
  - Wordmark: "IBM FixRank" with technical sub-discipline breadcrumbs.
  - Live system connectivity status for Db2 and Ollama Granite.
  - Direct navigation across Troubleshooting, Live Analytics Dashboard, and Roadmap Docs.
- **ProblemForm (`src/components/ProblemForm.tsx`)**:
  - High-contrast search textarea with keyboard shortcuts (`Cmd/Ctrl + Enter`).
  - Common error signature chips for instant 1-click reproduction.
  - OS filter toggle (All / Linux / macOS / Windows).
- **SolutionCard (`src/components/SolutionCard.tsx`)**:
  - Rank badge (`#01`, `#02`, `#03`).
  - Title and category tags.
  - Honest score label: `"AI estimate"` (neutral gray) vs `"Community verified"` (IBM blue).
  - Quantitative success bar: "Worked for X of Y engineers" with lower-bound confidence display.
  - Numbered steps with syntax-highlighted code blocks and clipboard copy affordances.
  - Security warning box if high-risk shell commands (`rm -rf`, `chmod 777`, `sudo | bash`) are detected.
  - Worked (`Checkmark`) and Didn't work (`Close`) interactive buttons with optimistic updates.
- **Stats Dashboard (`src/pages/Stats.tsx`)**:
  - KPI tiles: Total Community Votes, Verified Solutions, Cold-Start Pool, Average Confidence.
  - Wilson vs. Simple Ratio comparison chart/interactive simulator.
  - Leaderboard data table with sortable columns and tabular figures.
- **Roadmap & Architecture Viewer (`src/pages/Roadmap.tsx`)**:
  - Interactive browser for all project `.md` phases, schema definitions, and guardrail policies.

## 3. Visual System Specs
- Neutral Canvas: `#f4f4f4` (Light) / `#161616` (Carbon Dark)
- Accent: IBM Carbon Blue `#0f62fe`
- Typography: IBM Plex Sans (Prose), IBM Plex Mono (Code & tabular figures)
- Radii: 0px to 2px (sharp enterprise corners)
