import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { hackathons as allHackathons } from "../lib/mockData";
import PageShell from "../components/shared/PageShell";
import StatusBadge from "../components/shared/StatusBadge";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Search, Calendar, Users, ArrowRight, Layers, Trophy, Zap } from "lucide-react";

function Orb({ style }) {
  return (
    <motion.div className="absolute rounded-full pointer-events-none" style={style}
      animate={{ y:[0,-30,0], x:[0,15,0], scale:[1,1.08,1] }}
      transition={{ duration:style.dur||8, repeat:Infinity, ease:"easeInOut", delay:style.del||0 }} />
  );
}

const THEMES = [
  { banner:"linear-gradient(135deg,#F4622A,#FB923C,#FDE68A)", accent:"#F4622A", chip:"rgba(244,98,42,.12)", chipText:"#F4622A" },
  { banner:"linear-gradient(135deg,#7C4DFF,#A855F7,#C084FC)", accent:"#7C4DFF", chip:"rgba(124,77,255,.12)", chipText:"#7C4DFF" },
  { banner:"linear-gradient(135deg,#06B6D4,#3B82F6,#6366F1)", accent:"#06B6D4", chip:"rgba(6,182,212,.12)",  chipText:"#06B6D4" },
  { banner:"linear-gradient(135deg,#10B981,#06B6D4,#3B82F6)", accent:"#10B981", chip:"rgba(16,185,129,.12)", chipText:"#10B981" },
  { banner:"linear-gradient(135deg,#EC4899,#F4622A,#FB923C)", accent:"#EC4899", chip:"rgba(236,72,153,.12)", chipText:"#EC4899" },
  { banner:"linear-gradient(135deg,#F59E0B,#F97316,#F4622A)", accent:"#F59E0B", chip:"rgba(245,158,11,.12)", chipText:"#D97706" },
];

function HackCard({ h, i }) {
  const t = THEMES[i % THEMES.length];
  return (
    <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }}
      transition={{ delay:i*.07, duration:.6, ease:[.22,1,.36,1] }}
      whileHover={{ y:-8, transition:{ duration:.25 } }}>
      <Link to={`/hackathon/${h.id}`} className="block group h-full">
        <div className="card-light rounded-3xl overflow-hidden h-full flex flex-col">
          <div className="relative h-44 overflow-hidden" style={{ background:t.banner }}>
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full border-2 spin-slow" style={{ borderColor:"rgba(255,255,255,.2)" }} />
            <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom,transparent 20%,rgba(255,255,255,1) 100%)" }} />
            <div className="absolute top-3 left-3"><StatusBadge status={h.status} /></div>
            {h.tracks?.length > 0 && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
                style={{ background:"rgba(255,255,255,.9)", color:t.accent, backdropFilter:"blur(8px)" }}>
                <Layers className="w-3 h-3" /> {h.tracks.length} tracks
              </div>
            )}
          </div>
          <div className="px-5 pb-5 pt-3 flex-1 flex flex-col" style={{ background:"#fff" }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ background:t.accent }} />
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color:t.accent }}>{h.status}</span>
            </div>
            <h3 className="font-heading font-extrabold text-lg mb-2 leading-snug" style={{ color:"#1A1F3C" }}>{h.title}</h3>
            <p className="text-sm line-clamp-2 flex-1 leading-relaxed mb-4" style={{ color:"rgba(26,31,60,.5)" }}>{h.tagline}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {h.participant_count > 0 && (
                <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background:t.chip, color:t.chipText }}>
                  <Users className="w-3 h-3" /> {h.participant_count.toLocaleString()}
                </span>
              )}
              {h.prizes?.length > 0 && (
                <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background:"rgba(245,158,11,.1)", color:"#D97706" }}>
                  <Trophy className="w-3 h-3" /> {h.prizes[0]?.amount}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between pt-3.5" style={{ borderTop:"1px solid rgba(26,31,60,.06)" }}>
              <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color:"rgba(26,31,60,.4)" }}>
                <Calendar className="w-3 h-3" style={{ color:t.accent }} />
                {h.start_date ? format(new Date(h.start_date),"MMM d") : "TBD"} - {h.end_date ? format(new Date(h.end_date),"MMM d") : "TBD"}
              </span>
              <motion.span whileHover={{ x:3 }} className="flex items-center gap-1 text-xs font-bold" style={{ color:t.accent }}>
                Explore <ArrowRight className="w-3 h-3" />
              </motion.span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function HackathonList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const filtered = useMemo(() => allHackathons.filter(h => {
    const q = search.toLowerCase();
    const matchText   = h.title?.toLowerCase().includes(q) || h.tagline?.toLowerCase().includes(q);
    const matchStatus = status === "all" || h.status === status;
    return matchText && matchStatus;
  }), [search, status]);

  const shown = filtered.slice(0, page * PER_PAGE);

  return (
    <PageShell>
      {/* Hero */}
      <div className="relative overflow-hidden pt-36 pb-24" style={{ background:"linear-gradient(160deg,#FFF8F4 0%,#FAFEFF 50%,#F8F5FF 100%)" }}>
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <Orb style={{ width:520, height:520, top:"-120px", right:"-100px", background:"radial-gradient(ellipse,rgba(244,98,42,.18) 0%,transparent 70%)", filter:"blur(70px)", dur:10, del:0 }} />
        <Orb style={{ width:400, height:400, bottom:"-80px", left:"-80px", background:"radial-gradient(ellipse,rgba(124,77,255,.16) 0%,transparent 70%)", filter:"blur(60px)", dur:12, del:2 }} />
        <motion.div className="absolute top-16 right-24 w-24 h-24 rounded-full border-2 pointer-events-none"
          style={{ borderColor:"rgba(244,98,42,.15)", borderStyle:"dashed" }}
          animate={{ rotate:360 }} transition={{ duration:20, repeat:Infinity, ease:"linear" }} />
        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{ background:"linear-gradient(to bottom,transparent,#FAF8F5)" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="flex items-center gap-3 mb-6">
            <motion.span className="text-[10px] font-bold uppercase tracking-[.22em] pill-coral px-3 py-1.5 flex items-center gap-1.5"
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.3 }}>
              <Zap className="w-3 h-3" /> EXPLORE EVENTS
            </motion.span>
          </motion.div>

          <div className="mb-5 overflow-hidden">
            {["Find","Your","Next"].map((word, i) => (
              <motion.span key={word} className="inline-block font-heading font-extrabold tracking-tight mr-4"
                style={{ fontSize:"clamp(3rem,7vw,5.5rem)", color:"#1A1F3C", lineHeight:1.05 }}
                initial={{ opacity:0, y:60 }} animate={{ opacity:1, y:0 }}
                transition={{ duration:.65, delay:i*.12, ease:[.22,1,.36,1] }}>
                {word}
              </motion.span>
            ))}
            <br />
            <motion.span className="inline-block font-heading font-extrabold tracking-tight text-shimmer"
              style={{ fontSize:"clamp(3rem,7vw,5.5rem)", lineHeight:1.05 }}
              initial={{ opacity:0, y:60, scale:.9 }} animate={{ opacity:1, y:0, scale:1 }}
              transition={{ duration:.75, delay:.42, ease:[.22,1,.36,1] }}>
              Hackathon
            </motion.span>
          </div>

          <motion.p className="text-lg max-w-md mb-8 font-medium" style={{ color:"rgba(26,31,60,.55)" }}
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.55 }}>
            Discover and join hackathons happening around the world.
          </motion.p>

          <motion.div className="flex flex-wrap gap-3" initial="hidden" animate="visible"
            variants={{ visible:{ transition:{ staggerChildren:.1, delayChildren:.65 } } }}>
            {[
              { label:"Active Events",   val:allHackathons.filter(h=>h.status==="active").length,                           color:"#10B981" },
              { label:"Total Builders",  val:allHackathons.reduce((s,h)=>s+(h.participant_count||0),0).toLocaleString(),    color:"#F4622A" },
              { label:"Total Prize Pool",val:"$25K+",                                                                        color:"#7C4DFF" },
            ].map(({ label, val, color }) => (
              <motion.div key={label} className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
                style={{ background:"rgba(255,255,255,.85)", border:"1px solid rgba(0,0,0,.07)", backdropFilter:"blur(8px)" }}
                variants={{ hidden:{ opacity:0, y:20 }, visible:{ opacity:1, y:0, transition:{ duration:.5 } } }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background:color }} />
                <span className="font-extrabold text-sm" style={{ color:"#1A1F3C" }}>{val}</span>
                <span className="text-xs" style={{ color:"rgba(26,31,60,.45)" }}>{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Filters + Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:"rgba(244,98,42,.5)" }} />
            <input placeholder="Search hackathons..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 h-12 rounded-2xl text-sm outline-none"
              style={{ background:"#fff", border:"1px solid rgba(0,0,0,.08)", color:"#1A1F3C" }} />
          </div>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="h-12 rounded-2xl px-4 text-sm font-semibold outline-none w-full sm:w-44"
            style={{ background:"#fff", border:"1px solid rgba(0,0,0,.08)", color:"#1A1F3C" }}>
            <option value="all">All Status</option>
            <option value="active">ðŸŸ¢ Active</option>
            <option value="upcoming">ðŸ”µ Upcoming</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-5xl mb-4">ðŸ”</div>
            <p className="font-heading font-bold text-xl mb-2" style={{ color:"#1A1F3C" }}>No hackathons found</p>
            <p className="text-sm" style={{ color:"rgba(26,31,60,.45)" }}>Try a different search or filter</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shown.map((h, i) => <HackCard key={h.id} h={h} i={i} />)}
            </div>
            {shown.length < filtered.length && (
              <div className="flex justify-center mt-12">
                <button onClick={() => setPage(p => p+1)}
                  className="btn-outline flex items-center gap-2 px-8 py-3.5 text-sm">
                  Load More <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </PageShell>
  );
}


