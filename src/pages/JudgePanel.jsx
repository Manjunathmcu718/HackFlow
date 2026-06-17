import React, { useState } from "react";
import { submissions } from "../lib/mockData";
import PageShell from "../components/shared/PageShell";
import StatusBadge from "../components/shared/StatusBadge";
import { Gavel, ExternalLink, Github, Star, Check, ArrowLeft, X } from "lucide-react";
import { motion } from "framer-motion";

const rubricItems = [
  { key:"innovation",   label:"Innovation",          desc:"Originality and creative approach" },
  { key:"technical",    label:"Technical Execution", desc:"Code quality and architecture" },
  { key:"impact",       label:"Impact",              desc:"Real-world applicability" },
  { key:"presentation", label:"Presentation",        desc:"Clarity and communication" },
];

export default function JudgePanel() {
  const [selected, setSelected]   = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [scores, setScores]       = useState({ innovation:5, technical:5, impact:5, presentation:5 });
  const [comments, setComments]   = useState("");
  const [scoredIds, setScoredIds] = useState({});
  const [activeTab, setActiveTab] = useState("pending");

  const submitted  = submissions.filter(s => s.status==="submitted");
  const myScored   = submitted.filter(s => scoredIds[s.id] || s.scores?.length > 0);
  const myUnscored = submitted.filter(s => !scoredIds[s.id] && !s.scores?.length);
  const total = scores.innovation + scores.technical + scores.impact + scores.presentation;

  const handleScore = () => {
    setScoredIds(p => ({ ...p, [selected.id]:true }));
    setSelected(null); setShowConfirm(false);
    setScores({ innovation:5, technical:5, impact:5, presentation:5 }); setComments("");
  };

  const ProjectCard = ({ sub }) => (
    <div onClick={() => setSelected(sub)} className="card-light p-5 rounded-2xl cursor-pointer transition-all">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-heading font-bold text-sm" style={{ color:"#1A1F3C" }}>{sub.project_title}</h3>
        <StatusBadge status={sub.scores?.length>0||scoredIds[sub.id]?"scored":"unscored"} />
      </div>
      <p className="text-xs line-clamp-2 mb-3" style={{ color:"rgba(26,31,60,.5)" }}>{sub.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {(sub.tech_stack||[]).slice(0,3).map(t => <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full pill-violet">{t}</span>)}
        </div>
        <span className="text-xs font-medium" style={{ color:"rgba(26,31,60,.4)" }}>{sub.team_name}</span>
      </div>
      {sub.average_score > 0 && (
        <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop:"1px solid rgba(26,31,60,.06)" }}>
          <Star className="w-3.5 h-3.5" style={{ color:"#F59E0B" }} />
          <span className="text-sm font-bold" style={{ color:"#1A1F3C" }}>{sub.average_score}/40</span>
        </div>
      )}
    </div>
  );

  return (
    <PageShell>
      {/* Header */}
      <div className="relative overflow-hidden pt-28 pb-12" style={{ background:"linear-gradient(135deg,#FFF5EF 0%,#FFF0FF 50%,#F0F4FF 100%)" }}>
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background:"linear-gradient(135deg,#7C4DFF,#A855F7)", boxShadow:"0 8px 28px rgba(124,77,255,.4)" }}>
              <Gavel className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight" style={{ color:"#1A1F3C" }}>Judge Panel</h1>
              <p className="text-sm font-medium mt-0.5" style={{ color:"rgba(26,31,60,.55)" }}>Review and score hackathon submissions</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {[{ label:"Total Submissions",val:submitted.length,color:"#7C4DFF" },{ label:"Reviewed",val:myScored.length,color:"#10B981" },{ label:"Pending",val:myUnscored.length,color:"#F4622A" }].map(({ label,val,color }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
                style={{ background:"#fff", border:"1px solid rgba(0,0,0,.07)" }}>
                <div className="w-2 h-2 rounded-full" style={{ background:color }} />
                <span className="font-bold text-base" style={{ color:"#1A1F3C" }}>{val}</span>
                <span className="text-xs" style={{ color:"rgba(26,31,60,.45)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {selected ? (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <button onClick={() => setSelected(null)}
              className="flex items-center gap-2 text-sm font-semibold mb-6 px-4 py-2 rounded-xl transition-all"
              style={{ color:"rgba(26,31,60,.6)", background:"rgba(26,31,60,.05)" }}>
              <ArrowLeft className="w-4 h-4" /> Back to Queue
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Info */}
              <div className="rounded-2xl p-6" style={{ background:"#fff", border:"1px solid rgba(26,31,60,.09)", boxShadow:"0 2px 12px rgba(0,0,0,.04)" }}>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-heading font-bold text-lg" style={{ color:"#1A1F3C" }}>{selected.project_title}</h2>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full pill-violet">{selected.track}</span>
                </div>
                <p className="text-sm mb-4" style={{ color:"rgba(26,31,60,.5)" }}>by {selected.team_name}</p>
                <p className="text-sm leading-relaxed mb-4" style={{ color:"rgba(26,31,60,.7)" }}>{selected.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(selected.tech_stack||[]).map(t => <span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-full pill-violet">{t}</span>)}
                </div>
                <div className="space-y-2">
                  {selected.demo_url && <a href={selected.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold" style={{ color:"#F4622A" }}><ExternalLink className="w-3.5 h-3.5" /> Live Demo</a>}
                  {selected.github_url && <a href={selected.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold" style={{ color:"#F4622A" }}><Github className="w-3.5 h-3.5" /> GitHub Repository</a>}
                </div>
              </div>

              {/* Scoring */}
              <div className="rounded-2xl p-6" style={{ background:"#fff", border:"1px solid rgba(26,31,60,.09)", boxShadow:"0 2px 12px rgba(0,0,0,.04)" }}>
                <h2 className="font-heading font-bold text-base mb-5" style={{ color:"#1A1F3C" }}>Score This Project</h2>
                <div className="space-y-5">
                  {rubricItems.map(({ key,label,desc }) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-2">
                        <div><p className="text-sm font-semibold" style={{ color:"#1A1F3C" }}>{label}</p><p className="text-xs" style={{ color:"rgba(26,31,60,.45)" }}>{desc}</p></div>
                        <span className="text-lg font-mono font-bold w-8 text-right" style={{ color:"#7C4DFF" }}>{scores[key]}</span>
                      </div>
                      <input type="range" min={1} max={10} step={1} value={scores[key]}
                        onChange={e => setScores(s=>({...s,[key]:Number(e.target.value)}))}
                        className="w-full" style={{ accentColor:"#7C4DFF" }} />
                    </div>
                  ))}
                </div>
                <div className="my-5 p-4 rounded-2xl text-center" style={{ background:"rgba(124,77,255,.06)", border:"1px solid rgba(124,77,255,.15)" }}>
                  <p className="text-xs font-semibold mb-1" style={{ color:"rgba(26,31,60,.5)" }}>Total Score</p>
                  <p className="text-3xl font-mono font-extrabold" style={{ color:"#7C4DFF" }}>{total}<span className="text-sm font-normal" style={{ color:"rgba(26,31,60,.4)" }}>/40</span></p>
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-semibold mb-1.5" style={{ color:"#1A1F3C" }}>Comments</label>
                  <textarea value={comments} onChange={e => setComments(e.target.value)} placeholder="Add your feedback..."
                    style={{ background:"#F8F7FF", border:"1.5px solid rgba(26,31,60,.14)", borderRadius:12, padding:"10px 14px", color:"#1A1F3C", fontSize:14, outline:"none", width:"100%", minHeight:80, resize:"vertical" }} />
                </div>
                <button className="btn-violet w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm"
                  onClick={() => setShowConfirm(true)}>
                  <Check className="w-4 h-4" /> Submit Score
                </button>
              </div>
            </div>

            {/* Confirm Dialog */}
            {showConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ background:"rgba(0,0,0,.4)", backdropFilter:"blur(4px)" }}>
                <motion.div initial={{ scale:.9, opacity:0 }} animate={{ scale:1, opacity:1 }}
                  className="rounded-3xl p-6 max-w-sm w-full"
                  style={{ background:"#fff", boxShadow:"0 20px 60px rgba(0,0,0,.2)" }}>
                  <h3 className="font-heading font-bold text-lg mb-2" style={{ color:"#1A1F3C" }}>Confirm Score Submission</h3>
                  <p className="text-sm mb-6" style={{ color:"rgba(26,31,60,.6)" }}>
                    Submit score of <strong>{total}/40</strong> for <strong>{selected.project_title}</strong>? This cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button onClick={() => setShowConfirm(false)} className="btn-outline flex-1 px-4 py-2.5 text-sm">Cancel</button>
                    <button onClick={handleScore} className="btn-primary flex-1 px-4 py-2.5 text-sm">Confirm</button>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        ) : (
          <div>
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              {[{ val:"pending",label:`Pending (${myUnscored.length})` },{ val:"completed",label:`Completed (${myScored.length})` }].map(tab => (
                <button key={tab.val} onClick={() => setActiveTab(tab.val)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={activeTab===tab.val
                    ? { background:"linear-gradient(135deg,#7C4DFF,#A855F7)", color:"#fff", boxShadow:"0 4px 14px rgba(124,77,255,.35)" }
                    : { background:"rgba(26,31,60,.05)", color:"rgba(26,31,60,.55)", border:"1px solid rgba(26,31,60,.08)" }}>
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(activeTab==="pending" ? myUnscored : myScored).map(sub => <ProjectCard key={sub.id} sub={sub} />)}
              {activeTab==="pending" && myUnscored.length===0 && <p className="col-span-full text-center py-10" style={{ color:"rgba(26,31,60,.4)" }}>All submissions reviewed!</p>}
              {activeTab==="completed" && myScored.length===0 && <p className="col-span-full text-center py-10" style={{ color:"rgba(26,31,60,.4)" }}>No reviews completed yet.</p>}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

