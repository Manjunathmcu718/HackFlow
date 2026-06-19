import React from "react";
import { Link } from "react-router-dom";
import type { CSSProperties, ReactNode } from "react";
import { api } from "@/lib/mockData";
import { useQuery } from "@tanstack/react-query";
import PageShell from "@/components/shared/PageShell";
import StatusBadge from "@/components/shared/StatusBadge";
import { Users, Copy, Send, Megaphone, Clock, ArrowRight, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import ParticipantSidebar from "@/components/participant/ParticipantSidebar";

const LightCard = ({ children, className="", style={} }: { children: ReactNode; className?: string; style?: CSSProperties }) => (
  <div className={`app-card rounded-2xl ${className}`}
    style={{ background:"#fff",border:"1px solid rgba(26,31,60,.08)",boxShadow:"0 2px 12px rgba(0,0,0,.05)",...style }}>
    {children}
  </div>
);

export default function ParticipantDashboard() {
  const { data: hackathons    = [] } = useQuery({ queryKey:["hackathons"],    queryFn:() => api.hackathons.list() });
  const { data: teams         = [] } = useQuery({ queryKey:["teams"],         queryFn:() => api.teams.list() });
  const { data: submissions   = [] } = useQuery({ queryKey:["submissions"],   queryFn:() => api.submissions.list() });
  const { data: announcements = [] } = useQuery({ queryKey:["announcements"], queryFn:() => api.announcements.list() });

  const hackathon      = hackathons.find(h => h.status==="active") || hackathons[0];
  const team           = teams[0];
  const teamSubmission = submissions.find(s => s.team_id === team?.id);
  const notices        = announcements.filter(a => a.hackathon_id === hackathon?.id);

  const priorityIcon  = { urgent:AlertTriangle, warning:Clock, info:Megaphone };
  const priorityColor = { urgent:"#F43F5E", warning:"#F59E0B", info:"#3B82F6" };

  const leaderboardData = submissions.filter(s=>s.status==="submitted"&&s.average_score>0).sort((a,b)=>b.average_score-a.average_score);
  const myRank = leaderboardData.findIndex(s=>s.team_id===team?.id)+1;


  return (
    <PageShell>
      <div className="dark-hero-panel relative overflow-hidden pt-28 pb-12" style={{ background:"linear-gradient(135deg,#FFF5EF 0%,#FFFBF0 60%,#F5FFF8 100%)" }}>
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="dark-hero-content relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background:"linear-gradient(135deg,#F4622A,#FB923C)",boxShadow:"0 8px 28px rgba(244,98,42,.4)" }}>
              <Users className="w-7 h-7 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight" style={{ color:"#1A1F3C" }}>Participant Dashboard</h1>
              <p className="text-base font-semibold mt-0.5" style={{ color:"rgba(26,31,60,.55)" }}>{hackathon?.title}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Team */}
            <LightCard>
              <div className="p-5 pb-3 flex items-center justify-between border-b" style={{ borderColor:"rgba(26,31,60,.07)" }}>
                <div className="flex items-center gap-2 font-semibold text-sm" style={{ color:"#1A1F3C" }}>
                  <Users className="w-4 h-4" style={{ color:"#F4622A" }} aria-hidden="true" /> Team Overview
                </div>
                <StatusBadge status={team?.submission_status||"not_started"} />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-bold text-lg" style={{ color:"#1A1F3C" }}>{team?.name||"Your Team"}</h2>
                    <p className="text-xs font-medium" style={{ color:"rgba(26,31,60,.5)" }}>Track: {team?.track}</p>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
                    style={{ background:"rgba(244,98,42,.08)",border:"1px solid rgba(244,98,42,.2)",color:"#F4622A" }}
                    onClick={() => { navigator.clipboard.writeText(team?.invite_code||""); toast.success("Invite code copied!"); }}
                    aria-label="Copy invite code">
                    <Copy className="w-3 h-3" aria-hidden="true" /> {team?.invite_code}
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(team?.members||[]).map((m,i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background:"rgba(244,98,42,.04)",border:"1px solid rgba(244,98,42,.1)" }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold text-white flex-shrink-0"
                        style={{ background:"linear-gradient(135deg,#F4622A,#FB923C)" }} aria-hidden="true">
                        {m.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color:"#1A1F3C" }}>{m.name}</p>
                        <p className="text-xs" style={{ color:"rgba(26,31,60,.5)" }}>{m.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </LightCard>

            {/* Submission */}
            <LightCard>
              <div className="p-5 pb-3 flex items-center justify-between border-b" style={{ borderColor:"rgba(26,31,60,.07)" }}>
                <div className="flex items-center gap-2 font-semibold text-sm" style={{ color:"#1A1F3C" }}>
                  <Send className="w-4 h-4" style={{ color:"#F4622A" }} aria-hidden="true" /> Submission
                </div>
                <StatusBadge status={teamSubmission?.status||"draft"} />
              </div>
              <div className="p-5">
                {teamSubmission ? (
                  <div className="mb-4">
                    <h3 className="font-bold mb-1" style={{ color:"#1A1F3C" }}>{teamSubmission.project_title}</h3>
                    <p className="text-sm line-clamp-2 mb-3" style={{ color:"rgba(26,31,60,.55)" }}>{teamSubmission.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(teamSubmission.tech_stack||[]).map(t=><span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-full pill-violet">{t}</span>)}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-center py-3 mb-4" style={{ color:"rgba(26,31,60,.45)" }}>No submission yet. Start building!</p>
                )}
                <Link to="/submit">
                  <button className="btn-primary w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold">
                    {teamSubmission?"Edit Submission":"Start Submission"} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </Link>
              </div>
            </LightCard>

            {/* Announcements */}
            <LightCard>
              <div className="p-5 pb-3 border-b" style={{ borderColor:"rgba(26,31,60,.07)" }}>
                <div className="flex items-center gap-2 font-semibold text-sm" style={{ color:"#1A1F3C" }}>
                  <Megaphone className="w-4 h-4" style={{ color:"#F4622A" }} aria-hidden="true" /> Announcements
                </div>
              </div>
              <div className="p-5 space-y-3" aria-live="polite">
                {notices.slice(0,5).map(a=>{
                  const Icon=priorityIcon[a.priority]||Megaphone;
                  return (
                    <article key={a.id} className="flex gap-3 p-3 rounded-xl"
                      style={{ background:"rgba(26,31,60,.03)",border:"1px solid rgba(26,31,60,.06)" }}>
                      <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color:priorityColor[a.priority]||"rgba(26,31,60,.4)" }} aria-hidden="true" />
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold" style={{ color:"#1A1F3C" }}>{a.title}</p>
                          <StatusBadge status={a.priority} />
                        </div>
                        <p className="text-xs" style={{ color:"rgba(26,31,60,.55)" }}>{a.message}</p>
                        <p className="text-[10px] mt-1" style={{ color:"rgba(26,31,60,.35)" }}>
                          {a.created_date ? format(new Date(a.created_date),"MMM d, h:mm a") : ""}
                        </p>
                      </div>
                    </article>
                  );
                })}
                {notices.length===0&&<p className="text-center py-6 text-sm" style={{ color:"rgba(26,31,60,.4)" }}>No announcements yet.</p>}
              </div>
            </LightCard>
          </div>

          <ParticipantSidebar
            hackathon={hackathon}
            leaderboardData={leaderboardData}
            myRank={myRank}
            LightCard={LightCard}
          />
        </div>
      </div>
    </PageShell>
  );
}

