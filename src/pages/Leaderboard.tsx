import React, { useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/lib/mockData";
import { useQuery } from "@tanstack/react-query";
import PageShell from "@/components/shared/PageShell";
import { Trophy, Medal, Star, ExternalLink, Github, Lock } from "lucide-react";
import { motion } from "framer-motion";
import type { Hackathon, Submission } from "@/mocks/types";

export default function Leaderboard() {
  const [trackFilter, setTrackFilter] = useState("all");
  const previousRanksRef = useRef<Map<string, number>>(new Map());
  const { data: hackathons = [] } = useQuery<Hackathon[]>({ queryKey:["hackathons"], queryFn:() => api.hackathons.list() as Promise<Hackathon[]> });
  const { data: submissions = [] } = useQuery<Submission[]>({
    queryKey:["submissions"],
    queryFn:() => api.submissions.list() as Promise<Submission[]>,
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
  });

  const hackathon = hackathons.find((h: Hackathon) => h.status==="active") || hackathons[0];

  const ranked = submissions
    .filter((s: Submission) => s.status==="submitted"&&s.average_score>0)
    .filter((s: Submission) => trackFilter==="all"||s.track===trackFilter)
    .sort((a: Submission, b: Submission)=>b.average_score-a.average_score);

  const rankedWithDelta = useMemo(() => ranked.map((submission: Submission, index: number) => {
    const previousRank = previousRanksRef.current.get(submission.id);
    const currentRank = index + 1;
    const delta = previousRank ? previousRank - currentRank : 0;
    return { submission, currentRank, delta };
  }), [ranked]);

  useEffect(() => {
    previousRanksRef.current = new Map(ranked.map((submission: Submission, index: number) => [submission.id, index + 1]));
  }, [ranked]);

  if (!hackathon?.leaderboard_published) return (
    <PageShell>
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background:"rgba(26,31,60,.08)" }}>
          <Lock className="w-8 h-8" style={{ color:"rgba(26,31,60,.4)" }} aria-hidden="true" />
        </div>
        <h1 className="font-heading text-2xl font-bold mb-3" style={{ color:"#1A1F3C" }}>Leaderboard Not Yet Published</h1>
        <p style={{ color:"rgba(26,31,60,.5)" }}>Results will be visible once the organizers publish the leaderboard.</p>
      </div>
    </PageShell>
  );

  const tracks = [...new Set(submissions.map((s: Submission) => s.track).filter(Boolean))] as string[];

  const PODIUM = [
    { accent:"#F59E0B", bg:"rgba(245,158,11,.1)", border:"rgba(245,158,11,.35)", icon:Trophy },
    { accent:"#94A3B8", bg:"rgba(148,163,184,.1)", border:"rgba(148,163,184,.35)", icon:Medal },
    { accent:"#F97316", bg:"rgba(249,115,22,.1)",  border:"rgba(249,115,22,.35)",  icon:Medal },
  ];

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Header card */}
        <div className="relative overflow-hidden rounded-3xl mb-10 p-8 sm:p-12 text-center"
          style={{ background:"linear-gradient(135deg,#FFF5EF 0%,#F5F0FF 50%,#F0FAFF 100%)",border:"1px solid rgba(0,0,0,.06)" }}>
          <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
          <div className="absolute top-0 right-0 w-56 h-56 rounded-full pointer-events-none"
            style={{ background:"radial-gradient(ellipse,rgba(244,98,42,.12) 0%,transparent 70%)",filter:"blur(40px)" }} />
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              style={{ background:"linear-gradient(135deg,#F59E0B,#F97316)",boxShadow:"0 8px 28px rgba(245,158,11,.4)" }}>
              <Trophy className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl tracking-tight mb-2" style={{ color:"#1A1F3C" }}>Leaderboard</h1>
            <p className="text-base font-semibold" style={{ color:"rgba(26,31,60,.55)" }}>{hackathon?.title} &mdash; Live Rankings</p>
          </div>
        </div>

        {/* Track filter */}
        <div className="flex justify-center mb-8">
          <select value={trackFilter} onChange={e=>setTrackFilter(e.target.value)}
            className="h-11 rounded-2xl px-5 text-sm font-semibold outline-none"
            style={{ background:"#fff",border:"1.5px solid rgba(244,98,42,.3)",color:"#1A1F3C",boxShadow:"0 2px 8px rgba(0,0,0,.06)" }}
            aria-label="Filter by track">
            <option value="all">All Tracks</option>
            {tracks.map((t: string)=><option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Top 3 podium */}
        {ranked.length>=3&&(
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10">
            {[1,0,2].map(idx=>{
              const s=ranked[idx]; if(!s) return null;
              const p=PODIUM[idx];
              return (
                <motion.div key={s.id} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:idx*.1 }}
                  className={`rounded-2xl p-4 sm:p-6 text-center ${idx===0?"sm:-mt-4":""}`}
                  style={{ background:p.bg,border:`2px solid ${p.border}` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ background:p.bg,border:`1.5px solid ${p.border}` }}>
                    <p.icon className="w-5 h-5" style={{ color:p.accent }} aria-hidden="true" />
                  </div>
                  <p className="text-3xl sm:text-4xl font-bold font-mono" style={{ color:p.accent }}>#{idx+1}</p>
                  <h2 className="font-bold mt-2 text-sm sm:text-base" style={{ color:"#1A1F3C" }}>{s.team_name}</h2>
                  <p className="text-xs mt-0.5 mb-3 truncate" style={{ color:"rgba(26,31,60,.55)" }}>{s.project_title}</p>
                  <p className="text-xl font-mono font-extrabold" style={{ color:p.accent }}>
                    {s.average_score}<span className="text-xs font-normal" style={{ color:"rgba(26,31,60,.45)" }}>/40</span>
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Full list */}
        <div className="space-y-3">
          {rankedWithDelta.map(({submission:s,currentRank,delta},i)=>{
            const rankColor = i===0?"#F59E0B":i===1?"#94A3B8":i===2?"#F97316":"rgba(26,31,60,.3)";
            const rankBg    = i===0?"rgba(245,158,11,.1)":i===1?"rgba(148,163,184,.12)":i===2?"rgba(249,115,22,.1)":"rgba(26,31,60,.05)";
            return (
              <motion.div key={s.id} layout initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*.03 }}>
                <div className="rounded-2xl p-4 flex items-center gap-4"
                  style={{ background:"#fff",border:i<3?`1.5px solid ${rankColor}40`:"1px solid rgba(26,31,60,.09)",boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-extrabold text-sm shrink-0"
                    style={{ background:rankBg,color:rankColor }}>#{currentRank}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm" style={{ color:"#1A1F3C" }}>{s.team_name}</h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full pill-violet">{s.track}</span>
                    </div>
                    <p className="text-xs mt-0.5 truncate" style={{ color:"rgba(26,31,60,.5)" }}>{s.project_title}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right min-w-[48px]">
                      <p className="text-[10px] font-semibold" style={{ color: delta > 0 ? "#10B981" : delta < 0 ? "#F43F5E" : "rgba(26,31,60,.35)" }}>
                        {delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : "—"}
                      </p>
                      <p className="text-[10px]" style={{ color:"rgba(26,31,60,.35)" }}>rank</p>
                    </div>
                    {s.demo_url&&<a href={s.demo_url} target="_blank" rel="noopener noreferrer" aria-label="Live Demo"><ExternalLink className="w-4 h-4" style={{ color:"rgba(26,31,60,.4)" }} /></a>}
                    {s.github_url&&<a href={s.github_url} target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository"><Github className="w-4 h-4" style={{ color:"rgba(26,31,60,.4)" }} /></a>}
                    <div className="text-right">
                      <p className="text-xl font-mono font-extrabold" style={{ color:"#F4622A" }}>{s.average_score}</p>
                      <div className="flex items-center gap-0.5 justify-end">
                        <Star className="w-3 h-3" style={{ color:"#F59E0B" }} aria-hidden="true" />
                        <span className="text-[10px] font-semibold" style={{ color:"rgba(26,31,60,.45)" }}>{s.scores?.length||0} reviews</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
          {ranked.length===0&&<div className="text-center py-16"><p style={{ color:"rgba(26,31,60,.4)" }}>No scored submissions yet.</p></div>}
        </div>
      </div>
    </PageShell>
  );
}

