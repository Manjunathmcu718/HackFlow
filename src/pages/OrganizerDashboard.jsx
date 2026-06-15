import { useState, useMemo } from "react"
import PageShell from "@/components/shared/PageShell"
import StatusBadge from "@/components/shared/StatusBadge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileText, Gavel, Trophy, Megaphone, Send, Search, Download, Eye, EyeOff, BarChart3 } from "lucide-react"
import { format } from "date-fns"
import { hackathons, registrations, submissions, announcements, generateId } from "@/lib/mockData"

export default function OrganizerDashboard() {
  const [searchReg, setSearchReg] = useState("")
  const [searchSub, setSearchSub] = useState("")
  const [showAnnounce, setShowAnnounce] = useState(false)
  const [ann, setAnn] = useState({ title: "", message: "", priority: "info" })
  const [hacks, setHacks] = useState(hackathons)

  const hackathon = hacks.find(h => h.status === "active") || hacks[0]
  const filteredRegs = registrations.filter(r => r.participant_name?.toLowerCase().includes(searchReg.toLowerCase()) || r.email?.toLowerCase().includes(searchReg.toLowerCase()))
  const filteredSubs = submissions.filter(s => s.project_title?.toLowerCase().includes(searchSub.toLowerCase()) || s.team_name?.toLowerCase().includes(searchSub.toLowerCase()))

  const stats = [
    { l: "Registrations", v: registrations.length, i: Users, c: "text-blue-400 bg-blue-500/10" },
    { l: "Teams", v: new Set(submissions.map(s => s.team_id)).size, i: Users, c: "text-emerald-400 bg-emerald-500/10" },
    { l: "Submissions", v: submissions.filter(s => s.status === "submitted").length, i: FileText, c: "text-amber-400 bg-amber-500/10" },
    { l: "Scored", v: submissions.filter(s => s.scores?.length > 0).length, i: Gavel, c: "text-purple-400 bg-purple-500/10" },
  ]

  const exportCSV = () => {
    const csv = "Name,Email,Organization,Role,Track,Status\n" + registrations.map(r => `"${r.participant_name}","${r.email}","${r.organization}","${r.role_title}","${r.track}","${r.status}"`).join("\n")
    const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "registrations.csv"; a.click()
  }

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4"><div><h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-1 flex items-center gap-2"><BarChart3 className="w-6 h-6 text-primary" /> Organizer Dashboard</h1><p className="text-muted-foreground">{hackathon?.title}</p></div><Button onClick={() => setShowAnnounce(true)} className="rounded-full gap-2"><Megaphone className="w-4 h-4" /> Broadcast</Button></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">{stats.map(s => { const I = s.i; return (<Card key={s.l}><CardContent className="p-5"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.c}`}><I className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{s.v}</p><p className="text-xs text-muted-foreground">{s.l}</p></div></div></CardContent></Card>)})}</div>
        <Tabs defaultValue="registrations">
          <TabsList className="mb-6 flex-wrap h-auto gap-1"><TabsTrigger value="registrations">Registrations</TabsTrigger><TabsTrigger value="submissions">Submissions</TabsTrigger><TabsTrigger value="leaderboard">Leaderboard</TabsTrigger><TabsTrigger value="announcements">Announcements</TabsTrigger></TabsList>
          <TabsContent value="registrations">
            <Card><CardHeader className="pb-3"><div className="flex items-center justify-between flex-wrap gap-3"><CardTitle className="text-base">Participants ({registrations.length})</CardTitle><div className="flex gap-2"><div className="relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search..." value={searchReg} onChange={e => setSearchReg(e.target.value)} className="pl-9" /></div><Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5"><Download className="w-3.5 h-3.5" /> Export</Button></div></div></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Organization</TableHead><TableHead>Track</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{filteredRegs.map(r => <TableRow key={r.id}><TableCell className="font-medium">{r.participant_name}</TableCell><TableCell className="text-muted-foreground">{r.email}</TableCell><TableCell>{r.organization}</TableCell><TableCell>{r.track}</TableCell><TableCell><StatusBadge status={r.status} /></TableCell></TableRow>)}</TableBody></Table></div></CardContent></Card>
          </TabsContent>
          <TabsContent value="submissions">
            <Card><CardHeader className="pb-3"><div className="flex items-center justify-between flex-wrap gap-3"><CardTitle className="text-base">All Submissions ({submissions.length})</CardTitle><div className="relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search..." value={searchSub} onChange={e => setSearchSub(e.target.value)} className="pl-9" /></div></div></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Project</TableHead><TableHead>Team</TableHead><TableHead>Track</TableHead><TableHead>Status</TableHead><TableHead>Score</TableHead></TableRow></TableHeader><TableBody>{filteredSubs.map(s => <TableRow key={s.id}><TableCell className="font-medium">{s.project_title}</TableCell><TableCell>{s.team_name}</TableCell><TableCell>{s.track}</TableCell><TableCell><StatusBadge status={s.status} /></TableCell><TableCell>{s.average_score > 0 ? <span className="font-mono font-semibold">{s.average_score}/40</span> : <span className="text-muted-foreground text-xs">-</span>}</TableCell></TableRow>)}</TableBody></Table></div></CardContent></Card>
          </TabsContent>
          <TabsContent value="leaderboard">
            <Card><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-base flex items-center gap-2"><Trophy className="w-4 h-4 text-primary" /> Leaderboard</CardTitle><Button variant={hackathon?.leaderboard_published ? "destructive" : "default"} size="sm" onClick={() => { const i = hacks.findIndex(h => h.id === hackathon.id); const updated = [...hacks]; updated[i] = { ...updated[i], leaderboard_published: !hackathon.leaderboard_published }; setHacks(updated) }} className="gap-2 rounded-full">{hackathon?.leaderboard_published ? <><EyeOff className="w-4 h-4" /> Unpublish</> : <><Eye className="w-4 h-4" /> Publish</>}</Button></div></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead className="w-12">#</TableHead><TableHead>Team</TableHead><TableHead>Project</TableHead><TableHead>Track</TableHead><TableHead>Avg Score</TableHead><TableHead>Reviews</TableHead></TableRow></TableHeader><TableBody>{submissions.filter(s => s.status === "submitted").sort((a, b) => (b.average_score || 0) - (a.average_score || 0)).map((s, i) => <TableRow key={s.id}><TableCell className="font-mono font-bold">{i + 1}</TableCell><TableCell className="font-medium">{s.team_name}</TableCell><TableCell>{s.project_title}</TableCell><TableCell><Badge variant="secondary" className="text-xs">{s.track}</Badge></TableCell><TableCell className="font-mono font-semibold">{s.average_score || "-"}</TableCell><TableCell>{s.scores?.length || 0}</TableCell></TableRow>)}</TableBody></Table></div></CardContent></Card>
          </TabsContent>
          <TabsContent value="announcements">
            <Card><CardHeader className="pb-3"><div className="flex items-center justify-between"><CardTitle className="text-base">Announcements ({announcements.length})</CardTitle><Button size="sm" onClick={() => setShowAnnounce(true)} className="gap-1.5 rounded-full"><Megaphone className="w-3.5 h-3.5" /> New</Button></div></CardHeader><CardContent><div className="space-y-3">{announcements.map(a => <div key={a.id} className="p-4 rounded-xl border border-border"><div className="flex items-center gap-2 mb-1"><h4 className="font-semibold text-sm">{a.title}</h4><StatusBadge status={a.priority} /></div><p className="text-sm text-muted-foreground">{a.message}</p><p className="text-xs text-muted-foreground mt-2">{a.created_date ? format(new Date(a.created_date), "MMM d, h:mm a") : ""}</p></div>)}</div></CardContent></Card>
          </TabsContent>
        </Tabs>
        <Dialog open={showAnnounce} onOpenChange={setShowAnnounce}><DialogContent><DialogHeader><DialogTitle>Broadcast Announcement</DialogTitle></DialogHeader><div className="space-y-4"><div><Label>Title</Label><Input value={ann.title} onChange={e => setAnn(a => ({ ...a, title: e.target.value }))} placeholder="Important Update" className="mt-1.5" /></div><div><Label>Message</Label><Textarea value={ann.message} onChange={e => setAnn(a => ({ ...a, message: e.target.value }))} placeholder="Write announcement..." className="mt-1.5" /></div><div><Label>Priority</Label><Select value={ann.priority} onValueChange={v => setAnn(a => ({ ...a, priority: v }))}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="info">Info</SelectItem><SelectItem value="warning">Warning</SelectItem><SelectItem value="urgent">Urgent</SelectItem></SelectContent></Select></div></div><DialogFooter><Button variant="outline" onClick={() => setShowAnnounce(false)}>Cancel</Button><Button onClick={() => { announcements.unshift({ id: generateId(), hackathon_id: hackathon.id, ...ann, author: "Organizer", created_date: new Date().toISOString() }); setAnn({ title: "", message: "", priority: "info" }); setShowAnnounce(false) }} disabled={!ann.title.trim()} className="gap-2"><Send className="w-4 h-4" /> Send</Button></DialogFooter></DialogContent></Dialog>
      </div>
    </PageShell>
  )
}
