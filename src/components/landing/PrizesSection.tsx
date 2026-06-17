import React from "react";
import { motion } from "framer-motion";
import { Trophy, Award, Heart, Star, Cpu, Globe, Gamepad2, Wrench } from "lucide-react";

const DEFAULT_PRIZES = [
  { place: "Grand Prize",       amount: "$10,000", description: "Best overall project", icon: Trophy, bg: "linear-gradient(135deg,#F4622A,#FB923C,#FDE68A)", tag: "#F4622A", label: "Top Prize" },
  { place: "1st Place / Track", amount: "$5,000",  description: "Top project per track", icon: Award,  bg: "linear-gradient(135deg,#7C4DFF,#A855F7,#C084FC)", tag: "#7C4DFF", label: null },
  { place: "Best UI/UX",        amount: "$2,500",  description: "Most polished interface", icon: Star,   bg: "linear-gradient(135deg,#EC4899,#F4622A,#FB923C)", tag: "#EC4899", label: null },
  { place: "Community Choice",  amount: "$2,500",  description: "Voted by participants",  icon: Heart,  bg: "linear-gradient(135deg,#10B981,#06B6D4,#3B82F6)", tag: "#10B981", label: null },
];
const TRACK_ICONS = [Cpu, Globe, Gamepad2, Wrench];

export default function PrizesSection({ hackathon }) {
  const prizes = hackathon?.prizes?.length > 0
    ? hackathon.prizes.map((p, i) => ({ ...DEFAULT_PRIZES[i % DEFAULT_PRIZES.length], ...p }))
    : DEFAULT_PRIZES;

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden" style={{ background: "#FAF8F5" }}>
      <div className="absolute inset-0 grid-bg opacity-35 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-4 pill-amber px-3 py-1.5">
            PRIZES &amp; REWARDS
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .1 }}
            className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight mb-4" style={{ color: "#1A1F3C" }}>
            Over{" "}
            <span style={{ background: "linear-gradient(120deg,#F4622A,#FB923C,#F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              $25,000
            </span>{" "}
            in prizes
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: .2 }}
            className="text-lg" style={{ color: "rgba(26,31,60,.5)" }}>
            Compete across tracks. Win life-changing rewards.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {prizes.map((p, i) => (
            <motion.div key={p.place}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="rounded-3xl overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(0,0,0,.08)" }}>
              <div className="h-32 relative" style={{ background: p.bg }}>
                <div className="absolute inset-0 grid-bg opacity-20" />
                {p.label && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{ background: "rgba(255,255,255,.25)", backdropFilter: "blur(8px)" }}>
                    {p.label}
                  </div>
                )}
                <div className="absolute bottom-4 right-4">
                  <p.icon className="w-10 h-10 text-white" style={{ opacity: .7 }} aria-hidden="true" />
                </div>
              </div>
              <div className="bg-white p-5 border border-t-0" style={{ borderColor: "rgba(0,0,0,.07)" }}>
                <div className="font-heading font-extrabold text-3xl mb-1" style={{ color: p.tag }}>{p.amount}</div>
                <div className="font-bold text-sm mb-2" style={{ color: "#1A1F3C" }}>{p.place}</div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(26,31,60,.5)" }}>{p.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {hackathon?.tracks?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="font-heading text-2xl font-bold text-center mb-8" style={{ color: "#1A1F3C" }}>Technology Tracks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hackathon.tracks.map((t, i) => {
                const TIcon = TRACK_ICONS[i % TRACK_ICONS.length];
                return (
                  <motion.div key={t.name} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }} whileHover={{ x: 4 }}
                    className="card-light flex items-start gap-4 p-5 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(244,98,42,.08)" }}>
                      <TIcon style={{ width: 18, height: 18, color: "#F4622A" }} aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-sm" style={{ color: "#1A1F3C" }}>{t.name}</h4>
                        <span className="font-mono text-sm font-bold" style={{ color: "#F4622A" }}>{t.prize}</span>
                      </div>
                      <p className="text-sm" style={{ color: "rgba(26,31,60,.5)" }}>{t.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

