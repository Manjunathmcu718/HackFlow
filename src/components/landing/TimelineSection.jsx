import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, UserPlus, Code2, Gavel, Trophy, ChevronRight } from "lucide-react";
import { format } from "date-fns";

const defaultTimeline = [
  { icon:UserPlus,    label:"Registration Opens",  date:"2025-06-15", desc:"Sign up and form your team",                accent:"#3B82F6", bg:"rgba(59,130,246,.1)",  border:"rgba(59,130,246,.2)" },
  { icon:CalendarDays,label:"Hackathon Starts",     date:"2025-07-01", desc:"Kick off and start building",              accent:"#10B981", bg:"rgba(16,185,129,.1)", border:"rgba(16,185,129,.2)" },
  { icon:Code2,       label:"Submission Deadline",  date:"2025-07-14", desc:"Submit your final project",               accent:"#F4622A", bg:"rgba(244,98,42,.1)",  border:"rgba(244,98,42,.2)" },
  { icon:Gavel,       label:"Judging Period",        date:"2025-07-15", desc:"Expert judges review all submissions",    accent:"#7C4DFF", bg:"rgba(124,77,255,.1)", border:"rgba(124,77,255,.2)" },
  { icon:Trophy,      label:"Results Announced",    date:"2025-07-16", desc:"Winners revealed at closing ceremony",    accent:"#F59E0B", bg:"rgba(245,158,11,.1)", border:"rgba(245,158,11,.2)" },
];

export default function TimelineSection({ hackathon }) {
  const timeline = hackathon ? [
    { icon:UserPlus,    label:"Registration Opens",  date:hackathon.start_date,                         desc:"Sign up and form your team",             accent:"#3B82F6", bg:"rgba(59,130,246,.1)",  border:"rgba(59,130,246,.2)" },
    { icon:CalendarDays,label:"Hackathon Starts",     date:hackathon.start_date,                         desc:"Kick off and start building",            accent:"#10B981", bg:"rgba(16,185,129,.1)", border:"rgba(16,185,129,.2)" },
    { icon:Code2,       label:"Submission Deadline",  date:hackathon.submission_deadline?.split("T")[0], desc:"Submit your project",                    accent:"#F4622A", bg:"rgba(244,98,42,.1)",  border:"rgba(244,98,42,.2)" },
    { icon:Gavel,       label:"Judging",              date:hackathon.judging_date,                       desc:"Expert judges review submissions",        accent:"#7C4DFF", bg:"rgba(124,77,255,.1)", border:"rgba(124,77,255,.2)" },
    { icon:Trophy,      label:"Results",              date:hackathon.results_date,                       desc:"Winners announced",                      accent:"#F59E0B", bg:"rgba(245,158,11,.1)", border:"rgba(245,158,11,.2)" },
  ] : defaultTimeline;

  return (
    <section className="relative py-24 sm:py-32 section-warm overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-4 pill-coral px-3 py-1.5">
            EVENT TIMELINE
          </motion.div>
          <motion.h2 initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:.1 }}
            className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight" style={{ color:"#1A1F3C" }}>
            Key <span className="text-grad-primary">Dates</span>
          </motion.h2>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-8 bottom-8 w-0.5 hidden sm:block rounded-full"
            style={{ background:"linear-gradient(180deg,#3B82F6,#F4622A,#7C4DFF,#F59E0B)" }} />
          <div className="space-y-5">
            {timeline.map((item, i) => (
              <motion.div key={item.label}
                initial={{ opacity:0, x:-24 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                transition={{ delay:i*.1, duration:.5, ease:[.22,1,.36,1] }}
                className="group flex items-start gap-5 sm:gap-7">
                <div className="relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300"
                  style={{ background:item.bg, border:`1.5px solid ${item.border}` }}>
                  <item.icon className="w-5 h-5" style={{ color:item.accent }} />
                </div>
                <motion.div whileHover={{ x:5 }} transition={{ duration:.2 }}
                  className="card-light flex-1 flex items-center justify-between p-5 rounded-2xl">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold" style={{ color:item.accent }}>
                        {item.date ? format(new Date(item.date), "MMM d, yyyy") : "TBD"}
                      </span>
                      {i === 2 && <span className="text-[10px] px-2 py-0.5 rounded-full pill-coral font-bold uppercase tracking-wider">Deadline</span>}
                    </div>
                    <h3 className="font-heading font-bold text-base" style={{ color:"#1A1F3C" }}>{item.label}</h3>
                    <p className="text-sm mt-0.5" style={{ color:"rgba(26,31,60,.5)" }}>{item.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0 ml-4" style={{ color:"rgba(26,31,60,.25)" }} />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

