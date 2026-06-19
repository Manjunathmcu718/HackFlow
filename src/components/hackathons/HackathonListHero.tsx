import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import FloatingOrb from "@/components/shared/FloatingOrb";
import type { Hackathon } from "@/mocks/types";

type HackathonListHeroProps = {
  hackathons: Hackathon[];
};

export default function HackathonListHero({ hackathons }: HackathonListHeroProps) {
  return (
    <div className="dark-hero-panel relative overflow-hidden pt-24 sm:pt-28 pb-20" style={{ background:"linear-gradient(160deg,#FFF8F4 0%,#FAFEFF 50%,#F8F5FF 100%)" }}>
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <FloatingOrb scale style={{ width:520,height:520,top:"-120px",right:"-100px",background:"radial-gradient(ellipse,rgba(244,98,42,.18) 0%,transparent 70%)",filter:"blur(70px)",dur:10,del:0 }} />
      <FloatingOrb scale style={{ width:400,height:400,bottom:"-80px",left:"-80px",background:"radial-gradient(ellipse,rgba(124,77,255,.16) 0%,transparent 70%)",filter:"blur(60px)",dur:12,del:2 }} />
      <motion.div className="absolute top-16 right-24 w-24 h-24 rounded-full border-2 pointer-events-none"
        style={{ borderColor:"rgba(244,98,42,.15)",borderStyle:"dashed" }}
        animate={{ rotate:360 }} transition={{ duration:20,repeat:Infinity,ease:"linear" }} />
      <div className="hero-fade absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{ background:"linear-gradient(to bottom,transparent,#FAF8F5)" }} />

      <div className="dark-hero-content relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} className="flex items-center gap-3 mb-6">
          <span className="text-[10px] font-bold uppercase tracking-[.22em] pill-coral px-3 py-1.5 flex items-center gap-1.5">
            <Zap className="w-3 h-3" aria-hidden="true" /> EXPLORE EVENTS
          </span>
        </motion.div>
        <div className="mb-5 overflow-hidden">
          {["Find","Your","Next"].map((word, i) => (
            <motion.span key={word} className="inline-block font-heading font-extrabold tracking-tight mr-4"
              style={{ fontSize:"clamp(3rem,7vw,5.5rem)",color:"#1A1F3C",lineHeight:1.05 }}
              initial={{ opacity:0,y:60 }} animate={{ opacity:1,y:0 }}
              transition={{ duration:.65,delay:i*.12,ease:[.22,1,.36,1] }}>
              {word}
            </motion.span>
          ))}
          <br />
          <motion.span className="inline-block font-heading font-extrabold tracking-tight text-shimmer"
            style={{ fontSize:"clamp(3rem,7vw,5.5rem)",lineHeight:1.05 }}
            initial={{ opacity:0,y:60,scale:.9 }} animate={{ opacity:1,y:0,scale:1 }}
            transition={{ duration:.75,delay:.42,ease:[.22,1,.36,1] }}>
            Hackathon
          </motion.span>
        </div>
        <motion.p className="text-lg max-w-md mb-8 font-medium" style={{ color:"rgba(26,31,60,.55)" }}
          initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:.55 }}>
          Discover and join hackathons happening around the world.
        </motion.p>
        <div className="flex flex-wrap gap-3">
          {[
            { label:"Active Events", val: hackathons.filter(h=>h.status==="active").length, color:"#10B981" },
            { label:"Total Builders", val: hackathons.reduce((s,h)=>s+(h.participant_count||0),0).toLocaleString(), color:"#F4622A" },
            { label:"Total Prize Pool", val: "$25K+", color:"#7C4DFF" },
          ].map(({ label, val, color }) => (
            <div key={label} className="app-card flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
              style={{ background:"rgba(255,255,255,.85)",border:"1px solid rgba(0,0,0,.07)",backdropFilter:"blur(8px)" }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ background:color }} />
              <span className="font-extrabold text-sm" style={{ color:"#1A1F3C" }}>{val}</span>
              <span className="text-xs" style={{ color:"rgba(26,31,60,.45)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
