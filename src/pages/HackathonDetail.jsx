import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/mockData";
import { useQuery } from "@tanstack/react-query";
import PageShell from "@/components/shared/PageShell";
import StatusBadge from "@/components/shared/StatusBadge";
import CountdownTimer from "@/components/shared/CountdownTimer";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Users, Trophy, Clock, Code2, ArrowRight, BookOpen, Shield, Plus, Minus, Loader2 } from "lucide-react";

export default function HackathonDetail() {
  const { id }    = useParams();
  const [openFaq, setOpenFaq] = useState(null);

  const { data: hackathon, isLoading } = useQuery({
    queryKey: ["hackathon", id],
    queryFn:  () => api.hackathons.get(id),
  });

  if (isLoading) return (
    <PageShell>
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" aria-label="Loading" />
      </div>
    </PageShell>
  );

  if (!hackathon) return (
    <PageShell>
      <div className="text-center py-32">
        <p style={{ color:"rgba(26,31,60,.5)" }}>Hackathon not found.</p>
      </div>
    </PageShell>
  );

  return (
    <PageShell>
      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 md:hidden"
        style={{ background:"rgba(250,248,245,.95)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(0,0,0,.07)" }}>
        <Link to="/register-hackathon">
          <button className="btn-primary w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm">
            Register Now <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 pb-24 md:pb-16">
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }}>
          <div className="flex items-center gap-3 mb-4">
            <StatusBadge status={hackathon.status} />
            <span className="text-sm" style={{ color:"rgba(26,31,60,.5)" }}>
              {hackathon.start_date && format(new Date(hackathon.start_date),"MMM d")} &ndash; {hackathon.end_date && format(new Date(hackathon.end_date),"MMM d, yyyy")}
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4" style={{ color:"#1A1F3C" }}>
            {hackathon.title}
          </h1>
          <p className="text-lg mb-8" style={{ color:"rgba(26,31,60,.55)" }}>{hackathon.tagline}</p>

          <div className="flex flex-wrap items-center gap-6 mb-10">
            <div className="flex items-center gap-2 text-sm"><Users className="w-4 h-4" style={{ color:"#F4622A" }} aria-hidden="true" /><span className="font-semibold" style={{ color:"#1A1F3C" }}>{hackathon.participant_count?.toLocaleString()}</span><span style={{ color:"rgba(26,31,60,.5)" }}>participants</span></div>
            <div className="flex items-center gap-2 text-sm"><Trophy className="w-4 h-4" style={{ color:"#F4622A" }} aria-hidden="true" /><span className="font-semibold" style={{ color:"#1A1F3C" }}>{hackathon.team_count}</span><span style={{ color:"rgba(26,31,60,.5)" }}>teams</span></div>
            <div className="flex items-center gap-2 text-sm"><Code2 className="w-4 h-4" style={{ color:"#F4622A" }} aria-hidden="true" /><span className="font-semibold" style={{ color:"#1A1F3C" }}>{hackathon.tracks?.length || 0}</span><span style={{ color:"rgba(26,31,60,.5)" }}>tracks</span></div>
            <div className="hidden md:block ml-auto">
              <Link to="/register-hackathon">
                <button className="btn-primary flex items-center gap-2 px-8 py-3 text-sm">Register Now <ArrowRight className="w-4 h-4" aria-hidden="true" /></button>
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-2xl mb-10 flex flex-col sm:flex-row items-center justify-between gap-6"
            style={{ background:"linear-gradient(135deg,#FFF5EF,#FFF0FF)",border:"1px solid rgba(244,98,42,.15)" }}>
            <CountdownTimer targetDate={hackathon.submission_deadline} label="Submission Deadline" />
            <div className="flex items-center gap-2 text-sm" style={{ color:"rgba(26,31,60,.5)" }}>
              <Clock className="w-4 h-4" aria-hidden="true" /> Teams: {hackathon.min_team_size}&ndash;{hackathon.max_team_size} members
            </div>
          </div>

          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3"><BookOpen className="w-5 h-5" style={{ color:"#F4622A" }} aria-hidden="true" /><h2 className="font-heading text-xl font-bold" style={{ color:"#1A1F3C" }}>About This Hackathon</h2></div>
            <p className="leading-relaxed" style={{ color:"rgba(26,31,60,.6)" }}>{hackathon.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {hackathon.rules && (
              <div className="p-5 rounded-2xl" style={{ background:"#fff",border:"1px solid rgba(26,31,60,.08)" }}>
                <div className="flex items-center gap-2 mb-3"><Shield className="w-4 h-4" style={{ color:"#F4622A" }} aria-hidden="true" /><h3 className="font-semibold text-sm" style={{ color:"#1A1F3C" }}>Rules</h3></div>
                <p className="text-sm leading-relaxed" style={{ color:"rgba(26,31,60,.6)" }}>{hackathon.rules}</p>
              </div>
            )}
            {hackathon.eligibility && (
              <div className="p-5 rounded-2xl" style={{ background:"#fff",border:"1px solid rgba(26,31,60,.08)" }}>
                <div className="flex items-center gap-2 mb-3"><Users className="w-4 h-4" style={{ color:"#F4622A" }} aria-hidden="true" /><h3 className="font-semibold text-sm" style={{ color:"#1A1F3C" }}>Eligibility</h3></div>
                <p className="text-sm leading-relaxed" style={{ color:"rgba(26,31,60,.6)" }}>{hackathon.eligibility}</p>
              </div>
            )}
          </div>

          {hackathon.tracks?.length > 0 && (
            <div className="mb-10">
              <h2 className="font-heading text-xl font-bold mb-4" style={{ color:"#1A1F3C" }}>Technology Tracks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hackathon.tracks.map(t => (
                  <div key={t.name} className="p-5 rounded-2xl transition-all"
                    style={{ background:"#fff",border:"1px solid rgba(26,31,60,.08)" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor="rgba(244,98,42,.2)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor="rgba(26,31,60,.08)"}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold" style={{ color:"#1A1F3C" }}>{t.name}</h3>
                      <span className="text-sm font-mono font-bold" style={{ color:"#F4622A" }}>{t.prize}</span>
                    </div>
                    <p className="text-sm" style={{ color:"rgba(26,31,60,.5)" }}>{t.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hackathon.prizes?.length > 0 && (
            <div className="mb-10">
              <h2 className="font-heading text-xl font-bold mb-4" style={{ color:"#1A1F3C" }}>Prizes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {hackathon.prizes.map((p, i) => (
                  <div key={i} className="p-5 rounded-2xl border"
                    style={{ background:i===0?"linear-gradient(135deg,rgba(244,98,42,.08),rgba(124,77,255,.05))":"#fff", borderColor:i===0?"rgba(244,98,42,.2)":"rgba(26,31,60,.08)" }}>
                    <p className="text-2xl font-bold mb-1" style={{ color:"#1A1F3C" }}>{p.amount}</p>
                    <p className="text-sm font-semibold mb-1" style={{ color:"#1A1F3C" }}>{p.place}</p>
                    <p className="text-xs" style={{ color:"rgba(26,31,60,.5)" }}>{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hackathon.faqs?.length > 0 && (
            <div>
              <h2 className="font-heading text-xl font-bold mb-4" style={{ color:"#1A1F3C" }}>FAQ</h2>
              <div className="space-y-2">
                {hackathon.faqs.map((faq, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div key={i} className="rounded-2xl border overflow-hidden"
                      style={{ borderColor:isOpen?"rgba(244,98,42,.25)":"rgba(26,31,60,.08)",background:isOpen?"#FFF8F5":"#fff" }}>
                      <button onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                        aria-expanded={isOpen}>
                        <span className="font-semibold text-sm" style={{ color:"#1A1F3C" }}>{faq.question}</span>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                          style={isOpen?{background:"linear-gradient(135deg,#F4622A,#FB923C)",color:"#fff"}:{background:"rgba(26,31,60,.06)",color:"rgba(26,31,60,.5)"}}>
                          {isOpen ? <Minus className="w-3 h-3" aria-hidden="true" /> : <Plus className="w-3 h-3" aria-hidden="true" />}
                        </div>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5">
                          <div className="h-px mb-3" style={{ background:"rgba(244,98,42,.15)" }} />
                          <p className="text-sm leading-relaxed" style={{ color:"rgba(26,31,60,.6)" }}>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </PageShell>
  );
}

