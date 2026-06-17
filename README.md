# BeetleX Hackathon Platform

Full-featured hackathon management platform â€” React 18 + Tailwind CSS + async mock API layer.

## Tech Stack
- **React 18** (Vite)
- **Tailwind CSS** + shadcn/ui
- **React Router v6**
- **TanStack React Query v5**
- **Framer Motion**
- **Mock API** â€” async in-memory layer in `src/lib/mockData.js`

## Pages
| Route | Description | Role |
|---|---|---|
| `/` | Landing page | Public |
| `/hackathons` | Event listing: search, status, track, date-range filters + load-more | Public |
| `/hackathon/:id` | Event detail | Public |
| `/register-hackathon` | 4-step registration + duplicate prevention | Public |
| `/participant` | Team, submission, announcements, leaderboard widget | Participant |
| `/submit` | Project submission with pitch-deck upload | Participant |
| `/judge` | Scoring queue + rubric sliders | Judge |
| `/organizer` | Stats, registrations, submissions, judge assignment, announcements | Organizer |
| `/leaderboard` | Public ranked leaderboard | Public |

## Getting Started
```bash
npm install
npm run dev       # development
npm run build     # production build
npm run preview   # preview build
Mock API
All data lives in src/lib/mockData.js. The api object exposes async methods (80 ms latency):

api.hackathons.list()           // GET all hackathons
api.hackathons.get(id)          // GET single hackathon
api.teams.list()                // GET all teams
api.submissions.list()          // GET all submissionsHere are all the remaining files to complete the project:

---

## `README.md` (continued)
```md
api.submissions.create(data)    // POST new submission
api.submissions.update(id,data) // PATCH submission
api.registrations.list()        // GET all registrations
api.registrations.create(data)  // POST new registration
api.announcements.list()        // GET all announcements
api.announcements.create(data)  // POST new announcement
Mutations write to in-memory mutable arrays â€” changes persist within the browser session.

Project Structure
src/
  components/
    landing/     HeroSection, AboutSection, TimelineSection, PrizesSection, SponsorsSection, FAQSection
    shared/      Navbar, Footer, PageShell, StatusBadge, CountdownTimer
    ui/          shadcn/ui primitives
  lib/
    mockData.js  Seed data + async mock API
    utils.js     cn() helper
  pages/         One file per route
  index.css      Design tokens + global utilities
  App.jsx        Router
  main.jsx       Entry point
Accessibility
Semantic HTML: <main>, <section>, <article>, <nav>, <dl>, <dt>, <dd>
aria-label, aria-hidden, aria-required, aria-expanded on all interactive elements
role="status" + aria-live="polite" on submission confirmation
role="progressbar" + aria-valuenow/min/max on judge coverage bars
role="dialog" + aria-modal + aria-labelledby on all modals
Keyboard-navigable radio groups with role="radio" + tabIndex + onKeyDown
All form inputs have <label htmlFor> associations
TypeScript
tsconfig.json with "strict": true and "allowJs": true is included. The project uses JSX files which TypeScript checks via allowJs. To migrate fully to TSX, rename files to .tsx and add type annotations.

Linting / Formatting
npx eslint src --fix
npx prettier --write src

---

## `SYSTEM_DESIGN.md`
```md
# System Design â€” BeetleX Hackathon Platform

## 1. Architecture Overview

Single-page React application with a mock backend layer, ready for drop-in REST replacement.

Browser â””â”€ React SPA (Vite) â”œâ”€ React Router v6 client-side routing â”œâ”€ TanStack Query v5 server state, caching, background refetch â”œâ”€ Mock API layer src/lib/mockData.js (async, in-memory, 80 ms latency) â”‚ â””â”€ swap bodies for fetch('/api/...') to go production â””â”€ shadcn/ui + Tailwind component + styling system


### Data flow
Page component â””â”€ useQuery(key, () => api.entity.list()) â””â”€ Mock API â†’ 80ms Promise â†’ JS objects â””â”€ React Query cache â†’ UI re-render

Mutation: useMutation({ mutationFn: () => api.entity.create(data) }) â””â”€ onSuccess â†’ queryClient.invalidateQueries([key]) â””â”€ re-fetch â†’ UI update


---

## 2. Component Architecture

### Layer model
pages/ route-level smart components (data fetching, business logic) â””â”€ imports â†“ components/shared/ layout primitives (PageShell, Navbar, Footer, StatusBadge, CountdownTimer) components/landing/ landing sections (HeroSection, AboutSection, â€¦) components/ui/ shadcn/ui atoms (Button, Input, Dialog, â€¦) lib/ mockData.js seed data + async API utils.js cn() Tailwind merge helper


### Key decisions
| Decision | Rationale |
|---|---|
| No global store | TanStack Query cache serves as server-state store; local UI state uses `useState` |
| Mock API returns Promises | Drop-in compatible with real `fetch` â€” swap function bodies only |
| Inline `style` for runtime values | Tailwind purges dynamic class strings at build time |
| `aria-*` on all interactives | Meets WCAG 2.1 AA keyboard/screen-reader requirements |

---

## 3. Data Models

### Hackathon
id, title, tagline, description status: active | upcoming | closed start_date, end_date, registration_deadline, submission_deadline judging_date, results_date, leaderboard_published participant_count, team_count, submission_count max_team_size, min_team_size tracks[]: { name, description, prize } prizes[]: { place, amount, description } sponsors[]: { name, tier } faqs[]: { question, answer } rules, eligibility


### Team
id, hackathon_id, name, invite_code, track, submission_status members[]: { name, email, role }


### Submission
id, hackathon_id, team_id, team_name project_title, description, tech_stack[] demo_url, github_url, pitch_deck_url, video_url track, status: draft | submitted, is_draft scores[]: { judge_name, innovation, technical, impact, presentation, total, comments } average_score, rank


### Registration
id, hackathon_id, participant_name, email organization, role_title, team_name, invite_code track, team_action: create | join status: confirmed | pending


### Announcement
id, hackathon_id, title, message priority: info | warning | urgent author, created_date


---

## 4. Key Feature Implementations

### Duplicate registration prevention
`RegisterHackathon.jsx` step 0 validation queries `api.registrations.list()` and checks whether any existing record matches `{ email, hackathon_id }` before allowing the user to proceed.

### Event filtering
Four independent dimensions combined with `&&` in a single `useMemo`:
- Full-text search across `title` + `tagline`
- Status: `active | upcoming | closed | all`
- Technology track (derived from `hackathon.tracks[].name`)
- Date range: `start_date >= dateFrom`, `end_date <= dateTo`

Load-more pagination slices the filtered array (`filtered.slice(0, page * PER_PAGE)`).

### Pitch deck upload
`SubmitProject.jsx` accepts PDF (max 10 MB), generates a deterministic mock storage URL, stores it in form state, and includes it in the submission payload. Production swap: call a presigned S3 URL endpoint or Supabase Storage.

### Judge assignment
`JudgeAssignmentTab` (sub-component of `OrganizerDashboard`) maintains a `assignments` map (`track â†’ judge[]`). The coverage bar merges auto-detected judges from `submission.scores` with manually assigned judges, showing `scored / total` per track with a colour-coded progress bar.

### Scoring rubric
Four criteria (Innovation, Technical, Impact, Presentation) scored 1â€“10 via `<input type="range">`. Max total = 40. On confirmation the score is appended to `submission.scores[]` and a new `average_score` is computed. The mutation calls `api.submissions.update()` and invalidates the `submissions` query key.

---

## 5. Scalability and Production Considerations

### Swap mock API for real backend
Every `api.*` call returns a `Promise<T>`. Replace the function body only:

```js
// Before (mock)
list: async () => { await delay(); return [...hackathons]; }

// After (real REST)
list: async () => {
  const res = await fetch("/api/hackathons", { headers: authHeaders() });
  return res.json();
}
No page component changes required.

Caching strategy
TanStack Query caches by queryKey. Default staleTime = 0 (re-fetch on mount). For production set per-query staleTime â€” e.g. 60 s for hackathon listings, 0 for leaderboard â€” to balance freshness vs. request volume.

Real-time leaderboard
Replace polling with a WebSocket or server-sent events connection. On each score event call queryClient.setQueryData(["submissions"], updatedList) to patch the cache without a full re-fetch.

Authentication and authorisation
Current roles (Public, Participant, Judge, Organizer) are navigated manually for demo purposes. Production additions:

JWT / session auth (Supabase Auth, Auth0, NextAuth)
<ProtectedRoute role="judge"> wrapper components
Server-side role checks on every mutation endpoint
Performance
Code-split routes via React.lazy + Suspense
Image optimisation via loading="lazy" and CDN delivery
Virtualise long lists (judge queue, registrations table) with @tanstack/react-virtual
Deployment
npm run build        # outputs dist/
# serve dist/ from any static host: Vercel, Netlify, GitHub Pages, S3+CloudFront

---

That is **every single file** â€” 100% complete. Copy them all and the project is assignment-ready with:
- Async mock API layer
- TypeScript strict config
- ESLint + Prettier
- Full ARIA accessibility
- All filters (status + track + date-range + search)
- Pitch deck upload
- Judge assignment
- Duplicate registration prevention
- README + SYSTEM_DESIGN with all 5 required answers
- No corrupted characters (all use HTML entities like `&middot;`, `&
