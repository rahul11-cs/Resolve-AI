# Phase 4: Frontend

## Goal
A clean, IBM-style React UI covering the full flow: ask, see ranked fixes, vote, see scores change, view stats.

## Instructions for Bob
Stack: React + Vite + TypeScript + Tailwind, `@carbon/icons-react`. No emojis anywhere. IBM-like look: neutral grays, IBM blue accent (#0f62fe), sharp corners, generous whitespace, IBM Plex Sans font.

```bash
cd frontend
npm create vite@latest . -- --template react-ts
npm install
npm install @carbon/icons-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Structure
```
src/
  api/client.ts        (typed fetch wrappers, base URL from VITE_API_URL)
  components/
    Header.tsx
    ProblemForm.tsx
    SolutionCard.tsx
    SuccessBar.tsx
    Badge.tsx          ("AI estimate" gray / "Community verified" blue)
    VoteButtons.tsx
  pages/
    Home.tsx           (input + results)
    Stats.tsx
  lib/session.ts       (generate and store a random session_id in localStorage)
  App.tsx
```

### Behavior
- **Home:** large textarea for the problem, Submit button, loading state, empty state, error state.
- **SolutionCard:** rank number, title, numbered steps, success bar with text "Worked for X of Y people" (or "No votes yet"), badge, and two buttons: Worked (Checkmark icon) and Didn't work (Close icon).
- **Voting:** optimistic update, then reconcile with the server response. Disable buttons after voting and show a small confirmation. Handle the 409 duplicate error politely.
- **Stats page:** cards for total votes, verified vs estimated counts, and a table of top fixes with success rates. A simple bar chart is optional.
- Accessible: labels, focus states, keyboard navigation, color contrast.
- Responsive for mobile.

## Expected output
```bash
npm run dev     # http://localhost:5173
npm run build   # completes without type errors
```
- Typing "port 3000 already in use" shows ranked solutions with badges.
- Clicking Worked updates the bar and the numbers instantly.
- The Stats page reflects the new vote.

## Checkpoint
Describe what I should see on each screen and show the build output. Wait for my OK before Phase 5.
