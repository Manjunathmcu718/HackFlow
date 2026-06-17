import type { CSSProperties } from "react";
import { Download, Search } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import type { Registration } from "@/mocks/types";

type RegistrationsTabProps = {
  registrations: Registration[];
  filteredRegs: Registration[];
  searchReg: string;
  setSearchReg: (value: string) => void;
  exportCSV: () => void;
  thS: CSSProperties;
  tdS: CSSProperties;
};

export default function RegistrationsTab({ registrations, filteredRegs, searchReg, setSearchReg, exportCSV, thS, tdS }: RegistrationsTabProps) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background:"#fff",border:"1px solid rgba(26,31,60,.09)" }}>
      <div className="p-5 flex items-center justify-between flex-wrap gap-3 border-b" style={{ borderColor:"rgba(26,31,60,.08)" }}>
        <h2 className="font-heading font-bold text-base" style={{ color:"#1A1F3C" }}>Participants ({registrations.length})</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:"rgba(26,31,60,.35)" }} aria-hidden="true" />
            <input placeholder="Search..." value={searchReg} onChange={e=>setSearchReg(e.target.value)} className="pl-9 h-9 rounded-xl text-sm outline-none w-56" style={{ background:"rgba(26,31,60,.04)",border:"1px solid rgba(26,31,60,.08)",color:"#1A1F3C" }} aria-label="Search registrations" />
          </div>
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold" style={{ background:"rgba(244,98,42,.1)",color:"#F4622A",border:"1px solid rgba(244,98,42,.25)" }} aria-label="Export registrations as CSV">
            <Download className="w-3.5 h-3.5" aria-hidden="true" /> Export
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead><tr><th style={thS}>Name</th><th style={thS}>Email</th><th style={thS}>Organization</th><th style={thS}>Track</th><th style={thS}>Status</th></tr></thead>
          <tbody>
            {filteredRegs.map((r) => (
              <tr key={r.id}>
                <td style={{...tdS,fontWeight:600,color:"#1A1F3C"}}>{r.participant_name}</td>
                <td style={{...tdS,color:"rgba(26,31,60,.6)"}}>{r.email}</td>
                <td style={{...tdS,color:"rgba(26,31,60,.7)"}}>{r.organization}</td>
                <td style={{...tdS,color:"rgba(26,31,60,.7)"}}>{r.track}</td>
                <td style={tdS}><StatusBadge status={r.status} /></td>
              </tr>
            ))}
            {filteredRegs.length===0&&<tr><td colSpan={5} className="text-center py-8" style={{ color:"rgba(26,31,60,.4)" }}>No registrations found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
