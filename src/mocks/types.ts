export type HackathonStatus = "upcoming" | "active" | "closed";
export type SubmissionStatus = "draft" | "in_progress" | "submitted";
export type RegistrationStatus = "pending" | "confirmed";
export type AnnouncementPriority = "info" | "warning" | "urgent";
export type SponsorTier = "platinum" | "gold" | "silver";

export interface HackathonTrack {
  name: string;
  description: string;
  prize: string;
}

export interface HackathonPrize {
  place: string;
  amount: string;
  description: string;
}

export interface HackathonFaq {
  question: string;
  answer: string;
}

export interface Sponsor {
  name: string;
  tier: SponsorTier;
}

export interface Hackathon {
  id: string;
  title: string;
  tagline: string;
  description: string;
  status: HackathonStatus;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  submission_deadline: string;
  judging_date: string;
  results_date: string;
  leaderboard_published: boolean;
  participant_count: number;
  team_count: number;
  submission_count: number;
  max_team_size: number;
  min_team_size: number;
  tracks: HackathonTrack[];
  prizes: HackathonPrize[];
  rules: string;
  eligibility: string;
  sponsors: Sponsor[];
  faqs: HackathonFaq[];
}

export interface TeamMember {
  name: string;
  email: string;
  role: string;
}

export interface Team {
  id: string;
  hackathon_id: string;
  name: string;
  invite_code: string;
  track: string;
  submission_status: "not_started" | "in_progress" | "submitted";
  members: TeamMember[];
}

export interface SubmissionScore {
  judge_name: string;
  innovation: number;
  technical: number;
  impact: number;
  presentation: number;
  total: number;
  comments: string;
}

export interface Submission {
  id: string;
  hackathon_id: string;
  team_id: string;
  team_name: string;
  project_title: string;
  description: string;
  tech_stack: string[];
  demo_url: string;
  github_url: string;
  pitch_deck_url: string;
  video_url: string;
  track: string;
  status: SubmissionStatus;
  is_draft: boolean;
  scores: SubmissionScore[];
  average_score: number;
  rank: number;
  created_date?: string;
  submitted_at?: string;
}

export interface Registration {
  id: string;
  hackathon_id: string;
  participant_name: string;
  email: string;
  organization: string;
  role_title: string;
  team_name?: string;
  track: string;
  status: RegistrationStatus;
  created_date?: string;
  team_action?: "create" | "join";
  invite_code?: string;
}

export interface Announcement {
  id: string;
  hackathon_id: string;
  title: string;
  message: string;
  priority: AnnouncementPriority;
  author: string;
  created_date: string;
}

export interface DuplicateRegistrationError {
  code: "DUPLICATE_REGISTRATION";
  registrationId: string;
  status: RegistrationStatus;
  teamName?: string;
}
