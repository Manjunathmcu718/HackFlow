import { Link } from "react-router-dom"
import PageShell from "@/components/shared/PageShell"
import StatusBadge from "@/components/shared/StatusBadge"
import CountdownTimer from "@/components/shared/CountdownTimer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Copy, Send, Trophy, ExternalLink, Megaphone, BookOpen, Clock, ArrowRight, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { hackathons, teams, submissions, announcements } from "@/lib/mockData"

export default function ParticipantDashboard() {
  const hackathon = hackathons.find(h => h.status === "active") || hackathons[0]
  const team = teams[0]
  const sub = submissions.find(s => s.team_id === team?.id)

  const lb = submissions.filter(s => s.status === "submitted" && s.average_score > 0).sort((a, b) => b.average_score - a.average_score)
  const rank = lb.findIndex(s => s.team_id === team?.id) + 1

  const pi = { urgent: AlertTriangle, warning: Clock, info: Megaphone }
  const pc = { urgent: "text-destructive", warning: "text-amber-400", info: "text-blue-400" }

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8"><h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-1">Participant Dashboard</h1><p className="text-muted-foreground">{hackathon?.title}</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3"><div className="flex items-center justify-between"><CardTitle className="text-base flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Team Overview</CardTitle><StatusBadge status={team?.submission_status || "not_started"} /></div></CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4"><div><h3 className="font-semibold text-lg">{team?.name}</h3><p className="text-xs text-muted-foreground">Track: {team?.track}</p></div><Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => navigator.clipboard.writeText(team?.invite_code || "")}>{team?.invite_code} <Copy className="w-3 h-3" /></Button></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{(team?.members || []).map((m, i) => <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"><div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{m.name?.charAt(0)}</div><div><p className="text-sm font-medium">{m.name}</p><p className="text-xs text-muted-foreground">{m.role}</p></div></div>)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3"><div className="flex items-center justify-between"><CardTitle className="text-base flex items-center gap-2"><Send className="w-4 h-4 text-primary" /> Submission</CardTitle><StatusBadge status={sub?.status || "draft"} /></div></CardHeader>
              <CardContent>
                {sub ? <><h3 className="font-semibold mb-1">{sub.project_title}</h3><p className="text-sm text-muted-foreground mb-3 line-clamp-2">{sub.description}</p><div className="flex flex-wrap gap-1.5 mb-4">{(sub.tech_stack || []).map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}</div></> : <div className="text-center py-4"><p className="text-sm text-muted-foreground mb-3">No submission yet.</p></div>}
                <Link to="/submit"><Button className="w-full rounded-lg gap-2">{sub ? "Edit Submission" : "Start Submission"} <ArrowRight className="w-4 h-4" /></Button></Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Megaphone className="w-4 h-4 text-primary" /> Announcements</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">{announcements.slice(0, 5).map(a => { const I = pi[a.priority] || Megaphone; return (<div key={a.id} className="flex gap-3 p-3 rounded-lg bg-muted/50"><I className={`w-4 h-4 mt-0.5 shrink-0 ${pc[a.priority] || "text-muted-foreground"}`} /><div><div className="flex items-center gap-2"><p className="text-sm font-semibold">{a.title}</p><StatusBadge status={a.priority} /></div><p className="text-xs text-muted-foreground mt-0.5">{a.message}</p><p className="text-[10px] text-muted-foreground mt-1">{a.created_date ? format(new Date(a.created_date), "MMM d, h:mm a") : ""}</p></div></div>)})}</div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card><CardContent className="p-5"><CountdownTimer targetDate={hackathon?.submission_deadline} label="Submission Deadline" compact /></CardContent></Card>
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Trophy className="w-4 h-4 text-primary" /> Leaderboard</CardTitle></CardHeader>
              <CardContent>
                {rank > 0 && <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 mb-3 text-center"><p className="text-xs text-muted-foreground">Your Position</p><p className="text-2xl font-bold text-primary">#{rank}</p></div>}
                <div className="space-y-2">{lb.slice(0, 5).map((s, i) => <div key={s.id} className="flex items-center gap-3 text-sm"><span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-amber-500/10 text-amber-400" : i === 1 ? "bg-slate-400/10 text-slate-300" : i === 2 ? "bg-orange-500/10 text-orange-400" : "bg-muted text-muted-foreground"}`}>{i + 1}</span><span className="flex-1 truncate font-medium">{s.team_name}</span><span className="font-mono text-xs font-semibold">{s.average_score}</span></div>)}</div>
                <Link to="/leaderboard"><Button variant="ghost" size="sm" className="w-full mt-3 text-xs">View Full Leaderboard</Button></Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" /> Resources</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">{[{ l: "API Documentation" }, { l: "Problem Statements" }, { l: "Mentor Schedule" }, { l: "Discord Community" }].map(r => <a key={r.l} href="#" className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"><span className="text-sm">{r.l}</span><ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" /></a>)}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
