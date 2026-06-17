import React, { useState } from "react";
import { api } from "@/lib/mockData";
import { useQuery, useMutation } from "@tanstack/react-query";
import PageShell from "@/components/shared/PageShell";
import { Check, ArrowRight, ArrowLeft, Copy, User, Users, Code2, Eye, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const STEPS       = ["Personal Info","Team Setup","Track Selection","Review & Submit"];
const STEP_ICONS  = [User, Users, Code2, Eye];

function Orb({ style }) {
  return (
    <motion.div className="absolute rounded-full pointer-events-none" style={style}
      animate={{ y:[0,-24,0], x:[0,12,0] }}
      transition={{ duration:style.dur||9, repeat:Infinity, ease:"easeInOut", delay:style.del||0 }} />
  );
}

const FL = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-bold mb-2" style={{ color:"#1A1F3C" }}>{children}</label>
);

const FI = ({ id, ...props }) => (
  <input id={id} {...props}
    className="w-full px-4 py-3 rounded-2xl text-sm font-medium outline-none transition-all"
    style={{ background:"#F8F7FF",border:"1.5px solid rgba(26,31,60,.14)",color:"#1A1F3C" }}
    onFocus={e => { e.target.style.borderColor="#F4622A"; e.target.style.boxShadow="0 0 0 3px rgba(244,98,42,.12)"; }}
    onBlur={e =>  { e.target.style.borderColor="rgba(26,31,60,.14)"; e.target.style.boxShadow="none"; }} />
);

export default function RegisterHackathon() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [regId, setRegId] = useState("");
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    participant_name:"", email:"", organization:"", role_title:"",
    team_action:"create", team_name:"", invite_code:"", track:"",
  });

  const { data: hackathons = [] } = useQuery({ queryKey:["hackathons"], queryFn:() => api.hackathons.list() });
  const { data: existing   = [] } = useQuery({ queryKey:["registrations"], queryFn:() => api.registrations.list() });

  const activeHackathon = hackathons.find(h => h.status === "active") || hackathons[0];

  const createReg = useMutation({
    mutationFn: data => api.registrations.create(data),
    onSuccess: data => {
      setRegId("BX-" + String(data.id).slice(-8).toUpperCase());
      setDone(true);
    },
  });

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]:value }));
    setErrors(prev => ({ ...prev, [field]:undefined }));
  };

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.participant_name.trim()) e.participant_name = "Name is required";
      if (!form.email.trim()) e.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
      else if (existing.some(r => r.email === form.email && r.hackathon_id === activeHackathon?.id))
        e.email = "Already registered for this hackathon";
      if (!form.organization.trim()) e.organization = "Organization is required";
      if (!form.role_title.trim()) e.role_title = "Role is required";
    } else if (step === 1) {
      if (form.team_action === "create" && !form.team_name.trim()) e.team_name = "Team name is required";
      if (form.team_action === "join"   && !form.invite_code.trim()) e.invite_code = "Invite code is required";
    } else if (step === 2) {
      if (!form.track) e.track = "Please select a track";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next   = () => { if (validateStep()) setStep(s => Math.min(s+1,3)); };
  const prev   = () => setStep(s => Math.max(s-1,0));
  const submit = () => {
    createReg.mutate({ ...form, hackathon_id: activeHackathon?.id });
  };

  const Err = ({ field }) => errors[field]
    ? <p className="text-xs font-semibold mt-1.5" style={{ color:"#F43F5E" }} role="alert">{errors[field]}</p>
    : null;

  if (done) return (
    <PageShell>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background:"linear-gradient(160deg,#FFF8F4 0%,#F8F5FF 100%)" }}>
        <Orb style={{ width:400,height:400,top:"-80px",right:"-80px",background:"radial-gradient(ellipse,rgba(244,98,42,.15) 0%,transparent 70%)",filter:"blur(60px)",dur:10,del:0 }} />
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
            Welcome to <span className="font-bold" style={{ color:"#F4622A" }}>{activeHackathon?.title}</span>. Your spot is confirmed.
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

  return (
    <PageShell>
      <div className="relative overflow-hidden pt-28 pb-10"
        style={{ background:"linear-gradient(160deg,#FFF8F4 0%,#FAFEFF 50%,#F8F5FF 100%)" }}>
        <Orb style={{ width:500,height:500,top:"-120px",right:"-100px",background:"radial-gradient(ellipse,rgba(244,98,42,.16) 0%,transparent 70%)",filter:"blur(70px)",dur:10,del:0 }} />
        <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
          style={{ background:"linear-gradient(to bottom,transparent,#FAF8F5)" }} />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-[.2em] pill-coral px-3 py-1 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" aria-hidden="true" /> REGISTRATION
            </span>
          </div>
          <h1 className="font-heading font-extrabold tracking-tight" style={{ fontSize:"clamp(2rem,5vw,3.2rem)",color:"#1A1F3C" }}>
            Register for <span className="text-shimmer">Hackathon</span>
          </h1>
          <p className="mt-2 text-base font-semibold" style={{ color:"rgba(26,31,60,.5)" }}>{activeHackathon?.title}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-20">
        {/* Step progress */}
        <nav aria-label="Registration steps" className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => {
            const Icon   = STEP_ICONS[i];
            const isDone = i < step, isActive = i === step;
            return (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0"
                    style={{
                      background: isDone?"linear-gradient(135deg,#F4622A,#FB923C)":isActive?"rgba(244,98,42,.08)":"transparent",
                      borderColor: isDone||isActive?"#F4622A":"rgba(26,31,60,.15)",
                      color: isDone?"#fff":isActive?"#F4622A":"rgba(26,31,60,.35)",
                    }}
                    aria-current={isActive?"step":undefined}>
                    {isDone ? <Check className="w-4 h-4" aria-hidden="true" /> : <Icon className="w-3.5 h-3.5" aria-hidden="true" />}
                  </div>
                  <span className="text-xs font-bold hidden sm:inline"
                    style={{ color:isActive?"#1A1F3C":isDone?"#F4622A":"rgba(26,31,60,.35)" }}>{s}</span>
                </div>
                {i < STEPS.length-1 && (
                  <div className="flex-1 h-0.5 rounded-full"
                    style={{ background:i<step?"linear-gradient(90deg,#F4622A,#FB923C)":"rgba(26,31,60,.1)" }} />
                )}
              </React.Fragment>
            );
          })}
        </nav>

        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity:0,x:30,scale:.98 }} animate={{ opacity:1,x:0,scale:1 }}
            exit={{ opacity:0,x:-30,scale:.98 }} transition={{ duration:.28 }}>
            <div className="rounded-3xl p-6 sm:p-8"
              style={{ background:"#fff",border:"1px solid rgba(26,31,60,.09)",boxShadow:"0 8px 40px rgba(0,0,0,.07)" }}>

              {step === 0 && (
                <div className="space-y-5">
                  <div><FL htmlFor="name">Full Name *</FL><FI id="name" value={form.participant_name} onChange={e=>update("participant_name",e.target.value)} placeholder="John Doe" aria-required="true" /><Err field="participant_name" /></div>
                  <div><FL htmlFor="email">Email Address *</FL><FI id="email" type="email" value={form.email} onChange={e=>update("email",e.target.value)} placeholder="john@example.com" aria-required="true" /><Err field="email" /></div>
                  <div><FL htmlFor="org">College / Organization *</FL><FI id="org" value={form.organization} onChange={e=>update("organization",e.target.value)} placeholder="MIT" aria-required="true" /><Err field="organization" /></div>
                  <div><FL htmlFor="role">Your Role *</FL><FI id="role" value={form.role_title} onChange={e=>update("role_title",e.target.value)} placeholder="Frontend Developer" aria-required="true" /><Err field="role_title" /></div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  {[
                    { val:"create", label:"Create a New Team", sub:"Start a team and invite others" },
                    { val:"join",   label:"Join Existing Team", sub:"Enter an invite code from your team lead" },
                  ].map(opt => (
                    <div key={opt.val} onClick={() => update("team_action",opt.val)}
                      className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer"
                      style={{ border:`2px solid ${form.team_action===opt.val?"#F4622A":"rgba(26,31,60,.1)"}`,background:form.team_action===opt.val?"rgba(244,98,42,.05)":"#fff" }}
                      role="radio" aria-checked={form.team_action===opt.val} tabIndex={0}
                      onKeyDown={e => e.key===" "&&update("team_action",opt.val)}>
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={{ borderColor:form.team_action===opt.val?"#F4622A":"rgba(26,31,60,.2)" }}>
                        {form.team_action===opt.val&&<div className="w-2.5 h-2.5 rounded-full" style={{ background:"#F4622A" }} />}
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color:"#1A1F3C" }}>{opt.label}</p>
                        <p className="text-xs mt-0.5" style={{ color:"rgba(26,31,60,.5)" }}>{opt.sub}</p>
                      </div>
                    </div>
                  ))}
                  {form.team_action==="create" && <div><FL htmlFor="tname">Team Name *</FL><FI id="tname" value={form.team_name} onChange={e=>update("team_name",e.target.value)} placeholder="ChainBreakers" /><Err field="team_name" /></div>}
                  {form.team_action==="join"   && <div><FL htmlFor="icode">Invite Code *</FL><FI id="icode" value={form.invite_code} onChange={e=>update("invite_code",e.target.value)} placeholder="CB-2025-X7K" className="font-mono" /><Err field="invite_code" /></div>}
                </div>
              )}

              {step === 2 && (
                <div>
                  <FL htmlFor="track-select">Select a Technology Track *</FL>
                  <div className="space-y-3 mt-2" role="radiogroup" aria-labelledby="track-select">
                    {(activeHackathon?.tracks||[]).map(t => (
                      <div key={t.name} onClick={() => update("track",t.name)}
                        className="p-4 rounded-2xl cursor-pointer"
                        style={{ border:`2px solid ${form.track===t.name?"#F4622A":"rgba(26,31,60,.1)"}`,background:form.track===t.name?"rgba(244,98,42,.05)":"#fff" }}
                        role="radio" aria-checked={form.track===t.name} tabIndex={0}
                        onKeyDown={e => e.key===" "&&update("track",t.name)}>
                        <div className="flex justify-between items-start">
                          <div><p className="font-bold text-sm" style={{ color:"#1A1F3C" }}>{t.name}</p><p className="text-xs mt-0.5" style={{ color:"rgba(26,31,60,.5)" }}>{t.description}</p></div>
                          <span className="font-mono text-sm font-extrabold" style={{ color:"#F4622A" }}>{t.prize}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Err field="track" />
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="font-heading font-extrabold text-xl mb-5" style={{ color:"#1A1F3C" }}>Review Your Registration</h2>
                  <dl className="rounded-2xl overflow-hidden" style={{ border:"1px solid rgba(26,31,60,.09)" }}>
                    {[
                      { label:"Name",         value:form.participant_name },
                      { label:"Email",        value:form.email },
                      { label:"Organization", value:form.organization },
                      { label:"Role",         value:form.role_title },
                      { label:"Team",         value:form.team_action==="create"?`Create: ${form.team_name}`:`Join: ${form.invite_code}` },
                      { label:"Track",        value:form.track },
                    ].map((item,i) => (
                      <div key={item.label} className="flex items-center justify-between px-4 py-3"
                        style={{ borderBottom:i<5?"1px solid rgba(26,31,60,.07)":"none",background:i%2===0?"rgba(26,31,60,.015)":"#fff" }}>
                        <dt className="text-xs font-bold uppercase tracking-wider" style={{ color:"rgba(26,31,60,.4)" }}>{item.label}</dt>
                        <dd className="text-sm font-semibold" style={{ color:"#1A1F3C" }}>{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-6">
          <button onClick={prev} disabled={step===0}
            className="btn-outline flex items-center gap-2 px-6 py-3 text-sm font-semibold disabled:opacity-30">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back
          </button>
          {step < 3 ? (
            <button onClick={next} className="btn-primary flex items-center gap-2 px-8 py-3 text-sm font-semibold">
              Next <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          ) : (
            <button onClick={submit} disabled={createReg.isPending}
              className="btn-primary flex items-center gap-2 px-8 py-3 text-sm font-semibold disabled:opacity-60">
              {createReg.isPending ? "Submitting..." : "Confirm"} <Check className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </PageShell>
  );
}

