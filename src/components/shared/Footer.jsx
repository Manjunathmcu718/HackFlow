import { Link } from "react-router-dom"
import { Zap, Github, Twitter, Linkedin, Mail } from "lucide-react"

const socials = [{ icon: Github, href: "#" }, { icon: Twitter, href: "#" }, { icon: Linkedin, href: "#" }, { icon: Mail, href: "mailto:hello@beetlex.dev" }]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3"><div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center"><Zap className="w-3.5 h-3.5 text-primary-foreground" /></div><span className="font-heading font-bold">BeetleX</span></Link>
            <p className="text-sm text-muted-foreground">Empowering the next generation of Web3 and AI builders through world-class hackathons.</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link to="/hackathons" className="block hover:text-foreground">Hackathons</Link>
              <Link to="/leaderboard" className="block hover:text-foreground">Leaderboard</Link>
              <Link to="/participant" className="block hover:text-foreground">Dashboard</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Connect</h4>
            <div className="flex gap-3">{socials.map(({ icon: I, href }) => <a key={href} href={href} className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors"><I className="w-4 h-4" /></a>)}</div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">&copy; {new Date().getFullYear()} BeetleX. All rights reserved.</div>
      </div>
    </footer>
  )
}
