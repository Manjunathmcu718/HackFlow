import { useParams, Link } from "react-router-dom"
import PageShell from "@/components/shared/PageShell"
import StatusBadge from "@/components/shared/StatusBadge"
import CountdownTimer from "@/components/shared/CountdownTimer"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Users, Trophy, Clock, Code2, ArrowRight, BookOpen, Shield } from "lucide-react"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { hackathons } from "@/lib/mockData"

export default function HackathonDetail() {
  const { id } = useParams()
  const hackathon = hackathons.find(h => h.id === id)
  if (!hackathon) return <PageShell><div className="text-center py-32"><p className="text-muted-foreground">Hackathon not found.</p></div></PageShell>

  return (
    <PageShell>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-xl border-t border-border p-4 md:hidden">
        <Link to="/register-hackathon" className="block"><Button className="w-full rounded-full font-semibold h-12">Register Now <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 pb-24 md:pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4"><StatusBadge status={hackathon.status} /><span className="text-sm text-muted-foreground">{hackathon.start_date && format(new Date(hackathon.start_date), "MMM d")} - {hackathon.end_date && format(new Date(hackathon.end_date), "MMM d, yyyy")}</span></div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">{hackathon.title}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-8">{hackathon.tagline}</p>
          <div className="flex flex-wrap items-center gap-6 mb-10">
            <div className="flex items-center gap-2 text-sm"><Users className="w-4 h-4 text-primary" /><span className="font-semibold">{hackathon.participant_count?.toLocaleString()}</span><span className="text-muted-foreground">participants</span></div>
            <div className="flex items-center gap-2 text-sm"><Trophy className="w-4 h-4 text-primary" /><span className="font-semibold">{hackathon.team_count}</span><span className="text-muted-foreground">teams</span></div>
            <div className="flex items-center gap-2 text-sm"><Code2 className="w-4 h-4 text-primary" /><span className="font-semibold">{hackathon.tracks?.length}</span><span className="text-muted-foreground">tracks</span></div>
            <div className="hidden md:block ml-auto"><Link to="/register-hackathon"><Button className="rounded-full px-8 font-semibold gap-2">Register Now <ArrowRight className="w-4 h-4" /></Button></Link></div>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border mb-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <CountdownTimer targetDate={hackathon.submission_deadline} label="Submission Deadline" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="w-4 h-4" /><span>Teams: {hackathon.min_team_size}-{hackathon.max_team_size} members</span></div>
          </div>
          <div className="prose prose-sm max-w-none mb-10">
            <div className="flex items-center gap-2 mb-3"><BookOpen className="w-5 h-5 text-primary" /><h2 className="font-heading text-xl font-bold m-0">About This Hackathon</h2></div>
            <p className="text-muted-foreground leading-relaxed">{hackathon.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {hackathon.rules && <div className="p-5 rounded-xl bg-card border border-border"><div className="flex items-center gap-2 mb-3"><Shield className="w-4 h-4 text-primary" /><h3 className="font-semibold text-sm">Rules</h3></div><p className="text-sm text-muted-foreground">{hackathon.rules}</p></div>}
            {hackathon.eligibility && <div className="p-5 rounded-xl bg-card border border-border"><div className="flex items-center gap-2 mb-3"><Users className="w-4 h-4 text-primary" /><h3 className="font-semibold text-sm">Eligibility</h3></div><p className="text-sm text-muted-foreground">{hackathon.eligibility}</p></div>}
          </div>
          {hackathon.tracks?.length > 0 && (
            <div className="mb-10">
              <h2 className="font-heading text-xl font-bold mb-4">Technology Tracks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hackathon.tracks.map(t => (
                  <div key={t.name} className="p-5 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors">
                    <div className="flex justify-between items-start mb-2"><h3 className="font-semibold">{t.name}</h3><span className="text-sm font-mono font-bold text-primary">{t.prize}</span></div>
                    <p className="text-sm text-muted-foreground">{t.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {hackathon.prizes?.length > 0 && (
            <div className="mb-10">
              <h2 className="font-heading text-xl font-bold mb-4">Prizes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {hackathon.prizes.map((p, i) => (
                  <div key={i} className={`p-5 rounded-xl border ${i === 0 ? "bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20" : "bg-card border-border"}`}>
                    <p className="text-2xl font-bold mb-1">{p.amount}</p>
                    <p className="text-sm font-semibold mb-1">{p.place}</p>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {hackathon.faqs?.length > 0 && (
            <div>
              <h2 className="font-heading text-xl font-bold mb-4">FAQ</h2>
              <Accordion type="single" collapsible>
                {hackathon.faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}><AccordionTrigger>{faq.question}</AccordionTrigger><AccordionContent>{faq.answer}</AccordionContent></AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </motion.div>
      </div>
    </PageShell>
  )
}
