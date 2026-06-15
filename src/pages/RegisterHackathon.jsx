import { Fragment, useState } from "react"
import { Link } from "react-router-dom"
import PageShell from "@/components/shared/PageShell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Check, ArrowRight, ArrowLeft, Copy, Share2, User, Users, Code2, Eye } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { hackathons, registrations, generateId } from "@/lib/mockData"

const steps = ["Personal Info", "Team Setup", "Track Selection", "Review & Submit"]

export default function RegisterHackathon() {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [regId, setRegId] = useState("")
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({ participant_name: "", email: "", organization: "", role_title: "", team_action: "create", team_name: "", invite_code: "", track: "" })

  const active = hackathons.find(h => h.status === "active") || hackathons[0]

  const update = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: undefined })) }

  const validate = () => {
    const e = {}
    if (step === 0) {
      if (!form.participant_name.trim()) e.participant_name = "Name required"
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required"
      else if (registrations.some(r => r.email === form.email)) e.email = "Already registered"
      if (!form.organization.trim()) e.organization = "Organization required"
      if (!form.role_title.trim()) e.role_title = "Role required"
    } else if (step === 1) {
      if (form.team_action === "create" && !form.team_name.trim()) e.team_name = "Team name required"
      if (form.team_action === "join" && !form.invite_code.trim()) e.invite_code = "Invite code required"
    } else if (step === 2) { if (!form.track) e.track = "Select a track" }
    setErrors(e); return Object.keys(e).length === 0
  }

  const submit = () => {
    const id = "BX-" + generateId().padStart(6, "0")
    registrations.push({ id: generateId(), hackathon_id: active.id, ...form, registration_id: id, status: "confirmed", team_name: form.team_name || form.participant_name })
    setRegId(id); setDone(true)
  }

  if (done) return (
    <PageShell>
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}><div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6"><Check className="w-10 h-10 text-emerald-400" /></div></motion.div>
        <h1 className="font-heading text-3xl font-bold mb-3">You're In!</h1>
        <p className="text-muted-foreground mb-8">Welcome to {active?.title}. Registration confirmed.</p>
        <div className="p-4 rounded-xl bg-card border border-border mb-6"><p className="text-xs text-muted-foreground mb-1">Registration ID</p><div className="flex items-center justify-center gap-3"><span className="font-mono text-2xl font-bold">{regId}</span><Button variant="ghost" size="icon" onClick={() => { navigator.clipboard.writeText(regId) }}><Copy className="w-4 h-4" /></Button></div></div>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" className="rounded-full gap-2"><Share2 className="w-4 h-4" /> Share</Button>
          <Link to="/participant"><Button className="rounded-full gap-2">Go to Dashboard <ArrowRight className="w-4 h-4" /></Button></Link>
        </div>
      </div>
    </PageShell>
  )

  const stepIcons = [User, Users, Code2, Eye]
  const FieldError = ({ f }) => errors[f] ? <p className="text-xs text-destructive mt-1">{errors[f]}</p> : null

  return (
    <PageShell>
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-2">Register for Hackathon</h1>
        <p className="text-muted-foreground mb-8">{active?.title}</p>
        <div className="flex items-center gap-2 mb-10">
          {steps.map((s, i) => {
            const I = stepIcons[i]
            return (
              <Fragment key={s}>
                <div className={`flex items-center gap-2 ${i <= step ? "text-primary" : "text-muted-foreground"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-colors ${i < step ? "bg-primary text-primary-foreground border-primary" : i === step ? "border-primary text-primary" : "border-border"}`}>
                    {i < step ? <Check className="w-4 h-4" /> : <I className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-xs font-medium hidden sm:inline">{s}</span>
                </div>
                {i < steps.length - 1 && <div className={`flex-1 h-px ${i < step ? "bg-primary" : "bg-border"}`} />}
              </Fragment>
            )
          })}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <Card className="border-border shadow-sm">
              <CardContent className="p-6 sm:p-8 space-y-5">
                {step === 0 && (<>
                  <div><Label htmlFor="name">Full Name *</Label><Input id="name" value={form.participant_name} onChange={e => update("participant_name", e.target.value)} placeholder="John Doe" className="mt-1.5" /><FieldError f="participant_name" /></div>
                  <div><Label htmlFor="email">Email *</Label><Input id="email" type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="john@example.com" className="mt-1.5" /><FieldError f="email" /></div>
                  <div><Label htmlFor="org">Organization *</Label><Input id="org" value={form.organization} onChange={e => update("organization", e.target.value)} placeholder="MIT" className="mt-1.5" /><FieldError f="organization" /></div>
                  <div><Label htmlFor="role">Your Role *</Label><Input id="role" value={form.role_title} onChange={e => update("role_title", e.target.value)} placeholder="Frontend Developer" className="mt-1.5" /><FieldError f="role_title" /></div>
                </>)}
                {step === 1 && (<>
                  <RadioGroup value={form.team_action} onValueChange={v => update("team_action", v)}>
                    <div className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer ${form.team_action === "create" ? "border-primary bg-primary/5" : "border-border"}`}><RadioGroupItem value="create" id="create" /><Label htmlFor="create" className="cursor-pointer flex-1"><span className="font-semibold">Create a New Team</span><p className="text-xs text-muted-foreground mt-0.5">Start a team and invite others</p></Label></div>
                    <div className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer ${form.team_action === "join" ? "border-primary bg-primary/5" : "border-border"}`}><RadioGroupItem value="join" id="join" /><Label htmlFor="join" className="cursor-pointer flex-1"><span className="font-semibold">Join Existing Team</span><p className="text-xs text-muted-foreground mt-0.5">Enter invite code from team lead</p></Label></div>
                  </RadioGroup>
                  {form.team_action === "create" && <div><Label htmlFor="tn">Team Name *</Label><Input id="tn" value={form.team_name} onChange={e => update("team_name", e.target.value)} placeholder="ChainBreakers" className="mt-1.5" /><FieldError f="team_name" /></div>}
                  {form.team_action === "join" && <div><Label htmlFor="ic">Invite Code *</Label><Input id="ic" value={form.invite_code} onChange={e => update("invite_code", e.target.value)} placeholder="CB-2025-X7K" className="mt-1.5 font-mono" /><FieldError f="invite_code" /></div>}
                </>)}
                {step === 2 && (<>
                  <Label>Select a Track *</Label>
                  <div className="space-y-3 mt-2">{(active?.tracks || []).map(t => <div key={t.name} onClick={() => update("track", t.name)} className={`p-4 rounded-xl border cursor-pointer transition-all ${form.track === t.name ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/20"}`}><div className="flex justify-between"><div><p className="font-semibold text-sm">{t.name}</p><p className="text-xs text-muted-foreground mt-0.5">{t.description}</p></div><span className="text-xs font-mono font-bold text-primary">{t.prize}</span></div></div>)}</div>
                  <FieldError f="track" />
                </>)}
                {step === 3 && (<div className="space-y-4">
                  <h3 className="font-semibold text-lg">Review Your Registration</h3>
                  {[{ l: "Name", v: form.participant_name }, { l: "Email", v: form.email }, { l: "Org", v: form.organization }, { l: "Role", v: form.role_title }, { l: "Team", v: form.team_action === "create" ? `Create: ${form.team_name}` : `Join: ${form.invite_code}` }, { l: "Track", v: form.track }].map(({ l, v }) => <div key={l} className="flex justify-between py-2 border-b border-border last:border-0"><span className="text-sm text-muted-foreground">{l}</span><span className="text-sm font-medium">{v}</span></div>)}
                </div>)}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="rounded-full gap-2"><ArrowLeft className="w-4 h-4" /> Back</Button>
          {step < 3 ? <Button onClick={() => validate() && setStep(s => s + 1)} className="rounded-full gap-2">Next <ArrowRight className="w-4 h-4" /></Button> : <Button onClick={submit} className="rounded-full gap-2">Confirm Registration <Check className="w-4 h-4" /></Button>}
        </div>
      </div>
    </PageShell>
  )
}
