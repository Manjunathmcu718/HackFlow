import { motion } from "framer-motion"

export default function SponsorsSection({ sponsors = [] }) {
  const tierColors = { platinum: "text-lg", gold: "text-base", silver: "text-sm" }
  const groups = { platinum: sponsors.filter(s => s.tier === "platinum"), gold: sponsors.filter(s => s.tier === "gold"), silver: sponsors.filter(s => s.tier === "silver") }
  return (
    <section className="py-20 sm:py-28 bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-4">Our Sponsors</h2>
          <p className="text-muted-foreground text-lg">Backed by leaders in the ecosystem</p>
        </motion.div>
        {Object.entries(groups).map(([tier, items]) => items.length > 0 && (
          <div key={tier} className="mb-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-4">{tier} Partners</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {items.map(s => <div key={s.name} className={`px-6 py-3 rounded-xl border bg-card font-semibold transition-colors hover:border-primary/30 ${tierColors[tier]}`}>{s.name}</div>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
