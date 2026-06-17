import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Star, CheckCircle2 } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import CountdownTimer from "../shared/CountdownTimer";

function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) { setStarted(true); observer.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const num = parseFloat(String(target).replace(/[^0-9.]/g, ""));
    if (isNaN(num)) { setCount(target); return; }
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * num));
      if (p < 1) requestAnimationFrame(step);
      else setCount(num);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, ref };
}

function StatCard({ val, label, color, delay }) {
  const suffix = String(val).replace(/[0-9.,]/g, "");
  const { count, ref } = useCountUp(val);
  const num = parseFloat(String(val).replace(/[^0-9.]/g, ""));
  const display = isNaN(num) ? val : `${count.toLocaleString()}${suffix}`;
  return (
    <motion.div ref__={ref}
      initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay }}
      className="card-light rounded-2xl p-5 flex flex-col gap-2 cursor-default">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
        style={{ background: `${color}18` }}>
        <img src="https://media.base44.com/images/public/6a305537a00d359b98abca78/f738bf2e7_image.png"
          alt="" className="w-8 h-8 object-contain" />
      </div>
      <div className="font-heading font-extrabold text-2xl" style={{ color: "#1A1F3C" }}>{display}</div>
      <div className="text-xs font-semibold" style={{ color: "rgba(26,31,60,.45)" }}>{label}</div>
    </motion.div>
  );
}

function MagBtn({ children }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 22 });
  const sy = useSpring(y, { stiffness: 250, damping: 22 });
  return (
    <motion.div ref__={ref} style={{ x: sx, y: sy }}
      onMouseMove={e => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - r.left - r.width / 2) * 0.28);
        y.set((e.clientY - r.top - r.height / 2) * 0.28);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}>
      {children}
    </motion.div>
  );
}

const FEATURES = ["AI-powered team matching","Real-time leaderboard","24/7 mentor support","Instant prize payouts"];
const STATS    = [
  { val: "2,847+", label: "Builders",  color: "#F4622A" },
  { val: "$25K+",  label: "Prizes",    color: "#7C4DFF" },
  { val: "80+",    label: "Countries", color: "#06B6D4" },
  { val: "14",     label: "Days",      color: "#10B981" },
];

export default function HeroSection({ hackathon }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden hero-bg">
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />
      <div className="absolute top-24 right-12 w-72 h-72 rounded-full float pointer-events-none"
        style={{ background: "radial-gradient(ellipse,rgba(244,98,42,.18) 0%,transparent 70%)", filter: "blur(40px)" }} />
      <div className="absolute bottom-32 left-8 w-80 h-80 rounded-full float-delay-2 pointer-events-none"
        style={{ background: "radial-gradient(ellipse,rgba(124,77,255,.15) 0%,transparent 70%)", filter: "blur(50px)" }} />
      <div className="absolute top-16 right-24 pointer-events-none hidden lg:block">
        <div className="w-64 h-64 rounded-full spin-slow" style={{ border: "1.5px dashed rgba(244,98,42,.2)" }}>
          <div className="absolute top-2 left-1/2 w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{ background: "#F4622A", boxShadow: "0 0 12px 4px rgba(244,98,42,.5)" }} />
        </div>
        <div className="absolute inset-10 rounded-full spin-slow-reverse" style={{ border: "1px dashed rgba(124,77,255,.2)" }}>
          <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full"
            style={{ background: "#7C4DFF", boxShadow: "0 0 8px 3px rgba(124,77,255,.5)" }} />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 pill-coral text-sm font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F4622A] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F4622A]" />
              </span>
              <img src="https://media.base44.com/images/public/6a305537a00d359b98abca78/f738bf2e7_image.png"
                alt="" className="w-4 h-4 object-contain rounded-full" />
              Registration Open &middot; {hackathon?.participant_count?.toLocaleString() || "2,847"}+ builders
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .85, delay: .1, ease: [.22,1,.36,1] }}
              className="font-heading font-extrabold tracking-tight leading-[1.0] mb-6"
              style={{ fontSize: "clamp(3rem,6vw,5.2rem)", color: "#1A1F3C" }}>
              Build the{" "}
              <span style={{ background: "linear-gradient(120deg,#F4622A,#FB923C,#F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Future.
              </span>
              <br />
              <span style={{ background: "linear-gradient(120deg,#7C4DFF,#A855F7,#EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Win Big.
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3, duration: .7 }}
              className="text-lg leading-relaxed mb-8 max-w-lg" style={{ color: "rgba(26,31,60,.6)" }}>
              {hackathon?.tagline || "Build the decentralized future. Ship real products. Win big."}{" "}
              2 weeks &middot; $25K+ in prizes &middot; 80 countries.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .45 }}
              className="grid grid-cols-2 gap-3 mb-10">
              {FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2 text-sm font-medium" style={{ color: "rgba(26,31,60,.75)" }}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#F4622A" }} /> {f}
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .6 }}
              className="flex flex-wrap items-center gap-4">
              <MagBtn>
                <Link to="/register-hackathon">
                  <button className="btn-primary flex items-center gap-2.5 px-8 text-base" style={{ height: 56 }}>
                    <Zap className="w-4 h-4" fill="white" /> Register Now <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </MagBtn>
              <MagBtn>
                <Link to="/hackathons">
                  <button className="btn-outline flex items-center gap-2.5 px-8 text-base" style={{ height: 56 }}>
                    <Star className="w-4 h-4" /> Browse Events
                  </button>
                </Link>
              </MagBtn>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .35, duration: .85 }}
            className="flex flex-col gap-5">
            <div className="card-gradient rounded-3xl p-7"
              style={{ background: "linear-gradient(135deg,#fff 0%,#FFF5EF 100%)", border: "1px solid rgba(244,98,42,.12)" }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#F4622A] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#F4622A" }}>Live Countdown</span>
              </div>
              <CountdownTimer targetDate={hackathon?.submission_deadline || "2026-09-14T23:59:00"} label="Submission Deadline" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {STATS.map(({ val, label, color }, i) => (
                <StatCard key={label} val={val} label={label} color={color} delay={0.5 + i * 0.08} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{ background: "linear-gradient(to bottom,transparent,#FAF8F5)" }} />
    </section>
  );
}
