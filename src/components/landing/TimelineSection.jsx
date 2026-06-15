import { motion } from "framer-motion"
import { CalendarDays, UserPlus, Code2, Gavel, Trophy } from "lucide-react"
import { format } from "date-fns"

const defaultTimeline = [
  { icon: UserPlus, label: "Registration Opens", date: "2025-06-15", desc: "Sign up and form your team" },
  { icon: CalendarDays, label: "Hackathon Starts", date: "2025-07-01", desc: "Kick off building your project" },
  { icon: Code2, label: "Submission Deadline", date: "2025-07-14", desc: "Submit your final project" },
  { icon: Gavel, label: "Judging Period", date: "2025-07-15", desc: "Judges review all submissions" },
  { icon: Trophy, label: "Results Announced", date: "2025-07-16", desc: "Winners revealed live" },
]

export default function TimelineSection({ hackathon }) {
  const timeline = hackathon ? [
    { icon: UserPlus, label: "Registration Opens", date: hackathon.start_date, desc: "Sign up and form your team" },
    { icon: CalendarDays, label: "Hackathon Starts", date: hackathon.start_date, desc: "Kick off building" },
    { icon: Code2, label: "Submission Deadline", date: hackathon.submission_deadline?.split("T")[0], desc: "Submit your project" },
    { icon: Gavel, label: "Judging", date: hackathon.judging_date, desc: "Judges review submissions" },
    { icon: Trophy, label: "Results", date: hackathon.results_date, desc: "Winners announced" },
  ] : defaultTimeline
  return (
    <section className="py-20 sm:py-28 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-4">Event Timeline</h2>
          <p className="text-muted-foreground text-lg">Key dates you need to know</p>
        </motion.div>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden sm:block" />
          <div className="space-y-8">
            {timeline.map(({ icon: I, label, date, desc }, i) => (
              <motion.div key={label} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-start gap-4 sm:gap-6">
                <div className="relative z-10 w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center shrink-0 shadow-sm"><I className="w-5 h-5 text-primary" /></div>
                <div className="flex-1 pb-2">
                  <p className="text-xs text-primary font-mono font-medium mb-1">{date ? format(new Date(date), "MMM d, yyyy") : "TBD"}</p>
                  <h3 className="font-semibold text-base mb-0.5">{label}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
