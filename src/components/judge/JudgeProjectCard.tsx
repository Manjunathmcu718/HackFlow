import { Star } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import type { Submission } from "@/mocks/types";

type JudgeProjectCardProps = {
  sub: Submission;
  onClick: (submission: Submission) => void;
};

export default function JudgeProjectCard({ sub, onClick }: JudgeProjectCardProps) {
  return (
    <article onClick={() => onClick(sub)} className="card-light p-5 rounded-2xl cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-heading font-bold text-sm" style={{ color:"#1A1F3C" }}>{sub.project_title}</h3>
        <StatusBadge status={sub.scores?.length>0?"scored":"unscored"} />
      </div>
      <p className="text-xs line-clamp-2 mb-3" style={{ color:"rgba(26,31,60,.5)" }}>{sub.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {(sub.tech_stack||[]).slice(0,3).map(t=><span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full pill-violet">{t}</span>)}
        </div>
        <span className="text-xs font-medium" style={{ color:"rgba(26,31,60,.4)" }}>{sub.team_name}</span>
      </div>
      {sub.average_score>0&&(
        <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop:"1px solid rgba(26,31,60,.06)" }}>
          <Star className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
          <span className="text-sm font-bold" style={{ color:"#1A1F3C" }}>{sub.average_score}/40</span>
        </div>
      )}
    </article>
  );
}
