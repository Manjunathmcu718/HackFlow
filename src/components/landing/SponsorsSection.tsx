import React from "react";
import { motion } from "framer-motion";

const DEFAULT = [
  { name: "Ethereum Foundation", tier: "platinum" },
  { name: "Polygon",             tier: "gold" },
  { name: "Chainlink",           tier: "gold" },
  { name: "Alchemy",             tier: "silver" },
  { name: "The Graph",           tier: "silver" },
  { name: "IPFS",                tier: "silver" },
];
const DOTS = ["#F4622A","#7C4DFF","#06B6D4","#10B981","#F59E0B","#EC4899"];

export default function SponsorsSection({ sponsors }) {
  const all      = sponsors?.length > 0 ? sponsors : DEFAULT;
  const platinum = all.filter(s => s.tier === "platinum");
  const gold     = all.filter(s => s.tier === "gold");
  const ticker   = [...all, ...all, ...all];

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden" style={{ background: "#fff" }}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-4 pill-violet px-3 py-1.5">
            BACKED BY LEADERS
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .1 }}
            className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight" style={{ color: "#1A1F3C" }}>
            Our{" "}
            <span style={{ background: "linear-gradient(120deg,#7C4DFF,#A855F7,#EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Sponsors
            </span>
          </motion.h2>
        </div>

        {platinum.length > 0 && (
          <div className="mb-10">
            <p className="text-center text-[10px] text-muted-foreground font-mono uppercase tracking-[.2em] mb-5">Platinum Partners</p>
            <div className="flex flex-wrap justify-center gap-4">
              {platinum.map(s => (
                <motion.div key={s.name} whileHover={{ scale: 1.05 }}
                  className="px-8 py-4 rounded-2xl font-heading font-bold text-lg cursor-default"
                  style={{ background: "linear-gradient(135deg,rgba(245,158,11,.08),rgba(249,115,22,.04))", border: "1.5px solid rgba(245,158,11,.25)", color: "#D97706" }}>
                  {s.name}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {gold.length > 0 && (
          <div className="mb-10">
            <p className="text-center text-[10px] text-muted-foreground font-mono uppercase tracking-[.2em] mb-5">Gold Partners</p>
            <div className="flex flex-wrap justify-center gap-3">
              {gold.map(s => (
                <motion.div key={s.name} whileHover={{ scale: 1.04 }}
                  className="card-light px-6 py-3 rounded-xl font-semibold text-base cursor-default" style={{ color: "#1A1F3C" }}>
                  {s.name}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative overflow-hidden py-4"
        style={{ borderTop: "1px solid rgba(0,0,0,.06)", borderBottom: "1px solid rgba(0,0,0,.06)", background: "rgba(250,248,245,.8)" }}>
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(to right,#fff,transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(to left,#fff,transparent)" }} />
        <div className="ticker-inner flex items-center gap-10 whitespace-nowrap" style={{ width: "max-content" }}>
          {ticker.map((s, i) => (
            <div key={i} className="flex items-center gap-3 text-sm font-semibold shrink-0" style={{ color: "rgba(26,31,60,.4)" }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: DOTS[i % DOTS.length] }} />
              {s.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

