import { Link } from "react-router-dom";
import { Trophy, BookOpen, ExternalLink } from "lucide-react";
import CountdownTimer from "@/components/shared/CountdownTimer";
import type { Hackathon, Submission, Team } from "@/mocks/types";
import type { ReactNode, CSSProperties } from "react";

type ParticipantSidebarProps = {
  hackathon?: Hackathon;
  team?: Team;
  leaderboardData: Submission[];
  myRank: number;
  LightCard: (props: { children: ReactNode; className?: string; style?: CSSProperties }) => JSX.Element;
};

export default function ParticipantSidebar({ hackathon, team, leaderboardData, myRank, LightCard }: ParticipantSidebarProps) {
  const rankStyle = (i: number) => ({
    bg: i===0?"rgba(245,158,11,.15)":i===1?"rgba(148,163,184,.15)":i===2?"rgba(249,115,22,.15)":"rgba(26,31,60,.07)",
    color: i===0?"#D97706":i===1?"#64748B":i===2?"#EA580C":"rgba(26,31,60,.5)",
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-5" style={{ background:"linear-gradient(135deg,#FFF5EF,#FFF0FF)",border:"1px solid rgba(244,98,42,.15)" }}>
        <CountdownTimer targetDate={hackathon?.submission_deadline} label="Submission Deadline" compact />
      </div>

      <LightCard>
        <div className="p-5 pb-3 border-b" style={{ borderColor:"rgba(26,31,60,.07)" }}>
          <div className="flex items-center gap-2 font-semibold text-sm" style={{ color:"#1A1F3C" }}>
            <Trophy className="w-4 h-4" style={{ color:"#F59E0B" }} aria-hidden="true" /> Leaderboard
          </div>
        </div>
        <div className="p-5">
          {myRank>0&&(
            <div className="p-3 rounded-2xl mb-4 text-center" style={{ background:"linear-gradient(135deg,rgba(244,98,42,.08),rgba(251,146,60,.08))",border:"1px solid rgba(244,98,42,.15)" }}>
              <p className="text-xs font-semibold mb-0.5" style={{ color:"rgba(26,31,60,.5)" }}>Your Position</p>
              <p className="text-2xl font-extrabold" style={{ color:"#F4622A" }}>#{myRank}</p>
            </div>
          )}
          <div className="space-y-2">
            {leaderboardData.slice(0,5).map((s,i)=>{
              const rs=rankStyle(i);
              return (
                <div key={s.id} className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background:rs.bg,color:rs.color }}>{i+1}</span>
                  <span className="flex-1 truncate font-medium" style={{ color:"#1A1F3C" }}>{s.team_name}</span>
                  <span className="font-mono text-xs font-bold" style={{ color:"#F4622A" }}>{s.average_score}</span>
                </div>
              );
            })}
          </div>
          <Link to="/leaderboard">
            <button className="btn-outline w-full flex items-center justify-center gap-1 px-4 py-2.5 rounded-2xl text-xs mt-4">View Full Leaderboard</button>
          </Link>
        </div>
      </LightCard>

      <LightCard>
        <div className="p-5 pb-3 border-b" style={{ borderColor:"rgba(26,31,60,.07)" }}>
          <div className="flex items-center gap-2 font-semibold text-sm" style={{ color:"#1A1F3C" }}>
            <BookOpen className="w-4 h-4" style={{ color:"#F4622A" }} aria-hidden="true" /> Resources
          </div>
        </div>
        <div className="p-5 space-y-2">
          {[
            { label:"API Documentation", url:"#"},
            { label:"Problem Statements", url:"#"},
            { label:"Mentor Schedule", url:"#"},
            { label:"Discord Community", url:"#"},
          ].map(r=>(
            <a key={r.label} href={r.url} className="flex items-center justify-between p-3 rounded-xl transition-all" style={{ background:"rgba(26,31,60,.03)",border:"1px solid rgba(26,31,60,.06)" }}>
              <span className="text-sm font-medium" style={{ color:"#1A1F3C" }}>{r.label}</span>
              <ExternalLink className="w-3.5 h-3.5" style={{ color:"rgba(26,31,60,.35)" }} aria-hidden="true" />
            </a>
          ))}
        </div>
      </LightCard>
    </div>
  );
}
