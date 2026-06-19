import { Gavel } from "lucide-react";

type JudgePanelHeroProps = {
  total: number;
  reviewed: number;
  pending: number;
};

export default function JudgePanelHero({ total, reviewed, pending }: JudgePanelHeroProps) {
  return (
    <div className="dark-hero-panel relative overflow-hidden pt-28 pb-12" style={{ background:"linear-gradient(135deg,#FFF5EF 0%,#FFF0FF 50%,#F0F4FF 100%)" }}>
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="dark-hero-content relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background:"linear-gradient(135deg,#7C4DFF,#A855F7)",boxShadow:"0 8px 28px rgba(124,77,255,.4)" }}>
            <Gavel className="w-7 h-7 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight" style={{ color:"#1A1F3C" }}>Judge Panel</h1>
            <p className="text-sm font-medium mt-0.5" style={{ color:"rgba(26,31,60,.55)" }}>Review and score hackathon submissions</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            {label:"Total Submissions",val:total,color:"#7C4DFF"},
            {label:"Reviewed",val:reviewed,color:"#10B981"},
            {label:"Pending",val:pending,color:"#F4622A"},
          ].map(({label,val,color})=>(
            <div key={label} className="app-card flex items-center gap-2 px-4 py-2.5 rounded-2xl" style={{ background:"#fff",border:"1px solid rgba(0,0,0,.07)" }}>
              <div className="w-2 h-2 rounded-full" style={{ background:color }} />
              <span className="font-bold text-base" style={{ color:"#1A1F3C" }}>{val}</span>
              <span className="text-xs" style={{ color:"rgba(26,31,60,.45)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
