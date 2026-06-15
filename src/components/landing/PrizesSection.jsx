import { motion } from "framer-motion"
import { Trophy, Award, Heart, Star } from "lucide-react"

const defaults = [
  { place: "Grand Prize", amount: "$10,000", description: "Best overall project across all tracks", icon: Trophy },
  { place: "1st Place per Track", amount: "$5,000", description: "Top project in each track", icon: Award },
  { place: "Best UI/UX", amount: "$2,500", description: "Most polished interface", icon: Star },
  { place: "Community Choice", amount: "$2,500", description: "Voted by participants", icon: Heart },
]

export default function PrizesSection({ hackathon }) {
  const prizes = hackathon?.prizes?.length > 0 ? hackathon.prizes.map((p, i) => ({ ...p, icon: [Trophy, Award, Star, Heart][i] })) : defaults
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-4">Prizes & Rewards</h2>
          <p className="text-muted-foreground text-lg">Over $25,000 in prizes across all tracks</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {prizes.map((p, i) => {
            const I = p.icon
            return (
              <motion.div key={p.place} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${i === 0 ? "bg-gradient-to-br from-primary/10 to-accent/5 border-primary/30" : "bg-card border-border hover:border-primary/20"}`}>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4"><I className="w-5 h-5 text-primary" /></div>
                <p className="text-2xl font-bold font-heading mb-1">{p.amount}</p>
                <p className="font-semibold text-sm mb-2">{p.place}</p>
                <p className="text-sm text-muted-foreground">{p.description}</p>
              </motion.div>
            )
          })}
        </div>
        {hackathon?.tracks?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16">
            <h3 className="font-heading text-2xl font-bold text-center mb-8">Technology Tracks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hackathon.tracks.map(t => (
                <div key={t.name} className="p-5 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors">
                  <div className="flex items-center justify-between mb-2"><h4 className="font-semibold">{t.name}</h4><span className="text-sm font-mono font-semibold text-primary">{t.prize}</span></div>
                  <p className="text-sm text-muted-foreground">{t.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
