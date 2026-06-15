import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import PageShell from "@/components/shared/PageShell"
import CountdownTimer from "@/components/shared/CountdownTimer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Save, Send, Lock, Github, ExternalLink, Film, FileText, Plus, X, Check } from "lucide-react"
import { hackathons, teams, submissions, generateId } from "@/lib/mockData"

export default function SubmitProject() {
  const nav = useNavigate()
  const hackathon = hackathons.find(h => h.status === "active") || hackathons[0]
  const team = teams[0]
  const existing = submissions.find(s => s.team_id === team?.id)
  const deadlinePassed = hackathon?.submission_deadline && new Date(hackathon.submission_deadline) < new Date()

  const [form, setForm] = useState({ project_title: "", description: "", tech_stack: [], demo_url: "", github_url: "", pitch_deck_url: "", video_url: "" })
  const [techInput, setTechInput] = useState("")
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { if (existing) setForm({ project_title: existing.project_title || "", description: existing.description || "", tech_stack: existing.tech_stack || [], demo_url: existing.demo_url || "", github_url: existing.github_url || "", pitch_deck_url: existing.pitch_deck_url || "", video_url: existing.video_url || "" }) }, [existing])

  const isSubmitted = existing?.status === "submitted"
  if (deadlinePassed && !isSubmitted) return <PageShell><div className="max-w-lg mx-auto px-4 py-20 text-center"><div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6"><Lock className="w-8 h-8 text-destructive" /></div><h1 className="font-heading text-2xl font-bold mb-3">Submissions Closed</h1><p className="text-muted-foreground">Deadline has passed.</p></div></PageShell>
  if (deadlinePassed && isSubmitted) return <PageShell><div className="max-w-lg mx-auto px-4 py-20 text-center"><div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6"><Check className="w-8 h-8 text-emerald-400" /></div><h1 className="font-heading text-2xl font-bold mb-3">Submission Locked</h1><p className="text-muted-foreground">Your project "{existing.project_title}" has been submitted.</p></div></PageShell>

  return (
    <PageShell>
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16">
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4"><div><h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-1">Submit Your Project</h1><p className="text-muted-foreground">Team: {team?.name} · Track: {team?.track}</p></div><CountdownTimer targetDate={hackathon?.submission_deadline} label="Time Remaining" compact /></div>
        <div className="space-y-6">
          <Card><CardHeader className="pb-3"><CardTitle className="text-base">Project Details</CardTitle></CardHeader><CardContent className="space-y-4">
            <div><Label>Project Title *</Label><Input value={form.project_title} onChange={e => setForm(f => ({ ...f, project_title: e.target.value }))} placeholder="DeFi Shield" className="mt-1.5" /></div>
            <div><Label>Description *</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe your project..." className="mt-1.5 min-h-[120px]" /></div>
            <div><Label>Tech Stack</Label><div className="flex gap-2 mt-1.5"><Input value={techInput} onChange={e => setTechInput(e.target.value)} placeholder="React" onKeyDown={e => e.key === "Enter" && (e.preventDefault(), techInput.trim() && !form.tech_stack.includes(techInput.trim()) && setForm(f => ({ ...f, tech_stack: [...f.tech_stack, techInput.trim()] }), setTechInput("")))} /><Button variant="outline" size="icon" onClick={() => techInput.trim() && !form.tech_stack.includes(techInput.trim()) && setForm(f => ({ ...f, tech_stack: [...f.tech_stack, techInput.trim()] }), setTechInput(""))}><Plus className="w-4 h-4" /></Button></div>
              <div className="flex flex-wrap gap-1.5 mt-2">{form.tech_stack.map(t => <Badge key={t} variant="secondary" className="gap-1 pr-1">{t}<button onClick={() => setForm(f => ({ ...f, tech_stack: f.tech_stack.filter(x => x !== t) }))} className="ml-1 hover:text-destructive"><X className="w-3 h-3" /></button></Badge>)}</div></div>
          </CardContent></Card>
          <Card><CardHeader className="pb-3"><CardTitle className="text-base">Links & Files</CardTitle></CardHeader><CardContent className="space-y-4">
            <div><Label className="flex items-center gap-1.5"><ExternalLink className="w-3.5 h-3.5" /> Demo URL</Label><Input value={form.demo_url} onChange={e => setForm(f => ({ ...f, demo_url: e.target.value }))} placeholder="https://your-demo.com" className="mt-1.5" /></div>
            <div><Label className="flex items-center gap-1.5"><Github className="w-3.5 h-3.5" /> GitHub</Label><Input value={form.github_url} onChange={e => setForm(f => ({ ...f, github_url: e.target.value }))} placeholder="https://github.com/..." className="mt-1.5" /></div>
            <div><Label className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Pitch Deck</Label><Input value={form.pitch_deck_url} onChange={e => setForm(f => ({ ...f, pitch_deck_url: e.target.value }))} placeholder="https://drive.google.com/..." className="mt-1.5" /></div>
            <div><Label className="flex items-center gap-1.5"><Film className="w-3.5 h-3.5" /> Demo Video</Label><Input value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} placeholder="https://youtube.com/..." className="mt-1.5" /></div>
          </CardContent></Card>
          <div className="flex items-center gap-3 justify-end">
            <Button variant="outline" className="rounded-full gap-2" onClick={() => { setSaving(true); setTimeout(() => { if (existing) { submissions[submissions.findIndex(s => s.id === existing.id)] = { ...existing, ...form, is_draft: true, status: "draft" } } else { submissions.push({ id: generateId(), hackathon_id: hackathon.id, team_id: team.id, team_name: team.name, track: team.track, ...form, is_draft: true, status: "draft", scores: [], average_score: 0 }) }; setSaving(false); nav("/participant") }, 300) }}><Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Draft"}</Button>
            <Button className="rounded-full gap-2" onClick={() => { if (!form.project_title.trim() || !form.description.trim()) return; setSubmitting(true); setTimeout(() => { if (existing) { submissions[submissions.findIndex(s => s.id === existing.id)] = { ...existing, ...form, is_draft: false, status: "submitted" } } else { submissions.push({ id: generateId(), hackathon_id: hackathon.id, team_id: team.id, team_name: team.name, track: team.track, ...form, is_draft: false, status: "submitted", scores: [], average_score: 0 }) }; setSubmitting(false); nav("/participant") }, 300) }}><Send className="w-4 h-4" /> {submitting ? "Submitting..." : "Submit Project"}</Button>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
