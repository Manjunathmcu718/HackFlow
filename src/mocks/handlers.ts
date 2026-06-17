import { delay, http, HttpResponse } from "msw";
import {
  initialAnnouncements,
  initialHackathons,
  initialRegistrations,
  initialSubmissions,
  initialTeams,
} from "./data";
import type { Announcement, DuplicateRegistrationError, Registration, Submission } from "./types";

let hackathons = [...initialHackathons];
let teams = [...initialTeams];
let submissions = [...initialSubmissions];
let registrations = [...initialRegistrations];
let announcements = [...initialAnnouncements];

function jsonCopy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function upsertSubmission(id: string, data: Partial<Submission>) {
  submissions = submissions.map(submission => (submission.id === id ? { ...submission, ...data } : submission));
  return submissions.find(submission => submission.id === id) ?? null;
}

function createSubmission(data: Partial<Submission>) {
  const rec: Submission = {
    id: `s${Date.now()}`,
    hackathon_id: String(data.hackathon_id ?? "1"),
    team_id: String(data.team_id ?? ""),
    team_name: String(data.team_name ?? ""),
    project_title: String(data.project_title ?? ""),
    description: String(data.description ?? ""),
    tech_stack: Array.isArray(data.tech_stack) ? [...data.tech_stack] : [],
    demo_url: String(data.demo_url ?? ""),
    github_url: String(data.github_url ?? ""),
    pitch_deck_url: String(data.pitch_deck_url ?? ""),
    video_url: String(data.video_url ?? ""),
    track: String(data.track ?? ""),
    status: (data.status as Submission["status"]) ?? "draft",
    is_draft: Boolean(data.is_draft),
    scores: Array.isArray(data.scores) ? [...data.scores] : [],
    average_score: Number(data.average_score ?? 0),
    rank: Number(data.rank ?? 0),
    created_date: new Date().toISOString(),
    submitted_at: data.status === "submitted" ? new Date().toISOString() : undefined,
  };

  submissions = [rec, ...submissions];
  return rec;
}

function createRegistration(data: Registration) {
  const rec: Registration = {
    ...data,
    id: `r${Date.now()}`,
    status: "confirmed",
    created_date: new Date().toISOString(),
  };

  registrations = [...registrations, rec];
  return rec;
}

function createAnnouncement(data: Partial<Announcement>) {
  const rec = {
    id: `a${Date.now()}`,
    hackathon_id: String(data.hackathon_id ?? "1"),
    title: String(data.title ?? ""),
    message: String(data.message ?? ""),
    priority: (data.priority as Announcement["priority"]) ?? "info",
    author: String(data.author ?? "Organizer"),
    created_date: new Date().toISOString(),
  };

  announcements = [rec, ...announcements];
  return rec;
}

export const handlers = [
  http.get("/api/hackathons", async () => {
    await delay(80);
    return HttpResponse.json(jsonCopy(hackathons));
  }),
  http.get("/api/hackathons/:id", async ({ params }) => {
    await delay(80);
    const hackathon = hackathons.find(item => item.id === String(params.id)) ?? null;
    return HttpResponse.json(jsonCopy(hackathon));
  }),
  http.get("/api/teams", async () => {
    await delay(80);
    return HttpResponse.json(jsonCopy(teams));
  }),
  http.get("/api/submissions", async () => {
    await delay(80);
    return HttpResponse.json(jsonCopy(submissions));
  }),
  http.patch("/api/submissions/:id", async ({ params, request }) => {
    await delay(80);
    const body = (await request.json()) as Partial<Submission>;
    const updated = upsertSubmission(String(params.id), body);
    return HttpResponse.json(jsonCopy(updated));
  }),
  http.post("/api/submissions", async ({ request }) => {
    await delay(80);
    const body = (await request.json()) as Partial<Submission>;
    const created = createSubmission(body);
    return HttpResponse.json(jsonCopy(created), { status: 201 });
  }),
  http.get("/api/registrations", async () => {
    await delay(80);
    return HttpResponse.json(jsonCopy(registrations));
  }),
  http.post("/api/registrations", async ({ request }) => {
    await delay(80);
    const body = (await request.json()) as Registration;
    const existing = registrations.find(registration => registration.hackathon_id === body.hackathon_id && registration.email === body.email);

    if (existing) {
      const payload: DuplicateRegistrationError = {
        code: "DUPLICATE_REGISTRATION",
        registrationId: existing.id,
        status: existing.status,
        teamName: existing.team_name,
      };
      return HttpResponse.json(payload, { status: 409 });
    }

    const created = createRegistration(body);
    return HttpResponse.json(jsonCopy(created), { status: 201 });
  }),
  http.get("/api/announcements", async () => {
    await delay(80);
    return HttpResponse.json(jsonCopy(announcements));
  }),
  http.post("/api/announcements", async ({ request }) => {
    await delay(80);
    const body = (await request.json()) as Partial<Announcement>;
    const created = createAnnouncement(body);
    return HttpResponse.json(jsonCopy(created), { status: 201 });
  }),
];
