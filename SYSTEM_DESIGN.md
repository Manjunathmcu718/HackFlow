# System Design

## Q1. Real-Time Leaderboard

I would use Server-Sent Events for the public leaderboard and WebSockets for authenticated judge/organizer collaboration. The leaderboard is mostly one-way broadcast from server to many clients, so SSE is simpler, cheaper, and easier to resume with `Last-Event-ID`. For judge panels that may need bidirectional presence later, WebSockets are a better fit.

Each score event should include `submissionId`, `teamId`, `judgeId`, `scoreVersion`, `averageScore`, `rank`, and `createdAt`. The frontend keeps a `lastVersionBySubmission` map and ignores older versions, so out-of-order events cannot overwrite newer scores.

For state updates, TanStack Query can patch the `["submissions"]` cache with `queryClient.setQueryData` instead of re-fetching the whole leaderboard. The rendered list should be memoized, and at larger sizes virtualized, so one score event updates only affected rows.

If the real-time connection drops, the UI shows a small reconnecting indicator, retries with exponential backoff, and falls back to polling every 15-30 seconds. On reconnect, the client sends the last event id or last seen version and requests a delta or full sync.

## Q2. 50,000 Registrations in One Day

The frontend should debounce validation checks such as email lookup and avoid calling the API on every keystroke. Form submission buttons should disable during pending requests, and mutations should use idempotency keys so retries do not create duplicate records.

During high load, the registration UI should show clear progress states: validating, reserving spot, confirmed, or queued. If the backend enables a waiting room, the frontend can display queue position and retry-after timing instead of leaving users guessing.

The public landing page should be static, cacheable, and served from a CDN. Fonts, JS, and CSS should be hashed and long-cacheable. Critical content should render without waiting for dynamic APIs.

If registration returns `503`, the UI should preserve the user's form data locally, show a calm retry message, respect `Retry-After`, and offer a manual retry. It should not clear the form or submit multiple simultaneous attempts.

## Q3. Duplicate Registration Prevention

Before final submission, the client checks the current registration list or a dedicated `/registrations/check?email=...&hackathonId=...` endpoint. If the email is already registered, the UI shows the existing registration status and a path to continue to the participant dashboard.

The backend remains the source of truth. The registration POST should return a structured conflict response such as:

```json
{
  "code": "DUPLICATE_REGISTRATION",
  "registrationId": "BX-123",
  "status": "confirmed",
  "teamName": "ChainBreakers"
}
```

For two tabs submitting at the same time, the backend should enforce a unique constraint on `(hackathonId, email)` plus an idempotency key. The frontend treats either a successful create or duplicate conflict as a recoverable outcome and shows the user their existing registration.

## Q4. Notification System for Announcements

Announcements should reach clients through SSE for participant-facing broadcast. The authenticated organizer dashboard creates announcements through a normal API mutation, and the server publishes the event to subscribed participants.

The UI should use three surfaces: a toast for immediate awareness, a persistent banner for urgent event-wide changes, and a notification center for history. Informational messages can be quiet toasts; warning and urgent messages should remain visible until dismissed.

Priority is represented in the payload as `info`, `warning`, or `urgent`. Urgent messages may trigger stronger visual treatment and require acknowledgement.

Notifications should survive refresh by being stored server-side and loaded on page mount. The client may also cache recently seen ids in localStorage to avoid re-showing dismissed toasts.

When the user is on another tab, the app can update `document.title`, use the Notifications API if permission exists, and synchronize read state through `BroadcastChannel`.

## Q5. Scaling Project Submissions in the Final Hour

For final-hour submissions, the frontend should separate draft saving, file upload, and final submit. Draft saves can be optimistic: show "Saved locally" immediately, then "Synced" after the server confirms. Final submit should show a pending locked state until the server responds.

Uploads should use direct-to-storage signed URLs where possible. Retry failed uploads up to three times with exponential backoff and jitter, while allowing the user to retry manually after that. Large PDF uploads should show progress and preserve metadata if the upload fails.

The API should distinguish draft and final states explicitly:

```json
{ "status": "draft" }
```

versus:

```json
{ "status": "submitted", "submittedAt": "..." }
```

To prevent lost work at 11:58 PM, the form should autosave to localStorage or IndexedDB, save drafts periodically, and restore unsynced fields after reload. If offline, the UI should warn immediately and keep the latest local copy.

When the deadline passes, the UI should stop allowing final submission, keep submitted projects visible as locked, and show a clear closed message for teams without a valid submission. The backend still decides final acceptance based on server time.
