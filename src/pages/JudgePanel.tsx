import React, { useState } from "react";
import { api } from "@/lib/mockData";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageShell from "@/components/shared/PageShell";
import { ExternalLink, Github, FileText, Film, Check, ArrowLeft, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import JudgePanelHero from "@/components/judge/JudgePanelHero";
import JudgeProjectCard from "@/components/judge/JudgeProjectCard";
import JudgeDialogs from "@/components/judge/JudgeDialogs";
import type { Submission } from "@/mocks/types";

const RUBRIC = [
  { key:"innovation",   label:"Innovation",          desc:"Originality and creative approach" },
  { key:"technical",    label:"Technical Execution", desc:"Code quality, architecture, and engineering" },
  { key:"impact",       label:"Impact",              desc:"Real-world applicability and potential" },
  { key:"presentation", label:"Presentation",        desc:"Clarity, UX, and communication" },
] as const;

type RubricKey = typeof RUBRIC[number]["key"];

type ScoreMap = Record<RubricKey, number>;

export default function JudgePanel() {
  const queryClient = useQueryClient();
  const [selected, setSelected]       = useState<Submission | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeck, setShowDeck]       = useState(false);
  const [scores, setScores]           = useState<ScoreMap>({ innovation:5, technical:5, impact:5, presentation:5 });
  const [comments, setComments]       = useState("");

  const submissionsQuery = useQuery<Submission[]>({ queryKey:["submissions"], queryFn:() => api.submissions.list() as Promise<Submission[]> });
  const submissions = submissionsQuery.data || [];

  const submitted  = submissions.filter((s: Submission) => s.status==="submitted");
  const myScored   = submitted.filter((s: Submission) => s.scores?.length>0);
  const myUnscored = submitted.filter((s: Submission) => !s.scores?.length);
  const total      = Object.values(scores).reduce((a,b)=>a+b,0);

  const scoreMutation = useMutation({
    mutationFn: async () => {
      if (!selected) {
        return;
      }
      const newScore = { judge_name:"Current Judge",...scores,total,comments };
      const allScores = [...(selected.scores||[]),newScore];
      const avg = Math.round(allScores.reduce((s,sc)=>s+sc.total,0)/allScores.length);
      await api.submissions.update(selected.id,{scores:allScores,average_score:avg});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["submissions"]});
      setSelected(null); setShowConfirm(false);
      setShowDeck(false);
      setScores({innovation:5,technical:5,impact:5,presentation:5}); setComments("");
      toast.success("Score submitted!");
    },
  });

  const iStyle = { background:"#F8F7FF",border:"1.5px solid rgba(26,31,60,.14)",borderRadius:12,padding:"10px 14px",color:"#1A1F3C",fontSize:14,outline:"none",width:"100%",minHeight:80,resize:"vertical" as const };

  if (submissionsQuery.isError) return (
    <PageShell>
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <AlertTriangle className="w-10 h-10 mx-auto mb-4" style={{ color:"#F43F5E" }} aria-hidden="true" />
        <h1 className="font-heading text-2xl font-bold mb-3" style={{ color:"#1A1F3C" }}>Could Not Load Judge Queue</h1>
        <p style={{ color:"rgba(26,31,60,.55)" }}>Please refresh and try again.</p>
      </div>
    </PageShell>
  );

  return (
    <PageShell>
      <JudgePanelHero total={submitted.length} reviewed={myScored.length} pending={myUnscored.length} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {selected ? (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <button onClick={()=>setSelected(null)}
              className="flex items-center gap-2 text-sm font-semibold mb-6 px-4 py-2 rounded-xl"
              style={{ color:"rgba(26,31,60,.6)",background:"rgba(26,31,60,.05)" }}>
              <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Queue
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project info */}
              <div className="rounded-2xl p-6" style={{ background:"#fff",border:"1px solid rgba(26,31,60,.09)" }}>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-heading font-bold text-lg" style={{ color:"#1A1F3C" }}>{selected.project_title}</h2>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full pill-violet">{selected.track}</span>
                </div>
                <p className="text-sm mb-4" style={{ color:"rgba(26,31,60,.5)" }}>by {selected.team_name}</p>
                <p className="text-sm leading-relaxed mb-4" style={{ color:"rgba(26,31,60,.7)" }}>{selected.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(selected.tech_stack||[]).map((t: string) => <span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-full pill-violet">{t}</span>)}
                </div>
                <div className="space-y-2">
                  {selected.demo_url&&<a href={selected.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold" style={{ color:"#F4622A" }}><ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> Live Demo</a>}
                  {selected.github_url&&<a href={selected.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold" style={{ color:"#F4622A" }}><Github className="w-3.5 h-3.5" aria-hidden="true" /> GitHub</a>}
                  {selected.pitch_deck_url ? (
                    <button
                      type="button"
                      onClick={()=>setShowDeck(true)}
                      className="flex items-center gap-2 text-sm font-semibold"
                      style={{ color:"#F4622A" }}
                    >
                      <FileText className="w-3.5 h-3.5" aria-hidden="true" /> View Pitch Deck
                    </button>
                  ) : (
                    <p className="text-sm" style={{ color:"rgba(26,31,60,.45)" }}>No pitch deck uploaded.</p>
                  )}
                  {selected.video_url&&<a href={selected.video_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold" style={{ color:"#F4622A" }}><Film className="w-3.5 h-3.5" aria-hidden="true" /> Demo Video</a>}
                </div>
              </div>

              {/* Scoring */}
              <div className="rounded-2xl p-6" style={{ background:"#fff",border:"1px solid rgba(26,31,60,.09)" }}>
                <h2 className="font-heading font-bold text-base mb-5" style={{ color:"#1A1F3C" }}>Score This Project</h2>
                <div className="space-y-5">
                  {RUBRIC.map(({key,label,desc})=>(
                    <div key={key}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <label htmlFor={`slider-${key}`} className="text-sm font-semibold" style={{ color:"#1A1F3C" }}>{label}</label>
                          <p className="text-xs" style={{ color:"rgba(26,31,60,.45)" }}>{desc}</p>
                        </div>
                        <span className="text-lg font-mono font-bold w-8 text-right" style={{ color:"#7C4DFF" }} aria-live="polite">{scores[key]}</span>
                      </div>
                      <input id={`slider-${key}`} type="range" min={1} max={10} step={1} value={scores[key]}
                        onChange={e=>setScores(s=>({...s,[key]:Number(e.target.value)}))}
                        className="w-full" style={{ accentColor:"#7C4DFF" }}
                        aria-label={`${label} score`} aria-valuemin={1} aria-valuemax={10} aria-valuenow={scores[key]} />
                    </div>
                  ))}
                </div>
                <div className="my-5 p-4 rounded-2xl text-center" style={{ background:"rgba(124,77,255,.06)",border:"1px solid rgba(124,77,255,.15)" }}>
                  <p className="text-xs font-semibold mb-1" style={{ color:"rgba(26,31,60,.5)" }}>Total Score</p>
                  <p className="text-3xl font-mono font-extrabold" style={{ color:"#7C4DFF" }} aria-live="polite">
                    {total}<span className="text-sm font-normal" style={{ color:"rgba(26,31,60,.4)" }}>/40</span>
                  </p>
                </div>
                <div className="mb-5">
                  <label htmlFor="judge-comments" className="block text-sm font-semibold mb-1.5" style={{ color:"#1A1F3C" }}>Comments</label>
                  <textarea id="judge-comments" value={comments} onChange={e=>setComments(e.target.value)}
                    placeholder="Add your feedback..." style={iStyle} />
                </div>
                <button className="btn-violet w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm"
                  onClick={()=>setShowConfirm(true)}>
                  <Check className="w-4 h-4" aria-hidden="true" /> Submit Score
                </button>
              </div>
            </div>

            <JudgeDialogs
              selected={selected}
              total={total}
              showConfirm={showConfirm}
              showDeck={showDeck}
              scoreMutation={scoreMutation}
              setShowConfirm={setShowConfirm}
              setShowDeck={setShowDeck}
            />
          </motion.div>
        ) : (
          <div>
            {/* Tabs */}
            <div className="flex gap-2 mb-6" role="tablist">
              {[{val:"pending",label:`Pending (${myUnscored.length})`},{val:"completed",label:`Completed (${myScored.length})`}].map((tab,idx)=>(
                <button key={tab.val} role="tab" aria-selected={idx===0}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                  style={idx===0?{background:"linear-gradient(135deg,#7C4DFF,#A855F7)",color:"#fff"}:{background:"rgba(26,31,60,.05)",color:"rgba(26,31,60,.55)"}}>
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myUnscored.map((sub: Submission) => <JudgeProjectCard key={sub.id} sub={sub} onClick={setSelected} />)}
              {myUnscored.length===0&&<p className="col-span-full text-center py-10" style={{ color:"rgba(26,31,60,.4)" }}>All submissions reviewed!</p>}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

