import { useState } from "react"
import PageShell from "@/components/shared/PageShell"
import StatusBadge from "@/components/shared/StatusBadge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gavel, ExternalLink, Github, FileText, Film, Star, Check, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { submissions, teams } from "@/lib/mockData"

const rubric = [{ k: "innovation", l: "Innovation", d: "Originality and creative approach" }, { k: "technical", l: "Technical Execution", d: "Code quality and architecture" }, { k: "impact", l: "Impact", d: "Real-world applicability" }, { k: "presentation", l: "Presentation", d: "Clarity, UX, and communication" }]

export default function JudgePanel() {
  const [selected, setSelected] = useState(null)
  const [confirm, setConfirm] = useState(false)
  const [scores, setScores] = useState({ innovation: 5, technical: 5, impact: 5, presentation: 5 })
  const [comments, setComments] = useState("")

  const all = submissions.filter(s => s.status === "submitted")
  const scored = (id) => all.find(s => s.id === id)?.scores?.length > 0

  const submitScore = () => {
    const idx = submissions.findIndex(s => s.id === selected.id)
    const newScore = { judge_name: "Current Judge", ...scores, total: scores.innovation + scores.technical + scores.impact + scores.presentation, comments }
    const allScores = [...(submissions[idx].scores || []), newScore]
    submissions[idx].scores = allScores
    submissions[idx].average_score = Math.round(allScores.reduce((s, sc) => s + sc.total, 0) / allScores.length)
    setSelected(null); setConfirm(false); setScores({ innovation: 5, technical: 5, impact: 5, presentation: 5 }); setComments("")
  }

  const total = scores.innovation + scores.technical + scores.impact + scores.presentation

  const PCard = ({ sub, onClick }) => (
    <div onClick={() => onClick(sub)} className="p-4 rounded-xl border border-border bg-card hover:border-primary/20 hover:shadow-sm cursor-pointer transition-all">
      <div className="flex items-start justify-between mb-2"><h3 className="font-semibold text-sm">{sub.project_title}</h3><StatusBadge status={scored(sub.id) ? "scored" : "unscored"} /></div>
      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{sub.description}</p>
      <div className="flex items-center justify-between"><div className="flex flex-wrap gap-1">{(sub.tech_stack || []).slice(0, 3).map(t => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}</div><span className="text-xs text-muted-foreground">{sub.team_name}</span></div>
      {sub.average_score > 0 && <div className="mt-3 pt-3 border-t border-border flex items-center gap-2"><Star className="w-3.5 h-3.5 text-amber-400" /><span className="text-sm font-semibold">{sub.average_score}/40</span></div>}
    </div>
  )

  if (selected) return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Button variant="ghost" size="sm" onClick={() => setSelected(null)} className="mb-4 gap-2"><ArrowLeft className="w-4 h-4" /> Back to Queue</Button>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-lg">{selected.project_title}</CardTitle><Badge variant="outline">{selected.track}</Badge></div><p className="text-sm text-muted-foreground">by {selected.team_name}</p></CardHeader><CardContent className="space-y-4"><p className="text-sm leading-relaxed">{selected.description}</p><div className="flex flex-wrap gap-1.5">{(selected.tech_stack || []).map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}</div><div className="space-y-2 pt-2">{selected.demo_url && <a href={selected.demo_url} target="_blank" className="flex items-center gap-2 text-sm text-primary hover:underline"><ExternalLink className="w-3.5 h-3.5" /> Live Demo</a>}{selected.github_url && <a href={selected.github_url} target="_blank" className="flex items-center gap-2 text-sm text-primary hover:underline"><Github className="w-3.5 h-3.5" /> GitHub</a>}{selected.pitch_deck_url && <a href={selected.pitch_deck_url} target="_blank" className="flex items-center gap-2 text-sm text-primary hover:underline"><FileText className="w-3.5 h-3.5" /> Pitch Deck</a>}{selected.video_url && <a href={selected.video_url} target="_blank" className="flex items-center gap-2 text-sm text-primary hover:underline"><Film className="w-3.5 h-3.5" /> Demo Video</a>}</div></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">Score This Project</CardTitle></CardHeader><CardContent className="space-y-6">
              {rubric.map(({ k, l, d }) => <div key={k}><div className="flex items-center justify-between mb-2"><div><Label className="text-sm font-semibold">{l}</Label><p className="text-xs text-muted-foreground">{d}</p></div><span className="text-lg font-mono font-bold text-primary w-8 text-right">{scores[k]}</span></div><Slider value={[scores[k]]} onValueChange={([v]) => setScores(s => ({ ...s, [k]: v }))} min={1} max={10} step={1} /></div>)}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-center"><p className="text-xs text-muted-foreground">Total Score</p><p className="text-3xl font-mono font-bold text-primary">{total}<span className="text-sm text-muted-foreground">/40</span></p></div>
              <div><Label>Comments</Label><Textarea value={comments} onChange={e => setComments(e.target.value)} placeholder="Your feedback..." className="mt-1.5" /></div>
              <Button className="w-full rounded-lg gap-2" onClick={() => setConfirm(true)}><Check className="w-4 h-4" /> Submit Score</Button>
            </CardContent></Card>
          </div>
          <Dialog open={confirm} onOpenChange={setConfirm}><DialogContent><DialogHeader><DialogTitle>Confirm Score</DialogTitle></DialogHeader><p className="text-sm text-muted-foreground">Submit score of <strong>{total}/40</strong> for <strong>{selected.project_title}</strong>?</p><DialogFooter><Button variant="outline" onClick={() => setConfirm(false)}>Cancel</Button><Button onClick={submitScore}>Confirm</Button></DialogFooter></DialogContent></Dialog>
        </motion.div>
      </div>
    </PageShell>
  )

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8"><h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-1 flex items-center gap-2"><Gavel className="w-6 h-6 text-primary" /> Judge Panel</h1><p className="text-muted-foreground">{all.length} submissions · {all.filter(s => scored(s.id)).length} reviewed · {all.filter(s => !scored(s.id)).length} pending</p></div>
        <Tabs defaultValue="pending">
          <TabsList className="mb-6"><TabsTrigger value="pending">Pending ({all.filter(s => !scored(s.id)).length})</TabsTrigger><TabsTrigger value="completed">Completed ({all.filter(s => scored(s.id)).length})</TabsTrigger></TabsList>
          <TabsContent value="pending"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{all.filter(s => !scored(s.id)).map(s => <PCard key={s.id} sub={s} onClick={setSelected} />)}{all.filter(s => !scored(s.id)).length === 0 && <p className="text-muted-foreground col-span-full text-center py-10">All reviewed!</p>}</div></TabsContent>
          <TabsContent value="completed"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{all.filter(s => scored(s.id)).map(s => <PCard key={s.id} sub={s} onClick={setSelected} />)}{all.filter(s => scored(s.id)).length === 0 && <p className="text-muted-foreground col-span-full text-center py-10">No reviews completed.</p>}</div></TabsContent>
        </Tabs>
      </div>
    </PageShell>
  )
}
