import React, { useState } from "react";
import { hackathons, registrations, teams, submissions, announcements as defaultAnnouncements } from "../lib/mockData";
import PageShell from "../components/shared/PageShell";
import StatusBadge from "../components/shared/StatusBadge";
import { Users, FileText, Gavel, Trophy, Megaphone, Send, Search, Download, Eye, EyeOff, BarChart3, X } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function OrganizerDashboard() {
  const [searchReg, setSearchReg] = useState("");
  const [searchSub, setSearchSub] = useState("");
  const [showAnnounce, setShowAnnounce] = useState(false);
  const [announcement, setAnnouncement] = useState({ title:"", message:"", priority:"info" });
  const [leaderboardPublished, setLeaderboardPublished] = useState(true);
  const [localAnnouncements, setLocalAnnouncements] = useState(defaultAnnouncements);
  const [activeTab, setActiveTab] = useState("registrations");

  const hackathon = hackathons.find(h => h.status==="active") || hackathons[0];

  const filteredRegs = registrations.filter(r =>
    r.participant_name?.toLowerCase().includes(searchReg.toLowerCase()) ||
    r.email?.toLowerCase().includes(searchReg.toLowerCase())
  );
  const filteredSubs = submissions.filter(s =>
    s.project_title?.toLowerCase().includes(searchSub.toLowerCase()) ||
    s.team_name?.toLowerCase().includes(searchSub.toLowerCase())
  );

  const judgesActive = [...new Set(submissions.flatMap(s => (s.scores||[]).map(sc => sc.judge_name)))].length;

  const stats = [
    { label:"Registrations", value:registrations.length,                                       icon:Users,    color:"#3B82F6", bg:"rgba(59,130,246,.1)" },
    { label:"Teams",         value:teams.length,                                                icon:Users,    color:"#10B981", bg:"rgba(16,185,129,.1)" },
    { label:"Submissions",   value:submissions.filter(s=>s.status==="submitted").length,        icon:FileText, color:"#F59E0B", bg:"rgba(245,158,11,.1)" },
    { label:"Judges Active", value:judgesActive,                                                icon:Gavel,    color:"#7C4DFF", bg:"rgba(124,77,255,.1)" },
  ];

  const exportCSV = () => {
    const headers = "Name,Email,Organization,Role,Team,Track,Status\n";
    const rows = registrations.map(r => `"${r.participant_name}","${r.email}","${r.organization}","${r.role_title}","${r.team_name||""}","${r.track}","${r.status}"`).join("\n");
    const blob = new Blob([headers+rows], { type:"text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href=url; a.download="registrations.csv"; a.click();
  };

  const thStyle = { padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", color:"rgba(26,31,60,.5)", borderBottom:"1px solid rgba(26,31,60,.08)", background:"rgba(26,31,60,.02)" };
  const tdStyle = { padding:"12px 14px", fontSize:13, borderBottom:"1px solid rgba(26,31,60,.05)" };

  const TABS = [
    { val:"registrations",  label:"Registrations" },
    { val:"submissions",    label:"Submissions" },
    { val:"leaderboard",    label:"Leaderboard" },
    { val:"announcements",  label:"Announcements" },
  ];

  return (
    <PageShell>
      {/* Header */}
      <div className="relative overflow-hidden pt-28 pb-12" style={{ background:"linear-gradient(135deg,#FFF5EF 0%,#F5F0FF 50%,#F0F8FF 100%)" }}>
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background:"linear-gradient(135deg,#F4622A,#FB923C)", boxShadow:"0 8px 28px rgba(244,98,42,.4)" }}>
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight" style={{ color:"#1A1F3C" }}>Organizer Dashboard</h1>
                <p className="text-base font-semibold mt-0.5" style={{ color:"rgba(26,31,60,.55)" }}>{hackathon?.title}</p>
              </div>
            </div>
            <button className="btn-primary flex items-center gap-2 px-6 py-3 rounded-2xl text-sm" onClick={() => setShowAnnounce(true)}>
              <Megaphone className="w-4 h-4" /> Broadcast
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="card-light rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background:s.bg }}>
                  <s.icon className="w-5 h-5" style={{ color:s.color }} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold" style={{ color:"#1A1F3C" }}>{s.value}</p>
                  <p className="text-xs font-medium" style={{ color:"rgba(26,31,60,.45)" }}>{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 p-1.5 rounded-2xl mb-6 organizer-tabs"
          style={{ background:"rgba(244,98,42,.08)", border:"1px solid rgba(244,98,42,.18)", width:"fit-content" }}>
          {TABS.map(tab => (
            <button key={tab.val} onClick={() => setActiveTab(tab.val)}
              data-state={activeTab===tab.val?"active":"inactive"}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all">
              {tab.label}
            </button>
          ))}
        </div>

        {/* Registrations */}
        {activeTab==="registrations" && (
          <div className="rounded-2xl overflow-hidden" style={{ background:"#fff", border:"1px solid rgba(26,31,60,.09)" }}>
            <div className="p-5 flex items-center justify-between flex-wrap gap-3 border-b" style={{ borderColor:"rgba(26,31,60,.08)" }}>
              <h2 className="font-heading font-bold text-base" style={{ color:"#1A1F3C" }}>Participants ({registrations.length})</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:"rgba(26,31,60,.35)" }} />
                  <input placeholder="Search..." value={searchReg} onChange={e => setSearchReg(e.target.value)}
                    className="pl-9 h-9 rounded-xl text-sm outline-none w-56"
                    style={{ background:"rgba(26,31,60,.04)", border:"1px solid rgba(26,31,60,.08)", color:"#1A1F3C" }} />
                </div>
                <button onClick={exportCSV} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
                  style={{ background:"rgba(244,98,42,.1)", color:"#F4622A", border:"1px solid rgba(244,98,42,.25)" }}>
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr><th style={thStyle}>Name</th><th style={thStyle}>Email</th><th style={thStyle}>Organization</th><th style={thStyle}>Track</th><th style={thStyle}>Status</th></tr></thead>
                <tbody>
                  {filteredRegs.map(r => (
                    <tr key={r.id}>
                      <td style={{ ...tdStyle, fontWeight:600, color:"#1A1F3C" }}>{r.participant_name}</td>
                      <td style={{ ...tdStyle, color:"rgba(26,31,60,.6)" }}>{r.email}</td>
                      <td style={{ ...tdStyle, color:"rgba(26,31,60,.7)" }}>{r.organization}</td>
                      <td style={{ ...tdStyle, color:"rgba(26,31,60,.7)" }}>{r.track}</td>
                      <td style={tdStyle}><StatusBadge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Submissions */}
        {activeTab==="submissions" && (
          <div className="rounded-2xl overflow-hidden" style={{ background:"#fff", border:"1px solid rgba(26,31,60,.09)" }}>
            <div className="p-5 flex items-center justify-between flex-wrap gap-3 border-b" style={{ borderColor:"rgba(26,31,60,.08)" }}>
              <h2 className="font-heading font-bold text-base" style={{ color:"#1A1F3C" }}>All Submissions ({submissions.length})</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:"rgba(26,31,60,.35)" }} />
                <input placeholder="Search..." value={searchSub} onChange={e => setSearchSub(e.target.value)}
                  className="pl-9 h-9 rounded-xl text-sm outline-none w-56"
                  style={{ background:"rgba(26,31,60,.04)", border:"1px solid rgba(26,31,60,.08)", color:"#1A1F3C" }} />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr><th style={thStyle}>Project</th><th style={thStyle}>Team</th><th style={thStyle}>Track</th><th style={thStyle}>Status</th><th style={thStyle}>Score</th></tr></thead>
                <tbody>
                  {filteredSubs.map(s => (
                    <tr key={s.id}>
                      <td style={{ ...tdStyle, fontWeight:600, color:"#1A1F3C" }}>{s.project_title}</td>
                      <td style={{ ...tdStyle, color:"rgba(26,31,60,.7)" }}>{s.team_name}</td>
                      <td style={{ ...tdStyle, color:"rgba(26,31,60,.7)" }}>{s.track}</td>
                      <td style={tdStyle}><StatusBadge status={s.status} /></td>
                      <td style={tdStyle}>{s.average_score > 0 ? <span className="font-mono font-bold" style={{ color:"#F4622A" }}>{s.average_score}/40</span> : <span style={{ color:"rgba(26,31,60,.3)" }}>--</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        {activeTab==="leaderboard" && (
          <div className="rounded-2xl overflow-hidden" style={{ background:"#fff", border:"1px solid rgba(26,31,60,.09)" }}>
            <div className="p-5 flex items-center justify-between border-b" style={{ borderColor:"rgba(26,31,60,.08)" }}>
              <h2 className="font-heading font-bold text-base flex items-center gap-2" style={{ color:"#1A1F3C" }}>
                <Trophy className="w-4 h-4" style={{ color:"#F59E0B" }} /> Leaderboard Control
              </h2>
              <button onClick={() => setLeaderboardPublished(p => !p)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                style={leaderboardPublished
                  ? { background:"rgba(239,68,68,.1)", color:"#EF4444", border:"1px solid rgba(239,68,68,.2)" }
                  : { background:"rgba(16,185,129,.1)", color:"#10B981", border:"1px solid rgba(16,185,129,.2)" }}>
                {leaderboardPublished ? <><EyeOff className="w-4 h-4" /> Unpublish</> : <><Eye className="w-4 h-4" /> Publish Results</>}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr><th style={{ ...thStyle, width:48 }}>#</th><th style={thStyle}>Team</th><th style={thStyle}>Project</th><th style={thStyle}>Track</th><th style={thStyle}>Avg Score</th></tr></thead>
                <tbody>
                  {submissions.filter(s=>s.status==="submitted").sort((a,b)=>(b.average_score||0)-(a.average_score||0)).map((s,i) => (
                    <tr key={s.id}>
                      <td style={{ ...tdStyle, fontFamily:"monospace", fontWeight:700, color:"#1A1F3C" }}>{i+1}</td>
                      <td style={{ ...tdStyle, fontWeight:600, color:"#1A1F3C" }}>{s.team_name}</td>
                      <td style={{ ...tdStyle, color:"rgba(26,31,60,.7)" }}>{s.project_title}</td>
                      <td style={tdStyle}><span className="text-xs font-semibold px-2 py-0.5 rounded-full pill-violet">{s.track}</span></td>
                      <td style={{ ...tdStyle, fontFamily:"monospace", fontWeight:700, color:"#F4622A" }}>{s.average_score||"--"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Announcements */}
        {activeTab==="announcements" && (
          <div className="rounded-2xl" style={{ background:"#fff", border:"1px solid rgba(26,31,60,.09)" }}>
            <div className="p-5 flex items-center justify-between border-b" style={{ borderColor:"rgba(26,31,60,.08)" }}>
              <h2 className="font-heading font-bold text-base" style={{ color:"#1A1F3C" }}>Announcements ({localAnnouncements.length})</h2>
              <button className="btn-primary flex items-center gap-1.5 px-4 py-2 text-sm" onClick={() => setShowAnnounce(true)}>
                <Megaphone className="w-3.5 h-3.5" /> New
              </button>
            </div>
            <div className="p-5 space-y-3">
              {localAnnouncements.map(a => (
                <div key={a.id} className="p-4 rounded-xl" style={{ background:"rgba(26,31,60,.03)", border:"1px solid rgba(26,31,60,.08)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm" style={{ color:"#1A1F3C" }}>{a.title}</h4>
                    <StatusBadge status={a.priority} />
                  </div>
                  <p className="text-sm" style={{ color:"rgba(26,31,60,.6)" }}>{a.message}</p>
                  <p className="text-xs mt-2" style={{ color:"rgba(26,31,60,.35)" }}>{a.created_date ? format(new Date(a.created_date),"MMM d, h:mm a") : ""}</p>
                </div>
              ))}
              {localAnnouncements.length===0 && <p className="text-center py-8" style={{ color:"rgba(26,31,60,.4)" }}>No announcements yet</p>}
            </div>
          </div>
        )}
      </div>

      {/* Announce Modal */}
      {showAnnounce && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background:"rgba(0,0,0,.4)", backdropFilter:"blur(4px)" }}>
          <motion.div initial={{ scale:.9,opacity:0 }} animate={{ scale:1,opacity:1 }}
            className="rounded-3xl p-6 max-w-md w-full"
            style={{ background:"#fff", boxShadow:"0 20px 60px rgba(0,0,0,.2)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading font-bold text-lg" style={{ color:"#1A1F3C" }}>Broadcast Announcement</h3>
              <button onClick={() => setShowAnnounce(false)} className="p-1.5 rounded-xl" style={{ background:"rgba(26,31,60,.06)", color:"rgba(26,31,60,.5)" }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color:"#1A1F3C" }}>Title</label>
                <input value={announcement.title} onChange={e => setAnnouncement(a=>({...a,title:e.target.value}))} placeholder="Important Update"
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                  style={{ background:"#F8F7FF", border:"1.5px solid rgba(26,31,60,.14)", color:"#1A1F3C" }} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color:"#1A1F3C" }}>Message</label>
                <textarea value={announcement.message} onChange={e => setAnnouncement(a=>({...a,message:e.target.value}))} placeholder="Write your announcement..."
                  style={{ background:"#F8F7FF", border:"1.5px solid rgba(26,31,60,.14)", borderRadius:12, padding:"12px 16px", color:"#1A1F3C", fontSize:14, outline:"none", width:"100%", minHeight:100, resize:"vertical" }} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color:"#1A1F3C" }}>Priority</label>
                <select value={announcement.priority} onChange={e => setAnnouncement(a=>({...a,priority:e.target.value}))}
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                  style={{ background:"#F8F7FF", border:"1.5px solid rgba(26,31,60,.14)", color:"#1A1F3C" }}>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAnnounce(false)} className="btn-outline flex-1 px-4 py-2.5 text-sm">Cancel</button>
              <button onClick={() => {
                if (!announcement.title.trim()) return;
                setLocalAnnouncements(prev => [{ ...announcement, id:String(Date.now()), hackathon_id:hackathon?.id, author:"Organizer", created_date:new Date().toISOString() }, ...prev]);
                setShowAnnounce(false); setAnnouncement({ title:"", message:"", priority:"info" });
              }} disabled={!announcement.title.trim()} className="btn-primary flex items-center gap-2 flex-1 justify-center px-4 py-2.5 text-sm disabled:opacity-60">
                <Send className="w-4 h-4" /> Send
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </PageShell>
  );
}

