import { Badge } from "@/components/ui/badge"

const styles = {
  upcoming: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  closed: "bg-muted text-muted-foreground border-border",
  submitted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  in_progress: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  not_started: "bg-muted text-muted-foreground border-border",
  draft: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  scored: "bg-primary/10 text-primary border-primary/20",
  unscored: "bg-muted text-muted-foreground border-border",
  urgent: "bg-destructive/10 text-destructive border-destructive/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
}

const labels = { upcoming: "Upcoming", active: "Active", closed: "Closed", submitted: "Submitted", in_progress: "In Progress", not_started: "Not Started", draft: "Draft", confirmed: "Confirmed", pending: "Pending", scored: "Scored", unscored: "Unscored", urgent: "Urgent", warning: "Warning", info: "Info" }

export default function StatusBadge({ status }) {
  return <Badge variant="outline" className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 ${styles[status] || styles.pending}`}>{labels[status] || status}</Badge>
}
