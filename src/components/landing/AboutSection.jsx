import { Globe, Lightbulb, Users, Rocket } from "lucide-react"
import { motion } from "framer-motion"

const items = [
  { icon: Globe, title: "Global Community", desc: "Connect with developers from 80+ countries building at the frontier of Web3 and AI." },
  { icon: Lightbulb, title: "Learn & Build", desc: "Access workshops, mentors, and resources for all skill levels." },
  { icon: Users, title: "Team Up", desc: "Find your dream team with our matching system." },
  { icon: Rocket, title: "Ship & Launch", desc: "Turn your project into a real product with accelerator programs and funding." },
]

export default function AboutSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-4">Why BeetleX?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">We're not just another hackathon. We're a launchpad for the next generation of builders.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(({ icon: I, title, desc }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"><I className="w-5 h-5 text-primary" /></div>
              <h3 className="font-semibold text-base mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
