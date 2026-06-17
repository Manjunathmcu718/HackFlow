import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const defaultFaqs = [
  { question:"Do I need Web3 experience to participate?", answer:"Not at all! We welcome developers of all backgrounds. We run workshops and have mentors to help you get started with Web3 and AI concepts." },
  { question:"Can I participate solo?",                   answer:"Yes! Solo participation is fully supported. Teams can be 1-4 members. Many great projects have been built by solo hackers." },
  { question:"Is BeetleX free to join?",                  answer:"Participation is completely free. We believe talent shouldn't be limited by financial constraints." },
  { question:"When are results announced?",               answer:"Results are announced on the closing ceremony date (July 16). Winners are revealed live and receive prizes within 30 days." },
  { question:"What do I need to submit?",                 answer:"A working demo, GitHub repository, and a short pitch. Bonus points for a video walkthrough and pitch deck." },
];

export default function FAQSection({ faqs }) {
  const items = faqs?.length > 0 ? faqs : defaultFaqs;
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section className="relative py-24 sm:py-32 section-white overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-4 pill-violet px-3 py-1.5">
            FREQUENTLY ASKED
          </motion.div>
          <motion.h2 initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:.1 }}
            className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight" style={{ color:"#1A1F3C" }}>
            Got <span className="text-grad-violet">Questions?</span>
          </motion.h2>
        </div>

        <div className="space-y-3">
          {items.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <motion.div key={i}
                initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay:i*.07 }}
                className="rounded-2xl border overflow-hidden transition-all duration-300"
                style={{ background:isOpen?"#FFF8F5":"#fff", borderColor:isOpen?"rgba(244,98,42,.3)":"rgba(0,0,0,.07)", boxShadow:isOpen?"0 4px 20px rgba(244,98,42,.1)":"0 1px 3px rgba(0,0,0,.04)" }}>
                <button onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left">
                  <span className="font-heading font-semibold text-base" style={{ color:"#1A1F3C" }}>{faq.question}</span>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                    style={isOpen ? { background:"linear-gradient(135deg,#F4622A,#FB923C)", color:"#fff" } : { background:"rgba(26,31,60,.06)", color:"rgba(26,31,60,.5)" }}>
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }}
                      transition={{ duration:.3, ease:[.22,1,.36,1] }}>
                      <div className="px-6 pb-6">
                        <div className="h-px mb-4" style={{ background:"rgba(244,98,42,.15)" }} />
                        <p className="text-sm leading-relaxed" style={{ color:"rgba(26,31,60,.6)" }}>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

