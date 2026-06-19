import { BarChart3, Megaphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type OrganizerHeaderProps = {
  title?: string;
  stats: { label: string; value: number; icon: LucideIcon; color: string; bg: string }[];
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onBroadcast: () => void;
};

export default function OrganizerHeader({ title, stats, tabs, activeTab, setActiveTab, onBroadcast }: OrganizerHeaderProps) {
  return (
    <>
      <div className="dark-hero-panel relative overflow-hidden pt-28 pb-12" style={{ background:"linear-gradient(135deg,#FFF5EF 0%,#F5F0FF 50%,#F0F8FF 100%)" }}>
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="dark-hero-content relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background:"linear-gradient(135deg,#F4622A,#FB923C)",boxShadow:"0 8px 28px rgba(244,98,42,.4)" }}>
                <BarChart3 className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <div>
                <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight" style={{ color:"#1A1F3C" }}>Organizer Dashboard</h1>
                <p className="text-base font-semibold mt-0.5" style={{ color:"rgba(26,31,60,.55)" }}>{title}</p>
              </div>
            </div>
            <button className="btn-primary flex items-center gap-2 px-6 py-3 rounded-2xl text-sm" onClick={onBroadcast}>
              <Megaphone className="w-4 h-4" aria-hidden="true" /> Broadcast
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" role="list" aria-label="Dashboard stats">
        {stats.map((s) => (
          <div key={s.label} className="card-light rounded-2xl p-5" role="listitem">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background:s.bg }}>
                <s.icon className="w-5 h-5" style={{ color:s.color }} aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-extrabold" style={{ color:"#1A1F3C" }}>{s.value}</p>
                <p className="text-xs font-medium" style={{ color:"rgba(26,31,60,.45)" }}>{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1 p-1.5 rounded-2xl mb-6 organizer-tabs w-fit" style={{ background:"rgba(244,98,42,.08)",border:"1px solid rgba(244,98,42,.18)" }} role="tablist">
        {tabs.map(tab=>(
          <button key={tab} role="tab" aria-selected={activeTab===tab} data-state={activeTab===tab?"active":"inactive"} onClick={()=>setActiveTab(tab)} className="px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize">
            {tab==="judges"?"Judge Assignment":tab.charAt(0).toUpperCase()+tab.slice(1)}
          </button>
        ))}
      </div>
    </>
  );
}
