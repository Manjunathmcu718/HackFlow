import { ArrowRight, Check, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import PageShell from "@/components/shared/PageShell";

type RegistrationSuccessProps = {
  regId: string;
  hackathonTitle?: string;
};

function SuccessOrb() {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width:400,
        height:400,
        top:"-80px",
        right:"-80px",
        background:"radial-gradient(ellipse,rgba(244,98,42,.15) 0%,transparent 70%)",
        filter:"blur(60px)",
      }}
      animate={{ y:[0,-24,0], x:[0,12,0] }}
      transition={{ duration:10, repeat:Infinity, ease:"easeInOut" }}
    />
  );
}

export default function RegistrationSuccess({ regId, hackathonTitle }: RegistrationSuccessProps) {
  return (
    <PageShell>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background:"linear-gradient(160deg,#FFF8F4 0%,#F8F5FF 100%)" }}>
        <SuccessOrb />
        <motion.div initial={{ opacity:0,scale:.85 }} animate={{ opacity:1,scale:1 }}
          transition={{ type:"spring",stiffness:200,damping:20 }}
          className="relative z-10 max-w-md w-full mx-auto px-6 text-center">
          <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:.2,type:"spring" }}
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background:"linear-gradient(135deg,#10B981,#06B6D4)",boxShadow:"0 12px 40px rgba(16,185,129,.4)" }}>
            <Check className="w-12 h-12 text-white" strokeWidth={3} aria-hidden="true" />
          </motion.div>
          <h1 className="font-heading text-4xl font-extrabold mb-3" style={{ color:"#1A1F3C" }}>You&apos;re In!</h1>
          <p className="text-base mb-8" style={{ color:"rgba(26,31,60,.6)" }}>
            Welcome to <span className="font-bold" style={{ color:"#F4622A" }}>{hackathonTitle}</span>. Your spot is confirmed.
          </p>
          <div className="p-5 rounded-2xl mb-6"
            style={{ background:"rgba(255,255,255,.9)",border:"1px solid rgba(26,31,60,.09)",boxShadow:"0 4px 20px rgba(0,0,0,.06)" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"rgba(26,31,60,.4)" }}>Registration ID</p>
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono text-2xl font-extrabold" style={{ color:"#1A1F3C" }}>{regId}</span>
              <button onClick={() => { navigator.clipboard.writeText(regId); toast.success("Copied!"); }}
                className="p-2 rounded-xl" style={{ background:"rgba(244,98,42,.1)",color:"#F4622A" }}
                aria-label="Copy registration ID">
                <Copy className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          <a href="/participant">
            <button className="btn-primary flex items-center gap-2 px-8 py-3 rounded-full text-sm mx-auto">
              Go to Dashboard <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </a>
        </motion.div>
      </div>
    </PageShell>
  );
}
