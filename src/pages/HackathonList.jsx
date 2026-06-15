import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import PageShell from "@/components/shared/PageShell"
import StatusBadge from "@/components/shared/StatusBadge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Calendar, Users, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { hackathons } from "@/lib/mockData"

export default function HackathonList() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const perPage = 6

  const filtered = useMemo(() => hackathons.filter(h => {
    const ms = h.title?.toLowerCase().includes(search.toLowerCase()) || h.tagline?.toLowerCase().includes(search.toLowerCase())
    const mst = statusFilter === "all" || h.status === statusFilter
    return ms && mst
  }), [search, statusFilter])

  const paged = filtered.slice(0, page * perPage)
  const hasMore = paged.length < filtered.length

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="mb-10">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-3">Hackathons</h1>
          <p className="text-muted-foreground text-lg">Discover and join hackathons around the world</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search hackathons..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {filtered.length === 0 ? <div className="text-center py-20"><p className="text-muted-foreground">No hackathons found.</p></div> : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paged.map((h, i) => (
                <motion.div key={h.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/hackathon/${h.id}`} className="block group">
                    <div className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                      <div className="h-40 bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                        <div className="absolute top-3 left-3"><StatusBadge status={h.status} /></div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors line-clamp-1">{h.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{h.tagline}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{h.start_date ? format(new Date(h.start_date), "MMM d") : "TBD"} - {h.end_date ? format(new Date(h.end_date), "MMM d, yyyy") : "TBD"}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{h.participant_count?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            {hasMore && <div className="flex justify-center mt-10"><Button variant="outline" className="rounded-full px-8" onClick={() => setPage(p => p + 1)}>Load More <ArrowRight className="w-4 h-4 ml-2" /></Button></div>}
          </>
        )}
      </div>
    </PageShell>
  )
}
