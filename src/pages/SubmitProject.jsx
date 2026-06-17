import React, { useState } from "react";
import { hackathons, teams, submissions } from "../lib/mockData";
import PageShell from "../components/shared/PageShell";
import CountdownTimer from "../components/shared/CountdownTimer";
import { Save, Send, Lock, Github, ExternalLink, Film, Plus, X, Check } from "lucide-react";

export default function SubmitProject() {
  const hackathon = hackathons.find(h => h.status==="active") || hackathons[0];
  const team      = teams[0];
  const existing  = submissions.find(s => s.team_id === team?.id);
  const deadlinePassed = hackathon?.submission_deadline && new Date(hackathon.submission_deadline) < new Date();

  const [saved, setSaved] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(existing?.status==="submitted");
  const [form, setForm] = useState({
    project_title:  existing?.project_title  || "",
    description:    existing?.description    || "",
    tech_stack:     existing?.tech_stack     || [],
    demo_url:       existing?.demo_url       || "",
    github_url:     existing?.github_url     || "",
    video_url:      existing?.video_url      || "",
  });
  const [techInput, setTechInput] = useState("");

  const addTech = () => {
    if (techInput.trim() && !form.tech_stack.includes(techInput.trim())) {
      setForm(prev => ({ ...prev, tech_stack:[...prev.tech_stack, techInput.trim()] }));
      setTechInput("");
    }
  };
  const removeTech = (t) => setForm(prev => ({ ...prev, tech_stack:prev.tech_stack.filter(x=>x!==t) }));

  if (deadlinePassed && !isSubmitted) return (
    <PageShell>
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background:"rgba(239,68,68,.1)" }}>
          <Lock className="w-8 h-8" style={{ color:"#EF4444" }} />
        </div>
        <h1 className="font-heading text-2xl font-bold mb-3" style={{ color:"#1A1F3C" }}>Submissions Closed</h1>
        <p style={{ color:"rgba(26,31,60,.5)" }}>The submission deadline has passed.</p>
      </div>
    </PageShell>
  );

  if (deadlinePassed && isSubmitted) return (
    <PageShell>
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background:"rgba(16,185,129,.1)" }}>
          <Check className="w-8 h-8" style={{ color:"#10B981" }} />
        </div>
        <h1 className="font-heading text-2xl font-bold mb-3" style={{ color:"#1A1F3C" }}>Submission Locked</h1>
        <p style={{ color:"rgba(26,31,60,.5)" }}>Your project "{form.project_title}" has been submitted. The deadline has passed.</p>
      </div>
    </PageShell>
  );

  const inputStyle = { background:"#fff", border:"1px solid rgba(26,31,60,.12)", borderRadius:12, padding:"10px 14px", color:"#1A1F3C", fontSize:14, outline:"none", width:"100%" };

  return (
    <PageShell>
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16">
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-1" style={{ color:"#1A1F3C" }}>Submit Your Project</h1>
            <p style={{ color:"rgba(26,31,60,.5)" }}>Team: {team?.name} Â· Track: {team?.track}</p>
          </div>
          <CountdownTimer targetDate={hackathon?.submission_deadline} label="Time Remaining" compact />
        </div>

        <div className="space-y-6">
          {/* Project Details */}
          <div className="rounded-2xl p-6" style={{ background:"#fff", border:"1px solid rgba(26,31,60,.09)", boxShadow:"0 2px 12px rgba(0,0,0,.04)" }}>
            <h2 className="font-heading font-bold text-base mb-4" style={{ color:"#1A1F3C" }}>Project Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color:"#1A1F3C" }}>Project Title *</label>
                <input style={inputStyle} value={form.project_title} onChange={e => setForm(f=>({...f,project_title:e.target.value}))} placeholder="DeFi Shield" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color:"#1A1F3C" }}>Description *</label>
                <textarea style={{ ...inputStyle, minHeight:120, resize:"vertical" }} value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} placeholder="Describe your project, its features, and the problem it solves..." />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color:"#1A1F3C" }}>Tech Stack</label>
                <div className="flex gap-2">
                  <input style={{ ...inputStyle }} value={techInput} onChange={e => setTechInput(e.target.value)} placeholder="React" onKeyDown={e => e.key==="Enter" && (e.preventDefault(), addTech())} />
                  <button onClick={addTech} className="px-4 py-2 rounded-xl font-semibold text-sm flex-shrink-0"
                    style={{ background:"rgba(244,98,42,.1)", color:"#F4622A", border:"1px solid rgba(244,98,42,.2)" }}>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.tech_stack.map(t => (
                    <span key={t} className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full pill-violet">
                      {t}
                      <button onClick={() => removeTech(t)} className="ml-1 hover:opacity-70"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="rounded-2xl p-6" style={{ background:"#fff", border:"1px solid rgba(26,31,60,.09)", boxShadow:"0 2px 12px rgba(0,0,0,.04)" }}>
            <h2 className="font-heading font-bold text-base mb-4" style={{ color:"#1A1F3C" }}>Links</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 flex items-center gap-1.5" style={{ color:"#1A1F3C" }}><ExternalLink className="w-3.5 h-3.5" /> Demo URL</label>
                <input style={inputStyle} value={form.demo_url} onChange={e => setForm(f=>({...f,demo_url:e.target.value}))} placeholder="https://your-demo.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 flex items-center gap-1.5" style={{ color:"#1A1F3C" }}><Github className="w-3.5 h-3.5" /> GitHub Repository</label>
                <input style={inputStyle} value={form.github_url} onChange={e => setForm(f=>({...f,github_url:e.target.value}))} placeholder="https://github.com/..." />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 flex items-center gap-1.5" style={{ color:"#1A1F3C" }}><Film className="w-3.5 h-3.5" /> Demo Video (YouTube/Loom)</label>
                <input style={inputStyle} value={form.video_url} onChange={e => setForm(f=>({...f,video_url:e.target.value}))} placeholder="https://youtube.com/..." />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <button onClick={() => { setSaved(true); setTimeout(()=>setSaved(false),2000); }}
              className="btn-outline flex items-center gap-2 px-6 py-3 text-sm">
              <Save className="w-4 h-4" /> {saved ? "Saved!" : "Save Draft"}
            </button>
            <button onClick={() => {
              if (!form.project_title.trim() || !form.description.trim()) return;
              setIsSubmitted(true);
            }} className="btn-primary flex items-center gap-2 px-8 py-3 text-sm">
              <Send className="w-4 h-4" /> Submit Project
            </button>
          </div>

          {isSubmitted && (
            <div className="p-4 rounded-xl flex items-center gap-3"
              style={{ background:"rgba(16,185,129,.08)", border:"1px solid rgba(16,185,129,.2)" }}>
              <Check className="w-5 h-5 flex-shrink-0" style={{ color:"#10B981" }} />
              <div>
                <p className="text-sm font-semibold" style={{ color:"#059669" }}>Submitted Successfully</p>
                <p className="text-xs" style={{ color:"rgba(26,31,60,.5)" }}>You can still edit until the deadline.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

