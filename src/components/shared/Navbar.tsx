import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import NotificationBell from "./NotificationBell";

const NAV_LINKS = [
  { label: "Hackathons",  to: "/hackathons" },
  { label: "Leaderboard", to: "/leaderboard" },
  { label: "Dashboard",   to: "/participant" },
  { label: "Judge",       to: "/judge" },
  { label: "Organizer",   to: "/organizer" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const { pathname }            = useLocation();
  const { isDark, toggleTheme }  = useTheme();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={scrolled
        ? { background: "rgba(250,248,245,.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,.07)", boxShadow: "0 2px 20px rgba(0,0,0,.06)" }
        : { background: "transparent" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <img
            src="https://media.base44.com/images/public/6a305537a00d359b98abca78/72a43bdc6_e7d2cace-e670-4649-9142-fdd4a25f4013_ChatGPT-Image-May-29--2026--07-44-55-PM.webp"
            alt="BeetleX logo"
            className="w-11 h-11 rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
            style={{ boxShadow: "0 0 14px rgba(155,48,255,.7)" }}
          />
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 19, color: "#0f0f0f" }}>
            Beetle<span style={{ color: "#7C3AED" }}>X</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 rounded-2xl px-2 py-1.5"
          style={{ background: "rgba(26,31,60,.04)", border: "1px solid rgba(26,31,60,.07)" }}>
          {NAV_LINKS.map(({ label, to }) => {
            const active = pathname === to || (to !== "/" && pathname.startsWith(to));
            return (
              <Link key={to} to={to}
                className="relative px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors duration-200"
                style={{ color: active ? "#F4622A" : "rgba(26,31,60,.55)" }}>
                {active && (
                  <motion.span layoutId="nav-active" className="absolute inset-0 rounded-xl"
                    style={{ background: "rgba(244,98,42,.08)", border: "1px solid rgba(244,98,42,.2)" }}
                    transition={{ type: "spring", stiffness: 450, damping: 32 }} />
                )}
                <span className="relative z-10">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <NotificationBell />
          <Link to="/register-hackathon">
            <button className="btn-primary flex items-center gap-1.5 px-5 py-2.5 text-sm">
              Register Now <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center justify-center w-11 h-11 rounded-2xl transition-all"
            style={{ background: "rgba(26,31,60,.05)", border: "1px solid rgba(26,31,60,.08)", color: "rgba(26,31,60,.65)" }}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={isDark}
          >
            {isDark ? <Sun className="w-4 h-4" aria-hidden="true" /> : <Moon className="w-4 h-4" aria-hidden="true" />}
          </button>
        </div>

        <button className="md:hidden p-2 rounded-xl"
          style={{ color: "rgba(26,31,60,.6)", background: "rgba(26,31,60,.05)", border: "1px solid rgba(26,31,60,.08)" }}
          onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 pt-2"
          style={{ background: "#FAF8F5", borderBottom: "1px solid rgba(0,0,0,.07)" }}>
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map(({ label, to }) => (
              <Link key={to} to={to} onClick={() => setOpen(false)}
                className="px-5 py-3 rounded-2xl text-sm font-semibold"
                style={{
                  background: pathname.startsWith(to) ? "rgba(244,98,42,.1)" : "rgba(26,31,60,.04)",
                  color: pathname.startsWith(to) ? "#F4622A" : "rgba(26,31,60,.65)",
                  border: pathname.startsWith(to) ? "1px solid rgba(244,98,42,.2)" : "1px solid rgba(26,31,60,.06)",
                }}>
                {label}
              </Link>
            ))}
            <div className="flex items-center gap-2">
              <NotificationBell />
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center justify-between px-5 py-3 rounded-2xl text-sm font-semibold"
                style={{ background: "rgba(26,31,60,.04)", color: "rgba(26,31,60,.65)", border: "1px solid rgba(26,31,60,.06)" }}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                aria-pressed={isDark}
              >
                <span>{isDark ? "Light mode" : "Dark mode"}</span>
                {isDark ? <Sun className="w-4 h-4" aria-hidden="true" /> : <Moon className="w-4 h-4" aria-hidden="true" />}
              </button>
            </div>
            <Link to="/register-hackathon" onClick={() => setOpen(false)} className="mt-2">
              <button className="btn-primary w-full flex items-center justify-center gap-2 px-5 py-3 text-sm">
                Register Now <ArrowUpRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

