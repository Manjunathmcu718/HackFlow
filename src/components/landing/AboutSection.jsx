import React from "react";
import { Globe, Lightbulb, Users, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
  { icon: Globe,     title: "Global Community",  desc: "Connect with developers from 80+ countries building at the frontier of Web3 and AI.", iconBg: "linear-gradient(135deg,#3B82F6,#06B6D4)", accent: "#3B82F6", tag: "Global",    num: "01" },
  { icon: Lightbulb, title: "Learn & Build",      desc: "Access workshops, mentors, and resources. Whether beginner or expert, there is something for you.", iconBg: "linear-gradient(135deg,#F59E0B,#F97316)", accent: "#F59E0B", tag: "Education", num: "02" },
  { icon: Users,     title: "Team Up",            desc: "Find your dream team with our smart matching. Solo builders are always welcome.",        iconBg: "linear-gradient(135deg,#F4622A,#FB923C)", accent: "#F4622A", tag: "Community", num: "03" },
  { icon: Rocket,    title: "Ship & Launch",      desc: "Turn your hackathon project into a real product. Get access to accelerator programs.",    iconBg: "linear-gradient(135deg,#7C4DFF,#A855F7)", accent: "#7C4DFF", tag: "Launch",    num: "04" },
];

export default function AboutSection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden" style={{ background: "#fff" }}>
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 mb-16">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="text-[10px] font-bold mb-5 tracking-widest uppercase pill-coral px-3 py-1.5 w-fit">WHY BEETLEX</div>
            <h2 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight" style={{ color: "#1A1F3C" }}>
              Not just another<br /><span className="text-shimmer">hackathon platform.</span>
            </h2>
          </motion.div>
          <motion.p initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: .15 }}
            className="text-lg max-w-sm leading-relaxed" style={{ color: "rgba(26,31,60,.55)" }}>
            A launchpad for the next generation of developers building at the intersection of Web3 and AI.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: .6 }}
              whileHover={{ y: -8 }}
              className="card-light rounded-3xl p-7 relative overflow-hidden cursor-default">
              <div className="absolute -top-3 -right-3 font-heading font-extrabold text-8xl select-none leading-none pointer-events-none"
                style={{ color: f.accent, opacity: .05 }}>{f.num}</div>
              <div className="inline-flex text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-5"
                style={{ background: `${f.accent}18`, color: f.accent }}>{f.tag}</div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: f.iconBg, boxShadow: `0 8px 24px ${f.accent}33` }}>
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-heading font-bold text-base mb-2.5" style={{ color: "#1A1F3C" }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(26,31,60,.55)" }}>{f.desc}</p>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-3xl" style={{ background: f.iconBg }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

