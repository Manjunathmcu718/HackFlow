import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Menu, Zap } from "lucide-react"

const links = [
  { label: "Hackathons", path: "/hackathons" },
  { label: "Leaderboard", path: "/leaderboard" },
  { label: "Dashboard", path: "/participant" },
  { label: "Judge Panel", path: "/judge" },
  { label: "Organizer", path: "/organizer" },
]

export default function Navbar() {
  const loc = useLocation()
  const [open, setOpen] = useState(false)
  const active = (p) => loc.pathname.startsWith(p)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"><Zap className="w-4 h-4 text-primary-foreground" /></div>
          <span className="font-heading font-bold text-lg tracking-tight">BeetleX</span>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => <Link key={l.path} to={l.path} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active(l.path) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>{l.label}</Link>)}
        </div>
        <div className="hidden md:block"><Link to="/register-hackathon"><Button size="sm" className="rounded-full px-5 font-semibold">Register Now</Button></Link></div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden"><Button variant="ghost" size="icon"><Menu className="w-5 h-5" /></Button></SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-2 mt-8">
              {links.map(l => <Link key={l.path} to={l.path} onClick={() => setOpen(false)} className={`px-4 py-3 rounded-lg text-sm font-medium ${active(l.path) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>{l.label}</Link>)}
              <Link to="/register-hackathon" onClick={() => setOpen(false)}><Button className="w-full mt-4 rounded-full font-semibold">Register Now</Button></Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
