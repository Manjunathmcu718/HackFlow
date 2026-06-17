import React from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const LINKS = {
  Platform: [
    { label: "Browse Hackathons", path: "/hackathons" },
    { label: "Leaderboard",       path: "/leaderboard" },
    { label: "Participant Hub",   path: "/participant" },
    { label: "Judge Panel",       path: "/judge" },
  ],
  Resources: [
    { label: "Documentation",     href: "#" },
    { label: "API Reference",     href: "#" },
    { label: "Community Discord", href: "#" },
  ],
};

const SOCIALS = [
  { icon: Github,   href: "#", label: "GitHub" },
  { icon: Twitter,  href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Mail,     href: "mailto:hello@beetlex.io", label: "Email" },
];

export default function Footer() {
  return (
    <footer style={{ background: "linear-gradient(180deg,#FFF5EF 0%,#FAF8F5 100%)", borderTop: "1px solid rgba(244,98,42,.12)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-14 pb-14"
          style={{ borderBottom: "1px solid rgba(244,98,42,.1)" }}>
          <div>
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold mb-2" style={{ color: "#1A1F3C" }}>
              Ready to build the future?
            </h3>
            <p style={{ color: "rgba(26,31,60,.5)" }}>Join 2,800+ builders shipping at BeetleX.</p>
          </div>
          <Link to="/register-hackathon">
            <button className="btn-primary flex items-center gap-2 px-7 py-3.5 text-base">
              Register Now <ArrowUpRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <img
                src="https://media.base44.com/images/public/6a305537a00d359b98abca78/72a43bdc6_e7d2cace-e670-4649-9142-fdd4a25f4013_ChatGPT-Image-May-29--2026--07-44-55-PM.webp"
                alt="BeetleX" className="w-10 h-10 rounded-full object-cover"
                style={{ boxShadow: "0 0 12px rgba(155,48,255,.7)" }} />
              <span className="font-heading font-extrabold text-xl" style={{ color: "#1A1F3C" }}>BeetleX</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(26,31,60,.5)" }}>
              Developer-first platform at the intersection of Web3 and AI.
            </p>
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(26,31,60,.06)", border: "1px solid rgba(26,31,60,.08)", color: "rgba(26,31,60,.45)" }}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-heading font-bold text-sm mb-5 uppercase tracking-wider" style={{ color: "rgba(26,31,60,.5)" }}>{section}</h4>
              <div className="flex flex-col gap-3">
                {links.map(link => link.path
                  ? <Link key={link.label} to={link.path} className="text-sm" style={{ color: "rgba(26,31,60,.55)" }}>{link.label}</Link>
                  : <a key={link.label} href={link.href} className="text-sm" style={{ color: "rgba(26,31,60,.55)" }}>{link.label}</a>
                )}
              </div>
            </div>
          ))}

          <div>
            <h4 className="font-heading font-bold text-sm mb-5 uppercase tracking-wider" style={{ color: "rgba(26,31,60,.5)" }}>Status</h4>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl pill-teal w-fit">
              <div className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse" />
              <span className="text-xs font-medium">All systems operational</span>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(26,31,60,.07)" }}>
          <p className="text-xs" style={{ color: "rgba(26,31,60,.35)" }}>
            &copy; 2025 BeetleX. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["Privacy Policy", "Terms of Service", "Cookies"].map(l => (
              <a key={l} href="#" className="text-xs" style={{ color: "rgba(26,31,60,.35)" }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

