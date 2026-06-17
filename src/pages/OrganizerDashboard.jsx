import React, { useState } from "react";
import { api } from "@/lib/mockData";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageShell from "@/components/shared/PageShell";
import StatusBadge from "@/components/shared/StatusBadge";
import { Users, FileText, Gavel, Trophy, Megaphone, Send, Search, Download, Eye, EyeOff, BarChart3, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { motion } from "framer-motion";

// â”€â”€ Judge Assignment sub-component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function JudgeAssignmentTab({ hackathon, submissions }) {
  const [showForm, setShowForm] = useState(false);
  const [assignments, setAssignments] = useState({});
  const [af, setAf] = useState({ track:"", name:"", email:"" });

  const assign = () => {
    if (!af.track||!af.name.trim()) { toast.error("Track and name required"); return; }
    setAssignments(prev=>({ ...prev,[af.track]:[...(prev[af.track]||[]),{name:af.name,email:af.email}] }));
    setAf({track:"",name:"",email:""});
    setShowForm(false);
    toast.success("Judge assigned!");
  };

  const thS = { padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",color:"rgba(26,31,60,.5)",borderBottom:"1px solid rgba(26,31,60,.08)",background:"rgba(26,31,60,.02)" };
  const tdS = { padding:"12px 14px",fontSize:13,borderBottom:"1px solid rgba(26,31,60,.05)" };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-bold text-base" style={{ color:"#1A1F3C" }}>Assign Judges to Tracks</h2>
        <button onClick={()=>setShowForm(true)} className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-full text-sm">
          <UserPlus className="w-3.5 h-3.5" aria-hidden="true" /> Assign Judge
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border" style={{ borderColor:"rgba(26,31,60,.09)" }}>
        <table className="w-full">
          <thead>
            <tr><th style={thS}>Track</th><th style={thS}>Submissions</th><th style={thS}>Judges Assigned</th><th style={thS}>Scored</th><th style={thS}>Coverage</th></tr>
          </thead>
          <tbody>
            {(hackathon?.tracks||[]).map(trk=>{
              const subs   = submissions.filter(s=>s.track===trk.name&&s.status==="submitted");
              const scored = subs.filter(s=>s.scores?.length>0);
              const auto   = [...new Set(subs.flatMap(s=>(s.scores||[]).map(sc=>sc.judge_name)))];
              const manual = (assignments[trk.name]||[]).map(j=>j.name);
              const all    = [...new Set([...auto,...manual])];
              const pct    = subs.length>0?Math.round(scored.length/subs.length*100):0;
              return (
                <tr key={trk.name}>
                  <td style={{...tdS,fontWeight:600,color:"#1A1F3C"}}>{trk.name}</td>
                  <td style={{...tdS,color:"rgba(26,31,60,.7)"}}>{subs.length}</td>
                  <td style={tdS}>
                    {all.length>0?(
                      <div className="flex flex-wrap gap-1">
                        {all.map(j=>(
                          <span key={j} className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ background:"rgba(124,77,255,.1)",color:"#7C4DFF",border:"1px solid rgba(124,77,255,.2)" }}>
                            {j}
                            {(assignments[trk.name]||[]).find(a=>a.name===j)&&(
                              <button onClick={()=>setAssignments(p=>({...p,[trk.name]:(p[trk.name]||[]).filter(a=>a.name!==j)}))}
                                aria-label={`Remove ${j}`} className="hover:opacity-70">
                                <X className="w-2.5 h-2.5" aria-hidden="true" />
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                    ):<span style={{ color:"rgba(26,31,60,.35)" }}>None</span>}
                  </td>
                  <td style={{...tdS,color:"rgba(26,31,60,.7)"}}>{scored.length}/{subs.length}</td>
                  <td style={tdS}>
                    <div className="flex items-center gap-2">
                      <div className="h-2 rounded-full overflow-hidden w-20" style={{ background:"rgba(26,31,60,.08)" }}
                        role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
                        aria-label={`${pct}% coverage`}>
                        <div className="h-full rounded-full" style={{ width:`${pct}%`,background:pct===100?"#10B981":pct>50?"#F59E0B":"#F4622A" }} />
                      </div>
                      <span className="text-xs font-mono font-bold" style={{ color:"rgba(26,31,60,.6)" }}>{pct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Assign modal */}
      {showForm&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background:"rgba(0,0,0,.4)",backdropFilter:"blur(4px)" }}
          role="dialog" aria-modal="true" aria-labelledby="assign-title">
          <motion.div initial={{scale:.9,opacity:0}} animate={{scale:1,opacity:1}}
            className="rounded-3xl p-6 max-w-sm w-full" style={{ background:"#fff",boxShadow:"0 20px 60px rgba(0,0,0,.2)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 id="assign-title" className="font-heading font-bold text-lg" style={{ color:"#1A1F3C" }}>Assign a Judge</h3>
              <button onClick={()=>setShowForm(false)} aria-label="Close"><X className="w-4 h-4" style={{ color:"rgba(26,31,60,.5)" }} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="aj-track" className="block text-sm font-semibold mb-1.5" style={{ color:"#1A1F3C" }}>Track *</label>
                <select id="aj-track" value={af.track} onChange={e=>setAf(a=>({...a,track:e.target.value}))}
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                  style={{ background:"#F8F7FF",border:"1.5px solid rgba(26,31,60,.14)",color:"#1A1F3C" }}>
                  <option value="">Select track</option>
                  {(hackathon?.tracks||[]).map(t=><option key={t.name} value={t.name}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="aj-name" className="block text-sm font-semibold mb-1.5" style={{ color:"#1A1F3C" }}>Judge Name *</label>
                <input id="aj-name" value={af.name} onChange={e=>setAf(a=>({...a,name:e.target.value}))} placeholder="Dr. Jane Smith"
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                  style={{ background:"#F8F7FF",border:"1.5px solid rgba(26,31,60,.14)",color:"#1A1F3C" }} />
              </div>
              <div>
                <label htmlFor="aj-email" className="block text-sm font-semibold mb-1.5" style={{ color:"#1A1F3C" }}>Judge Email</label>
                <input id="aj-email" type="email" value={af.email} onChange={e=>setAf(a=>({...a,email:e.target.value}))} placeholder="judge@example.com"
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                  style={{ background:"#F8F7FF",border:"1.5px solid rgba(26,31,60,.14)",color:"#1A1F3C" }} />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>setShowForm(false)} className="btn-outline flex-1 px-4 py-2.5 text-sm">Cancel</button>
              <button onClick={assign} className="btn-primary flex items-center gap-2 flex-1 justify-center px-4 py-2.5 text-sm">
                <UserPlus className="w-4 h-4" aria-hidden="true" /> Assign
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// â”€â”€ Main Dashboard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function OrganizerDashboard() {
  const queryClient = useQueryClient();
  const [searchReg, setSearchReg]             = useState("");
  const [searchSub, setSearchSub]             = useState("");
  const [showAnnounce, setShowAnnounce]       = useState(false);
  const [announcement, setAnnouncement]       = useState({ title:"", message:"", priority:"info" });
  const [leaderboardPublished, setPublished]  = useState(true);
  const [activeTab, setActiveTab]             = useState("registrations");

  const { data: hackathons    = [] } = useQuery({ queryKey:["hackathons"],    queryFn:() => api.hackathons.list() });
  const { data: registrations = [] } = useQuery({ queryKey:["registrations"], queryFn:() => api.registrations.list() });
  const { data: teams         = [] } = useQuery({ queryKey:["teams"],         queryFn:() => api.teams.list() });
  const { data: submissions   = [] } = useQuery({ queryKey:["submissions"],   queryFn:() => api.submissions.list() });
  const { data: announcements = [] } = useQuery({ queryKey:["announcements"], queryFn:() => api.announcements.list() });

  const hackathon = hackathons.find(h=>h.status==="active") || hackathons[0];

  const announceMutation = useMutation({
    mutationFn: data => api.announcements.create({...data,hackathon_id:hackathon?.id,author:"Organizer"}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["announcements"]});
      setShowAnnounce(false); setAnnouncement({title:"",message:"",priority:"info"});
      toast.success("Announcement sent!");
    },
  });

  const filteredRegs = registrations.filter(r=>r.participant_name?.toLowerCase().includes(searchReg.toLowerCase())||r.email?.toLowerCase().includes(searchReg.toLowerCase()));
  const filteredSubs = submissions.filter(s=>s.project_title?.toLowerCase().includes(searchSub.toLowerCase())||s.team_name?.toLowerCase().includes(searchSub.toLowerCase()));
  const judgesActive = [...new Set(submissions.flatMap(s=>(s.scores||[]).map(sc=>sc.judge_name)))].length;

  const STATS = [
    { label:"Registrations", value:registrations.length,                                    icon:Users,    color:"#3B82F6", bg:"rgba(59,130,246,.1)" },
    { label:"Teams",         value:teams.length,                                             icon:Users,    color:"#10B981", bg:"rgba(16,185,129,.1)" },
    { label:"Submissions",   value:submissions.filter(s=>s.status==="submitted").length,     icon:FileText, color:"#F59E0B", bg:"rgba(245,158,11,.1)" },
    { label:"Judges Active", value:judgesActive,                                             icon:Gavel,    color:"#7C4DFF", bg:"rgba(124,77,255,.1)" },
  ];

  const exportCSV = () => {
    const headers = "Name,Email,Organization,Role,Team,Track,Status\n";
    const rows = registrations.map(r=>`"${r.participant_name}","${r.email}","${r.organization}","${r.role_title}","${r.team_name||""}","${r.track}","${r.status}"`).join("\n");
    const url  = URL.createObjectURL(new Blob([headers+rows],{type:"text/csv"}));
    Object.assign(document.createElement("a"),{href:url,download:"registrations.csv"}).click();
    toast.success("CSV exported!");
  };

  const thS = { padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",color:"rgba(26,31,60,.5)",borderBottom:"1px solid rgba(26,31,60,.08)",background:"rgba(26,31,60,.02)" };
  const tdS = { padding:"12px 14px",fontSize:13,borderBottom:"1px solid rgba(26,31,60,.05)" };

  const TABS = ["registrations","submissions","leaderboard","announcements","judges"];

  return (
    <PageShell>
      <div className="relative overflow-hidden pt-28 pb-12" style={{ background:"linear-gradient(135deg,#FFF5EF 0%,#F5F0FF 50%,#F0F8FF 100%)" }}>
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background:"linear-gradient(135deg,#F4622A,#FB923C)",boxShadow:"0 8px 28px rgba(244,98,42,.4)" }}>
                <BarChart3 className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <div>
                <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight" style={{ color:"#1A1F3C" }}>Organizer Dashboard</h1>
                <p className="text-base font-semibold mt-0.5" style={{ color:"rgba(26,31,60,.55)" }}>{hackathon?.title}</p>
              </div>
            </div>
            <button className="btn-primary flex items-center gap-2 px-6 py-3 rounded-2xl text-sm" onClick={()=>setShowAnnounce(true)}>
              <Megaphone className="w-4 h-4" aria-hidden="true" /> Broadcast
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" role="list" aria-label="Dashboard stats">
          {STATS.map(s=>(
            <div key={s.label} className="card-light rounded-2xl p-5" role="listitem">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background:s.bg }}>
                  <s.icon className="w-5 h-5" style={{ color:s.color }} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold" style={{ color:"#1A1F3C" }}>{s.value}</p>
                  <p className="text-xs font-medium" style={{ color:"rgba(26,31,60,.45)" }}>{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div className="flex flex-wrap gap-1 p-1.5 rounded-2xl mb-6 organizer-tabs w-fit"
          style={{ background:"rgba(244,98,42,.08)",border:"1px solid rgba(244,98,42,.18)" }}
          role="tablist">
          {TABS.map(tab=>(
            <button key={tab} role="tab" aria-selected={activeTab===tab}
              data-state={activeTab===tab?"active":"inactive"}
              onClick={()=>setActiveTab(tab)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize">
              {tab==="judges"?"Judge Assignment":tab.charAt(0).toUpperCase()+tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Registrations */}
        {activeTab==="registrations"&&(
          <div className="rounded-2xl overflow-hidden" style={{ background:"#fff",border:"1px solid rgba(26,31,60,.09)" }}>
            <div className="p-5 flex items-center justify-between flex-wrap gap-3 border-b" style={{ borderColor:"rgba(26,31,60,.08)" }}>
              <h2 className="font-heading font-bold text-base" style={{ color:"#1A1F3C" }}>Participants ({registrations.length})</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:"rgba(26,31,60,.35)" }} aria-hidden="true" />
                  <input placeholder="Search..." value={searchReg} onChange={e=>setSearchReg(e.target.value)}
                    className="pl-9 h-9 rounded-xl text-sm outline-none w-56"
                    style={{ background:"rgba(26,31,60,.04)",border:"1px solid rgba(26,31,60,.08)",color:"#1A1F3C" }}
                    aria-label="Search registrations" />
                </div>
                <button onClick={exportCSV} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
                  style={{ background:"rgba(244,98,42,.1)",color:"#F4622A",border:"1px solid rgba(244,98,42,.25)" }}
                  aria-label="Export registrations as CSV">
                  <Download className="w-3.5 h-3.5" aria-hidden="true" /> Export
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr><th style={thS}>Name</th><th style={thS}>Email</th><th style={thS}>Organization</th><th style={thS}>Track</th><th style={thS}>Status</th></tr></thead>
                <tbody>
                  {filteredRegs.map(r=>(
                    <tr key={r.id}>
                      <td style={{...tdS,fontWeight:600,color:"#1A1F3C"}}>{r.participant_name}</td>
                      <td style={{...tdS,color:"rgba(26,31,60,.6)"}}>{r.email}</td>
                      <td style={{...tdS,color:"rgba(26,31,60,.7)"}}>{r.organization}</td>
                      <td style={{...tdS,color:"rgba(26,31,60,.7)"}}>{r.track}</td>
                      <td style={tdS}><StatusBadge status={r.status} /></td>
                    </tr>
                  ))}
                  {filteredRegs.length===0&&<tr><td colSpan={5} className="text-center py-8" style={{ color:"rgba(26,31,60,.4)" }}>No registrations found</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
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
                  {filteredSubs.map(s=>(
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
                <thead><tr><th style={{...thS,width:48}}>#</th><th style={thS}>Team</th><th style={thS}>Project</th><th style={thS}>Track</th><th style={thS}>Avg Score</th><th style={thS}>Reviews</th></tr></thead>
                <tbody>
                  {submissions.filter(s=>s.status==="submitted").sort((a,b)=>(b.average_score||0)-(a.average_score||0)).map((s,i)=>(
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

      {/* Announce modal */}
      {showAnnounce&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background:"rgba(0,0,0,.4)",backdropFilter:"blur(4px)" }}
          role="dialog" aria-modal="true" aria-labelledby="ann-title">
          <motion.div initial={{scale:.9,opacity:0}} animate={{scale:1,opacity:1}}
            className="rounded-3xl p-6 max-w-md w-full" style={{ background:"#fff",boxShadow:"0 20px 60px rgba(0,0,0,.2)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 id="ann-title" className="font-heading font-bold text-lg" style={{ color:"#1A1F3C" }}>Broadcast Announcement</h3>
              <button onClick={()=>setShowAnnounce(false)} aria-label="Close"><X className="w-4 h-4" style={{ color:"rgba(26,31,60,.5)" }} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="ann-title-in" className="block text-sm font-semibold mb-1.5" style={{ color:"#1A1F3C" }}>Title</label>
                <input id="ann-title-in" value={announcement.title} onChange={e=>setAnnouncement(a=>({...a,title:e.target.value}))} placeholder="Important Update"
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                  style={{ background:"#F8F7FF",border:"1.5px solid rgba(26,31,60,.14)",color:"#1A1F3C" }} />
              </div>
              <div>
                <label htmlFor="ann-msg" className="block text-sm font-semibold mb-1.5" style={{ color:"#1A1F3C" }}>Message</label>
                <textarea id="ann-msg" value={announcement.message} onChange={e=>setAnnouncement(a=>({...a,message:e.target.value}))} placeholder="Write your announcement..."
                  style={{ background:"#F8F7FF",border:"1.5px solid rgba(26,31,60,.14)",borderRadius:12,padding:"12px 16px",color:"#1A1F3C",fontSize:14,outline:"none",width:"100%",minHeight:100,resize:"vertical" }} />
              </div>
              <div>
                <label htmlFor="ann-prio" className="block text-sm font-semibold mb-1.5" style={{ color:"#1A1F3C" }}>Priority</label>
                <select id="ann-prio" value={announcement.priority} onChange={e=>setAnnouncement(a=>({...a,priority:e.target.value}))}
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                  style={{ background:"#F8F7FF",border:"1.5px solid rgba(26,31,60,.14)",color:"#1A1F3C" }}>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>setShowAnnounce(false)} className="btn-outline flex-1 px-4 py-2.5 text-sm">Cancel</button>
              <button onClick={()=>announceMutation.mutate(announcement)}
                disabled={announceMutation.isPending||!announcement.title.trim()}
                className="btn-primary flex items-center gap-2 flex-1 justify-center px-4 py-2.5 text-sm disabled:opacity-60">
                <Send className="w-4 h-4" aria-hidden="true" /> {announceMutation.isPending?"Sending...":"Send"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </PageShell>
  );
}
