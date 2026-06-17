# BeetleX Hackathon Platform

Frontend implementation for the BeetleX hackathon management assignment. The app supports public discovery, registration, participant workflows, project submission, judge scoring, organizer controls, and a public leaderboard.

Current implementation status: the UI flows are complete and navigable, the mock API is now MSW-backed, and the codebase is still JSX-first with `allowJs` outside the typed mock/data layer.

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
- `src/lib/mockData.js` exposes an async `api` object with simulated latency. Pages call API methods through React Query rather than reading seed data directly, so replacing the mock layer with REST endpoints is straightforward.

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

The project includes `tsconfig.json` with strict mode and `allowJs` enabled, so the existing JSX code is checked by TypeScript tooling, but it is not a full `.tsx` migration.

The mock API layer and MSW handlers are typed in TypeScript.

A full production migration would rename files to `.tsx` and add explicit interfaces for hackathons, submissions, teams, registrations, and announcements.

ESLint and Prettier are configured for code-quality checks and formatting.

## Accessibility

The UI uses semantic page sections, labels on form fields, ARIA labels on icon-only links and filters, visible focusable controls, keyboard-friendly native inputs/selects/buttons, and status messaging for submission/registration flows.

## Known Limitations

- Auth and role guards are demo-only; routes are publicly navigable.
- The mock API is in-memory, so data resets on refresh.
- TypeScript strict checking is enabled through `allowJs`; the codebase is not fully migrated to `.tsx`.
- Real-time features are represented as product-ready design in `SYSTEM_DESIGN.md`, not a live WebSocket service.

## With More Time

- Convert all route and component files to `.tsx` with explicit domain types.
- Add Playwright tests for registration, submission, judge scoring, and organizer publishing.
- Add route-level code splitting and list virtualization for very large organizer tables.

## Bonus Features

Implemented bonus feature: dark mode with persisted theme selection.

Not implemented: real-time notifications, AI-powered recommendations, and live leaderboard rank-delta transport.
