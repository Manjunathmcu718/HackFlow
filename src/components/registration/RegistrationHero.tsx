import { Sparkles } from "lucide-react";
import FloatingOrb from "@/components/shared/FloatingOrb";

export default function RegistrationHero({ hackathonTitle }: { hackathonTitle?: string }) {
  return (
    <div className="relative overflow-hidden pt-28 pb-10"
      style={{ background:"linear-gradient(160deg,#FFF8F4 0%,#FAFEFF 50%,#F8F5FF 100%)" }}>
      <FloatingOrb style={{ width:500,height:500,top:"-120px",right:"-100px",background:"radial-gradient(ellipse,rgba(244,98,42,.16) 0%,transparent 70%)",filter:"blur(70px)",dur:10,del:0 }} />
      <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
        style={{ background:"linear-gradient(to bottom,transparent,#FAF8F5)" }} />
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[.2em] pill-coral px-3 py-1 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" aria-hidden="true" /> REGISTRATION
          </span>
        </div>
        <h1 className="font-heading font-extrabold tracking-tight" style={{ fontSize:"clamp(2rem,5vw,3.2rem)",color:"#1A1F3C" }}>
          Register for <span className="text-shimmer">Hackathon</span>
        </h1>
        <p className="mt-2 text-base font-semibold" style={{ color:"rgba(26,31,60,.5)" }}>{hackathonTitle}</p>
      </div>
    </div>
  );
}
