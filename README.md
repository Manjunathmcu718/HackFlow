# BeetleX Hackathon Platform

Frontend implementation for the BeetleX hackathon management assignment. The app supports public discovery, registration, participant workflows, project submission, judge scoring, organizer controls, and a public leaderboard.

Current implementation status: the UI flows are complete and navigable, the mock API is MSW-backed, route-level code splitting is enabled, and the application code is implemented in TypeScript/TSX.

## Setup

```bash
npm install
npm run dev
npm run build
```

Useful checks:

```bash
npm run typecheck
npm run lint
```

## Routes

| Route                 | Purpose                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| `/`                   | Public landing page                                                                              |
| `/hackathons`         | Event listing with search, status, track, date filters, and load more                            |
| `/hackathon/:id`      | Event details, rules, prizes, countdown, and sticky registration CTA                             |
| `/register-hackathon` | Multi-step registration with validation and duplicate-email handling                             |
| `/participant`        | Team dashboard, announcements, resources, submission status, leaderboard widget                  |
| `/submit`             | Project submission, draft save, links, video URL, PDF pitch deck upload                          |
| `/judge`              | Judge queue, project details, rubric scoring, comments, completed reviews                        |
| `/organizer`          | Stats, registration export, submissions, announcements, leaderboard publishing, judge assignment |
| `/leaderboard`        | Public leaderboard                                                                               |

## Architecture Decisions

- React 18 + Vite keeps local development fast and maps directly to a static deployment target.
- React Router v6 handles the required multi-page flows without a server framework.
- TanStack Query is used for async server-like state and cache invalidation. Local component state is used for form/UI state to avoid unnecessary global state.
- Tailwind CSS provides responsive styling and shared design tokens. The app also uses small shared components such as `PageShell`, `Navbar`, `Footer`, `StatusBadge`, and `CountdownTimer`.
- `src/lib/mockData.ts` exposes an async `api` object backed by MSW endpoints. Pages call API methods through React Query rather than reading seed data directly, so replacing the mock layer with REST endpoints is straightforward.
- Route-level lazy loading keeps the initial bundle small while loading dashboard-heavy flows on demand.

## Mock API

The mock API is served through MSW and supports:

- `api.hackathons.list()`
- `api.hackathons.get(id)`
- `api.teams.list()`
- `api.submissions.list()`
- `api.submissions.create(data)`
- `api.submissions.update(id, data)`
- `api.registrations.list()`
- `api.registrations.create(data)`
- `api.announcements.list()`
- `api.announcements.create(data)`

Mutations update in-memory arrays through the service worker, so the UI behaves like it is talking to a real backend during local development and review.

## TypeScript, Linting, Formatting

The project includes `tsconfig.json` with strict mode. Route pages, shared components, the mock API layer, MSW handlers, and domain models are typed in TypeScript.

ESLint and Prettier are configured for code-quality checks and formatting.

## Accessibility

The UI uses semantic page sections, labels on form fields, ARIA labels on icon-only links and filters, visible focusable controls, keyboard-friendly native inputs/selects/buttons, and status messaging for submission/registration flows.

## Known Limitations

- Auth and role guards are demo-only; routes are publicly navigable.
- The mock API is in-memory, so data resets on refresh.
- Real-time features are simulated with MSW-backed mutations, query invalidation, notification persistence, and leaderboard rank deltas; a production WebSocket/SSE service is described in `SYSTEM_DESIGN.md`.

## With More Time

- Add Playwright tests for registration, submission, judge scoring, and organizer publishing.
- Add list virtualization for very large organizer tables.
- Connect the notification and leaderboard flows to production SSE/WebSocket infrastructure.

## Bonus Features

Implemented bonus features:

- Dark mode with persisted theme selection.
- AI-style event recommendations on the event listing page, ranked by the user's recent track filter, event status, and participant interest.
- Live leaderboard presentation with rank-delta display and smooth UI updates after score mutations.

Not implemented: production WebSocket/SSE transport. The current real-time behavior is simulated through the mock API layer for local review.
