import React, { useState, type CSSProperties } from "react";
import { api } from "@/lib/mockData";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageShell from "@/components/shared/PageShell";
import StatusBadge from "@/components/shared/StatusBadge";
import { Users, FileText, Gavel, Trophy, Megaphone, Search, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import type { AnnouncementPriority, Hackathon, Registration, Submission } from "@/mocks/types";
import JudgeAssignmentTab from "@/components/organizer/JudgeAssignmentTab";
import OrganizerHeader from "@/components/organizer/OrganizerHeader";
import AnnouncementModal from "@/components/organizer/AnnouncementModal";
import RegistrationsTab from "@/components/organizer/RegistrationsTab";

export default function OrganizerDashboard() {
  const queryClient = useQueryClient();
  const [searchReg, setSearchReg] = useState("");
  const [searchSub, setSearchSub] = useState("");
  const [showAnnounce, setShowAnnounce] = useState(false);
  const [announcement, setAnnouncement] = useState<{ title: string; message: string; priority: AnnouncementPriority }>({ title: "", message: "", priority: "info" });
  const [leaderboardPublished, setPublished] = useState(true);
  const [activeTab, setActiveTab] = useState("registrations");

  const hackathonsQuery = useQuery<Hackathon[]>({ queryKey: ["hackathons"], queryFn: () => api.hackathons.list() as Promise<Hackathon[]> });
  const registrationsQuery = useQuery<Registration[]>({ queryKey: ["registrations"], queryFn: () => api.registrations.list() as Promise<Registration[]> });
  const teamsQuery = useQuery<{ id: string }[]>({ queryKey: ["teams"], queryFn: () => api.teams.list() as Promise<{ id: string }[]> });
  const submissionsQuery = useQuery<Submission[]>({ queryKey: ["submissions"], queryFn: () => api.submissions.list() as Promise<Submission[]> });
  const announcementsQuery = useQuery({ queryKey: ["announcements"], queryFn: () => api.announcements.list() as Promise<import("@/mocks/types").Announcement[]> });
  const hackathons = hackathonsQuery.data || [];
  const registrations = registrationsQuery.data || [];
  const teams = teamsQuery.data || [];
  const submissions = submissionsQuery.data || [];
  const announcements = announcementsQuery.data || [];
  const hasLoadError = hackathonsQuery.isError || registrationsQuery.isError || teamsQuery.isError || submissionsQuery.isError || announcementsQuery.isError;

  const hackathon = hackathons.find(h=>h.status==="active") || hackathons[0];

  const announceMutation = useMutation({
    mutationFn: (data: { title: string; message: string; priority: AnnouncementPriority }) => api.announcements.create({ ...data, hackathon_id: hackathon?.id, author: "Organizer" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setShowAnnounce(false); setAnnouncement({ title: "", message: "", priority: "info" });
      toast.success("Announcement sent!");
    },
  });

  const filteredRegs = registrations.filter((r: Registration) => r.participant_name?.toLowerCase().includes(searchReg.toLowerCase()) || r.email?.toLowerCase().includes(searchReg.toLowerCase()));
  const filteredSubs = submissions.filter((s: Submission) => s.project_title?.toLowerCase().includes(searchSub.toLowerCase()) || s.team_name?.toLowerCase().includes(searchSub.toLowerCase()));
  const judgesActive = [...new Set(submissions.flatMap((s: Submission) => (s.scores || []).map(sc => sc.judge_name)))].length;

  const STATS = [
    { label:"Registrations", value:registrations.length,                                    icon:Users,    color:"#3B82F6", bg:"rgba(59,130,246,.1)" },
    { label:"Teams",         value:teams.length,                                             icon:Users,    color:"#10B981", bg:"rgba(16,185,129,.1)" },
    { label:"Submissions",   value:submissions.filter((s: Submission) => s.status==="submitted").length,     icon:FileText, color:"#F59E0B", bg:"rgba(245,158,11,.1)" },
    { label:"Judges Active", value:judgesActive,                                             icon:Gavel,    color:"#7C4DFF", bg:"rgba(124,77,255,.1)" },
  ];

  const exportCSV = () => {
    const headers = "Name,Email,Organization,Role,Team,Track,Status\n";
    const rows = registrations.map((r: Registration) => `"${r.participant_name}","${r.email}","${r.organization}","${r.role_title}","${r.team_name||""}","${r.track}","${r.status}"`).join("\n");
    const url  = URL.createObjectURL(new Blob([headers+rows],{type:"text/csv"}));
    Object.assign(document.createElement("a"),{href:url,download:"registrations.csv"}).click();
    toast.success("CSV exported!");
  };

  const thS: CSSProperties = { padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "rgba(26,31,60,.5)", borderBottom: "1px solid rgba(26,31,60,.08)", background: "rgba(26,31,60,.02)" };
  const tdS: CSSProperties = { padding: "12px 14px", fontSize: 13, borderBottom: "1px solid rgba(26,31,60,.05)" };

  const TABS = ["registrations","submissions","leaderboard","announcements","judges"];

  if (hasLoadError) return (
    <PageShell>
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <AlertTriangle className="w-10 h-10 mx-auto mb-4" style={{ color:"#F43F5E" }} aria-hidden="true" />
        <h1 className="font-heading text-2xl font-bold mb-3" style={{ color:"#1A1F3C" }}>Could Not Load Organizer Data</h1>
        <p style={{ color:"rgba(26,31,60,.55)" }}>Please refresh and try again.</p>
      </div>
    </PageShell>
  );

  return (
    <PageShell>
      <OrganizerHeader
        title={hackathon?.title}
        stats={STATS}
        tabs={TABS}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onBroadcast={() => setShowAnnounce(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {activeTab==="registrations"&&(
          <RegistrationsTab
            registrations={registrations}
            filteredRegs={filteredRegs}
            searchReg={searchReg}
            setSearchReg={setSearchReg}
            exportCSV={exportCSV}
            thS={thS}
            tdS={tdS}
          />
        )}

        {/* Submissions */}
        {activeTab==="submissions"&&(
          <div className="rounded-2xl overflow-hidden" style={{ background:"#fff",border:"1px solid rgba(26,31,60,.09)" }}>
            <div className="p-5 flex items-center justify-between flex-wrap gap-3 border-b" style={{ borderColor:"rgba(26,31,60,.08)" }}>
              <h2 className="font-heading font-bold text-base" style={{ color:"#1A1F3C" }}>All Submissions ({submissions.length})</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:"rgba(26,31,60,.35)" }} aria-hidden="true" />
                <input placeholder="Search..." value={searchSub} onChange={e=>setSearchSub(e.target.value)}
                  className="pl-9 h-9 rounded-xl text-sm outline-none w-56"
                  style={{ background:"rgba(26,31,60,.04)",border:"1px solid rgba(26,31,60,.08)",color:"#1A1F3C" }}
                  aria-label="Search submissions" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr><th style={thS}>Project</th><th style={thS}>Team</th><th style={thS}>Track</th><th style={thS}>Status</th><th style={thS}>Score</th></tr></thead>
                <tbody>
                  {filteredSubs.map((s) => (
                    <tr key={s.id}>
                      <td style={{...tdS,fontWeight:600,color:"#1A1F3C"}}>{s.project_title}</td>
                      <td style={{...tdS,color:"rgba(26,31,60,.7)"}}>{s.team_name}</td>
                      <td style={{...tdS,color:"rgba(26,31,60,.7)"}}>{s.track}</td>
                      <td style={tdS}><StatusBadge status={s.status} /></td>
                      <td style={tdS}>{s.average_score>0?<span className="font-mono font-bold" style={{ color:"#F4622A" }}>{s.average_score}/40</span>:<span style={{ color:"rgba(26,31,60,.3)" }}>&mdash;</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        {activeTab==="leaderboard"&&(
          <div className="rounded-2xl overflow-hidden" style={{ background:"#fff",border:"1px solid rgba(26,31,60,.09)" }}>
            <div className="p-5 flex items-center justify-between border-b" style={{ borderColor:"rgba(26,31,60,.08)" }}>
              <h2 className="font-heading font-bold text-base flex items-center gap-2" style={{ color:"#1A1F3C" }}>
                <Trophy className="w-4 h-4" style={{ color:"#F59E0B" }} aria-hidden="true" /> Leaderboard Control
              </h2>
              <button onClick={()=>setPublished(p=>!p)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                style={leaderboardPublished?{background:"rgba(239,68,68,.1)",color:"#EF4444",border:"1px solid rgba(239,68,68,.2)"}:{background:"rgba(16,185,129,.1)",color:"#10B981",border:"1px solid rgba(16,185,129,.2)"}}>
                {leaderboardPublished?<><EyeOff className="w-4 h-4" aria-hidden="true" /> Unpublish</>:<><Eye className="w-4 h-4" aria-hidden="true" /> Publish Results</>}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr><th style={{ ...thS, width: 48 }}>#</th><th style={thS}>Team</th><th style={thS}>Project</th><th style={thS}>Track</th><th style={thS}>Avg Score</th><th style={thS}>Reviews</th></tr></thead>
                <tbody>
                  {submissions.filter((s) => s.status === "submitted").sort((a, b) => (b.average_score || 0) - (a.average_score || 0)).map((s, i) => (
                    <tr key={s.id}>
                      <td style={{...tdS,fontFamily:"monospace",fontWeight:700,color:"#1A1F3C"}}>{i+1}</td>
                      <td style={{...tdS,fontWeight:600,color:"#1A1F3C"}}>{s.team_name}</td>
                      <td style={{...tdS,color:"rgba(26,31,60,.7)"}}>{s.project_title}</td>
                      <td style={tdS}><span className="text-xs font-semibold px-2 py-0.5 rounded-full pill-violet">{s.track}</span></td>
                      <td style={{...tdS,fontFamily:"monospace",fontWeight:700,color:"#F4622A"}}>{s.average_score||"&mdash;"}</td>
                      <td style={{...tdS,color:"rgba(26,31,60,.6)"}}>{s.scores?.length||0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Announcements */}
        {activeTab==="announcements"&&(
          <div className="rounded-2xl" style={{ background:"#fff",border:"1px solid rgba(26,31,60,.09)" }}>
            <div className="p-5 flex items-center justify-between border-b" style={{ borderColor:"rgba(26,31,60,.08)" }}>
              <h2 className="font-heading font-bold text-base" style={{ color:"#1A1F3C" }}>Announcements ({announcements.length})</h2>
              <button onClick={()=>setShowAnnounce(true)} className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-full text-sm">
                <Megaphone className="w-3.5 h-3.5" aria-hidden="true" /> New
              </button>
            </div>
            <div className="p-5 space-y-3" aria-live="polite">
              {announcements.map(a=>(
                <article key={a.id} className="p-4 rounded-xl" style={{ background:"rgba(26,31,60,.03)",border:"1px solid rgba(26,31,60,.08)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm" style={{ color:"#1A1F3C" }}>{a.title}</h3>
                    <StatusBadge status={a.priority} />
                  </div>
                  <p className="text-sm" style={{ color:"rgba(26,31,60,.6)" }}>{a.message}</p>
                  <p className="text-xs mt-2" style={{ color:"rgba(26,31,60,.35)" }}>{a.created_date?format(new Date(a.created_date),"MMM d, h:mm a"):""}</p>
                </article>
              ))}
              {announcements.length===0&&<p className="text-center py-8" style={{ color:"rgba(26,31,60,.4)" }}>No announcements yet</p>}
            </div>
          </div>
        )}

        {/* Judge Assignment */}
        {activeTab==="judges"&&<JudgeAssignmentTab hackathon={hackathon} submissions={submissions} />}
      </div>

      {showAnnounce&&(
        <AnnouncementModal
          announcement={announcement}
          announceMutation={announceMutation}
          setAnnouncement={setAnnouncement}
          setShowAnnounce={setShowAnnounce}
        />
      )}
    </PageShell>
  );
}

