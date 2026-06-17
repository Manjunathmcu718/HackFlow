import React, { useState, useEffect } from "react";
import { api } from "@/lib/mockData";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageShell from "@/components/shared/PageShell";
import CountdownTimer from "@/components/shared/CountdownTimer";
import { Save, Send, Lock, Github, ExternalLink, Film, FileText, Plus, X, Check } from "lucide-react";
import { toast } from "sonner";

export default function SubmitProject() {
  const queryClient = useQueryClient();
  const { data: hackathons  = [] } = useQuery({ queryKey:["hackathons"],  queryFn:() => api.hackathons.list() });
  const { data: teams       = [] } = useQuery({ queryKey:["teams"],       queryFn:() => api.teams.list() });
  const { data: submissions = [] } = useQuery({ queryKey:["submissions"], queryFn:() => api.submissions.list() });

  const hackathon      = hackathons.find(h=>h.status==="active") || hackathons[0];
  const team           = teams[0];
  const existing       = submissions.find(s=>s.team_id===team?.id);
  const deadlinePassed = hackathon?.submission_deadline && new Date(hackathon.submission_deadline) < new Date();

  const [form, setForm] = useState({ project_title:"", description:"", tech_stack:[], demo_url:"", github_url:"", pitch_deck_url:"", video_url:"" });
  const [techInput, setTechInput]       = useState("");
  const [pitchFileName, setPitchFileName] = useState("");
  const [isSubmitted, setIsSubmitted]   = useState(false);

  useEffect(() => {
    if (existing) {
      setForm({
        project_title:  existing.project_title  || "",
        description:    existing.description    || "",
        tech_stack:     existing.tech_stack     || [],
        demo_url:       existing.demo_url       || "",
        github_url:     existing.github_url     || "",
        pitch_deck_url: existing.pitch_deck_url || "",
        video_url:      existing.video_url      || "",
      });
      if (existing.pitch_deck_url) setPitchFileName("pitch-deck.pdf");
      setIsSubmitted(existing.status==="submitted");
    }
  }, [existing]);

  const saveDraft = useMutation({
    mutationFn: async data => {
      if (existing) return api.submissions.update(existing.id,{...data,is_draft:true,status:"draft"});
      return api.submissions.create({...data,hackathon_id:hackathon?.id,team_id:team?.id,team_name:team?.name,track:team?.track,is_draft:true,status:"draft"});
    },
    onSuccess: () => { queryClient.invalidateQueries({queryKey:["submissions"]}); toast.success("Draft saved!"); },
  });

  const submitFinal = useMutation({
    mutationFn: async data => {
      if (existing) return api.submissions.update(existing.id,{...data,is_draft:false,status:"submitted"});
      return api.submissions.create({...data,hackathon_id:hackathon?.id,team_id:team?.id,team_name:team?.name,track:team?.track,is_draft:false,status:"submitted"});
    },
    onSuccess: () => { queryClient.invalidateQueries({queryKey:["submissions"]}); setIsSubmitted(true); toast.success("Project submitted!"); },
  });

  const addTech = () => {
    if (techInput.trim() && !form.tech_stack.includes(techInput.trim())) {
      setForm(prev=>({...prev,tech_stack:[...prev.tech_stack,techInput.trim()]}));
      setTechInput("");
    }
  };
  const removeTech = t => setForm(prev=>({...prev,tech_stack:prev.tech_stack.filter(x=>x!==t)}));

  const handlePitchUpload = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10*1024*1024) { toast.error("File must be under 10 MB"); return; }
    const fakeUrl = `https://mock-storage.beetlex.io/pitch-decks/${Date.now()}-${file.name}`;
    setForm(f=>({...f,pitch_deck_url:fakeUrl}));
    setPitchFileName(file.name);
    toast.success("Pitch deck ready to submit!");
  };

  const iStyle = { background:"#fff",border:"1px solid rgba(26,31,60,.12)",borderRadius:10,padding:"10px 14px",color:"#1A1F3C",fontSize:14,outline:"none",width:"100%" };
  const cStyle = { background:"#fff",border:"1px solid rgba(26,31,60,.09)",borderRadius:16,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,.04)" };

  if (deadlinePassed && !isSubmitted) return (
    <PageShell>
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background:"rgba(239,68,68,.1)" }}>
          <Lock className="w-8 h-8" style={{ color:"#EF4444" }} aria-hidden="true" />
        </div>
        <h1 className="font-heading text-2xl font-bold mb-3" style={{ color:"#1A1F3C" }}>Submissions Closed</h1>
        <p style={{ color:"rgba(26,31,60,.5)" }}>The submission deadline has passed.</p>
      </div>
    </PageShell>
  );

  return (
    <PageShell>
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16">
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-1" style={{ color:"#1A1F3C" }}>Submit Your Project</h1>
            <p style={{ color:"rgba(26,31,60,.5)" }}>Team: {team?.name} &middot; Track: {team?.track}</p>
          </div>
          <CountdownTimer targetDate={hackathon?.submission_deadline} label="Time Remaining" compact />
        </div>

        <div className="space-y-6">
          <section aria-labelledby="details-h" style={cStyle}>
            <h2 id="details-h" className="font-heading font-bold text-base mb-4" style={{ color:"#1A1F3C" }}>Project Details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="ptitle" className="block text-sm font-semibold mb-1.5" style={{ color:"#1A1F3C" }}>Project Title *</label>
                <input id="ptitle" style={iStyle} value={form.project_title} onChange={e=>setForm(f=>({...f,project_title:e.target.value}))} placeholder="DeFi Shield" aria-required="true" />
              </div>
              <div>
                <label htmlFor="pdesc" className="block text-sm font-semibold mb-1.5" style={{ color:"#1A1F3C" }}>Description *</label>
                <textarea id="pdesc" style={{...iStyle,minHeight:120,resize:"vertical"}} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Describe your project..." aria-required="true" />
              </div>
              <div>
                <label htmlFor="tech-in" className="block text-sm font-semibold mb-1.5" style={{ color:"#1A1F3C" }}>Tech Stack</label>
                <div className="flex gap-2">
                  <input id="tech-in" style={iStyle} value={techInput} onChange={e=>setTechInput(e.target.value)}
                    placeholder="React" onKeyDown={e=>e.key==="Enter"&&(e.preventDefault(),addTech())} aria-label="Add technology" />
                  <button type="button" onClick={addTech} aria-label="Add tech"
                    className="px-4 py-2 rounded-xl font-semibold text-sm flex-shrink-0"
                    style={{ background:"rgba(244,98,42,.1)",color:"#F4622A",border:"1px solid rgba(244,98,42,.2)" }}>
                    <Plus className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2" role="list" aria-label="Selected technologies">
                  {form.tech_stack.map(t=>(
                    <span key={t} role="listitem" className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full pill-violet">
                      {t}
                      <button onClick={()=>removeTech(t)} aria-label={`Remove ${t}`} className="hover:opacity-70 ml-1"><X className="w-3 h-3" aria-hidden="true" /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="links-h" style={cStyle}>
            <h2 id="links-h" className="font-heading font-bold text-base mb-4" style={{ color:"#1A1F3C" }}>Links &amp; Files</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="demo-url" className="block text-sm font-semibold mb-1.5 flex items-center gap-1.5" style={{ color:"#1A1F3C" }}>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> Demo URL
                </label>
                <input id="demo-url" style={iStyle} value={form.demo_url} onChange={e=>setForm(f=>({...f,demo_url:e.target.value}))} placeholder="https://your-demo.com" type="url" />
              </div>
              <div>
                <label htmlFor="github-url" className="block text-sm font-semibold mb-1.5 flex items-center gap-1.5" style={{ color:"#1A1F3C" }}>
                  <Github className="w-3.5 h-3.5" aria-hidden="true" /> GitHub Repository
                </label>
                <input id="github-url" style={iStyle} value={form.github_url} onChange={e=>setForm(f=>({...f,github_url:e.target.value}))} placeholder="https://github.com/..." type="url" />
              </div>
              <div>
                <label htmlFor="pitch-file" className="block text-sm font-semibold mb-1.5 flex items-center gap-1.5" style={{ color:"#1A1F3C" }}>
                  <FileText className="w-3.5 h-3.5" aria-hidden="true" /> Pitch Deck (PDF, max 10 MB)
                </label>
                <input id="pitch-file" type="file" accept=".pdf" onChange={handlePitchUpload}
                  aria-describedby="pitch-hint"
                  className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
                <span id="pitch-hint" className="text-xs" style={{ color:"rgba(26,31,60,.4)" }}>PDF only, max 10 MB</span>
                {pitchFileName && (
                  <p className="mt-2 text-xs flex items-center gap-1.5" style={{ color:"#10B981" }}>
                    <FileText className="w-3 h-3" aria-hidden="true" /> {pitchFileName} &mdash; ready
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="video-url" className="block text-sm font-semibold mb-1.5 flex items-center gap-1.5" style={{ color:"#1A1F3C" }}>
                  <Film className="w-3.5 h-3.5" aria-hidden="true" /> Demo Video (YouTube / Loom)
                </label>
                <input id="video-url" style={iStyle} value={form.video_url} onChange={e=>setForm(f=>({...f,video_url:e.target.value}))} placeholder="https://youtube.com/..." type="url" />
              </div>
            </div>
          </section>

          <div className="flex items-center gap-3 justify-end">
            <button onClick={()=>saveDraft.mutate(form)} disabled={saveDraft.isPending}
              className="btn-outline flex items-center gap-2 px-6 py-3 text-sm disabled:opacity-60" aria-label="Save as draft">
              <Save className="w-4 h-4" aria-hidden="true" /> {saveDraft.isPending?"Saving...":"Save Draft"}
            </button>
            <button onClick={()=>{
              if (!form.project_title.trim()||!form.description.trim()){toast.error("Title and description are required");return;}
              submitFinal.mutate(form);
            }} disabled={submitFinal.isPending}
              className="btn-primary flex items-center gap-2 px-8 py-3 text-sm disabled:opacity-60" aria-label="Submit project">
              <Send className="w-4 h-4" aria-hidden="true" /> {submitFinal.isPending?"Submitting...":"Submit Project"}
            </button>
          </div>

          {isSubmitted && (
            <div className="p-4 rounded-xl flex items-center gap-3" role="status" aria-live="polite"
              style={{ background:"rgba(16,185,129,.08)",border:"1px solid rgba(16,185,129,.2)" }}>
              <Check className="w-5 h-5 flex-shrink-0" style={{ color:"#10B981" }} aria-hidden="true" />
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

