import { Link } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Layers, Trophy, Users } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import type { Hackathon } from "@/mocks/types";

const THEMES = [
  { banner:"linear-gradient(135deg,#F4622A,#FB923C,#FDE68A)", accent:"#F4622A", chip:"rgba(244,98,42,.12)", chipText:"#F4622A" },
  { banner:"linear-gradient(135deg,#7C4DFF,#A855F7,#C084FC)", accent:"#7C4DFF", chip:"rgba(124,77,255,.12)", chipText:"#7C4DFF" },
  { banner:"linear-gradient(135deg,#06B6D4,#3B82F6,#6366F1)", accent:"#06B6D4", chip:"rgba(6,182,212,.12)",  chipText:"#06B6D4" },
  { banner:"linear-gradient(135deg,#10B981,#06B6D4,#3B82F6)", accent:"#10B981", chip:"rgba(16,185,129,.12)", chipText:"#10B981" },
  { banner:"linear-gradient(135deg,#EC4899,#F4622A,#FB923C)", accent:"#EC4899", chip:"rgba(236,72,153,.12)", chipText:"#EC4899" },
  { banner:"linear-gradient(135deg,#F59E0B,#F97316,#F4622A)", accent:"#F59E0B", chip:"rgba(245,158,11,.12)", chipText:"#D97706" },
];

export default function HackCard({ h, i }: { h: Hackathon; i: number }) {
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
                <Layers className="w-3 h-3" aria-hidden="true" /> {h.tracks.length} tracks
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
                  <Users className="w-3 h-3" aria-hidden="true" /> {h.participant_count.toLocaleString()}
                </span>
              )}
              {h.prizes?.length > 0 && (
                <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background:"rgba(245,158,11,.1)", color:"#D97706" }}>
                  <Trophy className="w-3 h-3" aria-hidden="true" /> {h.prizes[0]?.amount}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between pt-3.5" style={{ borderTop:"1px solid rgba(26,31,60,.06)" }}>
              <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color:"rgba(26,31,60,.4)" }}>
                <Calendar className="w-3 h-3" style={{ color:t.accent }} aria-hidden="true" />
                {h.start_date ? format(new Date(h.start_date),"MMM d") : "TBD"} &ndash; {h.end_date ? format(new Date(h.end_date),"MMM d") : "TBD"}
              </span>
              <motion.span whileHover={{ x:3 }} className="flex items-center gap-1 text-xs font-bold" style={{ color:t.accent }}>
                Explore <ArrowRight className="w-3 h-3" aria-hidden="true" />
              </motion.span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
