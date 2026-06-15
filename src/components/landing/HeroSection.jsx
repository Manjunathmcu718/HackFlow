import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Trophy, Code2, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import CountdownTimer from "@/components/shared/CountdownTimer"

export default function HeroSection({ hackathon }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"><Sparkles className="w-3.5 h-3.5" /><span>Registration Open - {hackathon?.participant_count?.toLocaleString()} builders joined</span></div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">{hackathon?.title}</h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">{hackathon?.tagline}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/register-hackathon"><Button size="lg" className="rounded-full px-8 text-base font-semibold gap-2 h-12">Register Now <ArrowRight className="w-4 h-4" /></Button></Link>
            <Link to="/hackathons"><Button variant="outline" size="lg" className="rounded-full px-8 text-base font-semibold h-12">Browse Events</Button></Link>
          </div>
          <div className="flex justify-center mb-12"><CountdownTimer targetDate={hackathon?.submission_deadline} label="Submission Deadline" /></div>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            {[{ icon: Users, label: `${hackathon?.participant_count?.toLocaleString()} Participants` }, { icon: Trophy, label: "$25,000+ in Prizes" }, { icon: Code2, label: `${hackathon?.tracks?.length || 4} Tracks` }].map(({ icon: I, label }) => <div key={label} className="flex items-center gap-2"><I className="w-4 h-4 text-primary" /><span>{label}</span></div>)}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
