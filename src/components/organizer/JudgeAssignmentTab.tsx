import { useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import type { Hackathon, Submission } from "@/mocks/types";

type JudgeAssignmentTabProps = {
  hackathon?: Hackathon;
  submissions: Submission[];
};

export default function JudgeAssignmentTab({ hackathon, submissions }: JudgeAssignmentTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [assignments, setAssignments] = useState<Record<string, { name: string; email: string }[]>>({});
  const [af, setAf] = useState({ track: "", name: "", email: "" });

  const assign = () => {
    if (!af.track||!af.name.trim()) { toast.error("Track and name required"); return; }
    setAssignments(prev=>({ ...prev,[af.track]:[...(prev[af.track]||[]),{name:af.name,email:af.email}] }));
    setAf({track:"",name:"",email:""});
    setShowForm(false);
    toast.success("Judge assigned!");
  };

  const thS: CSSProperties = { padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "rgba(26,31,60,.5)", borderBottom: "1px solid rgba(26,31,60,.08)", background: "rgba(26,31,60,.02)" };
  const tdS: CSSProperties = { padding: "12px 14px", fontSize: 13, borderBottom: "1px solid rgba(26,31,60,.05)" };

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
              const subs = submissions.filter(s=>s.track===trk.name&&s.status==="submitted");
              const scored = subs.filter(s=>s.scores?.length>0);
              const auto = [...new Set(subs.flatMap(s=>(s.scores||[]).map(sc=>sc.judge_name)))];
              const manual = (assignments[trk.name]||[]).map(j=>j.name);
              const all = [...new Set([...auto,...manual])];
              const pct = subs.length>0?Math.round(scored.length/subs.length*100):0;
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
                        role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${pct}% coverage`}>
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
