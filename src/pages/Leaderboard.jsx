import { useState } from "react"
import PageShell from "@/components/shared/PageShell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Medal, Star, ExternalLink, Github, Lock } from "lucide-react"
import { motion } from "framer-motion"
import { hackathons, submissions } from "@/lib/mockData"

export default function Leaderboard() {
  const [trackFilter, setTrackFilter] = useState("all")
  const hackathon = hackathons.find(h => h.status === "active") || hackathons[0]

  if (!hackathon?.leaderboard_published) return <PageShell><div className="max-w-lg mx-auto px-4 py-20 text-center"><div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6"><Lock className="w-8 h-8 text-muted-foreground" /></div><h1 className="font-heading text-2xl font-bold mb-3">Leaderboard Not Published</h1><p className="text-muted-foreground">Results will appear once organizers publish the leaderboard.</p></div></PageShell>

  const ranked = submissions.filter(s => s.status === "submitted").filter(s => trackFilter === "all" || s.track === trackFilter).sort((a, b) => b.average_score - a.average_score)
  const tracks = [...new Set(submissions.map(s => s.track).filter(Boolean))]

  const rs = [{ bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-400", icon: Trophy }, { bg: "bg-slate-400/10 border-slate-400/30", text: "text-slate-300", icon: Medal }, { bg: "bg-orange-500/10 border-orange-500/30", text: "text-orange-400", icon: Medal }]

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="text-center mb-10"><h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-3 flex items-center justify-center gap-2"><Trophy className="w-7 h-7 text-primary" /> Leaderboard</h1><p className="text-muted-foreground">{hackathon?.title} - Live Rankings</p></div>
        <div className="flex justify-center mb-8"><Select value={trackFilter} onValueChange={setTrackFilter}><SelectTrigger className="w-56"><SelectValue placeholder="All Tracks" /></SelectTrigger><SelectContent><SelectItem value="all">All Tracks</SelectItem>{tracks.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
        {ranked.length >= 3 && <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10">{[1, 0, 2].map(idx => { const s = ranked[idx]; if (!s) return null; const style = rs[idx]; const I = style.icon; return (<motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className={`rounded-2xl border p-4 sm:p-6 text-center ${style.bg} ${idx === 0 ? "sm:-mt-4" : ""}`}><div className={`w-10 h-10 rounded-full ${style.bg} flex items-center justify-center mx-auto mb-3`}><I className={`w-5 h-5 ${style.text}`} /></div><p className={`text-3xl sm:text-4xl font-bold font-mono ${style.text}`}>#{idx + 1}</p><h3 className="font-semibold mt-2 text-sm sm:text-base truncate">{s.team_name}</h3><p className="text-xs text-muted-foreground truncate mb-2">{s.project_title}</p><p className="text-lg font-mono font-bold">{s.average_score}<span className="text-xs text-muted-foreground">/40</span></p></motion.div>)})}</div>}
        <div className="space-y-3">{ranked.map((s, i) => (<motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}><Card className={`overflow-hidden transition-all hover:shadow-sm ${i < 3 ? "border-primary/20" : ""}`}><CardContent className="p-4 flex items-center gap-4"><span className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 ${i === 0 ? "bg-amber-500/10 text-amber-400" : i === 1 ? "bg-slate-400/10 text-slate-300" : i === 2 ? "bg-orange-500/10 text-orange-400" : "bg-muted text-muted-foreground"}`}>#{i + 1}</span><div className="flex-1 min-w-0"><div className="flex items-center gap-2 flex-wrap"><h3 className="font-semibold text-sm truncate">{s.team_name}</h3><Badge variant="secondary" className="text-[10px]">{s.track}</Badge></div><p className="text-xs text-muted-foreground truncate">{s.project_title}</p></div><div className="flex items-center gap-3 shrink-0">{s.demo_url && <a href={s.demo_url} target="_blank" className="text-muted-foreground hover:text-primary"><ExternalLink className="w-4 h-4" /></a>}{s.github_url && <a href={s.github_url} target="_blank" className="text-muted-foreground hover:text-primary"><Github className="w-4 h-4" /></a>}<div className="text-right"><p className="text-lg font-mono font-bold">{s.average_score}</p><div className="flex items-center gap-0.5"><Star className="w-3 h-3 text-amber-400" /><span className="text-[10px] text-muted-foreground">{s.scores?.length} reviews</span></div></div></div></CardContent></Card></motion.div>))}</div>
      </div>
    </PageShell>
  )
}
