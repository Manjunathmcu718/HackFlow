import React, { useState } from "react";
import { api, type ApiError } from "@/lib/mockData";
import { useQuery, useMutation } from "@tanstack/react-query";
import PageShell from "@/components/shared/PageShell";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import RegistrationSuccess from "@/components/registration/RegistrationSuccess";
import RegistrationProgress from "@/components/registration/RegistrationProgress";
import RegistrationHero from "@/components/registration/RegistrationHero";
import RegistrationStepContent, { type RegistrationErrors, type RegistrationForm } from "@/components/registration/RegistrationStepContent";
import type { DuplicateRegistrationError } from "@/mocks/types";



export default function RegisterHackathon() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [regId, setRegId] = useState("");
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [form, setForm] = useState<RegistrationForm>({
    participant_name:"", email:"", organization:"", role_title:"",
    team_action:"create", team_name:"", invite_code:"", track:"",
  });

  const { data: hackathons = [] } = useQuery({ queryKey:["hackathons"], queryFn:() => api.hackathons.list() });
  const { data: existing   = [] } = useQuery({ queryKey:["registrations"], queryFn:() => api.registrations.list() });

  const activeHackathon = hackathons.find(h => h.status === "active") || hackathons[0];

  const createReg = useMutation({
    mutationFn: (data: RegistrationForm & { hackathon_id?: string }) => api.registrations.create(data),
    onSuccess: data => {
      setRegId("BX-" + String(data.id).slice(-8).toUpperCase());
      setDone(true);
    },
    onError: error => {
      const apiError = error as ApiError;
      const data = apiError.data as DuplicateRegistrationError | undefined;
      if (apiError.status === 409 && data?.code === "DUPLICATE_REGISTRATION") {
        setRegId("BX-" + String(data.registrationId).slice(-8).toUpperCase());
        setDone(true);
        return;
      }

      toast.error("Registration could not be completed. Please try again.");
    },
  });

  const update = <K extends keyof RegistrationForm>(field: K, value: RegistrationForm[K]) => {
    setForm(prev => ({ ...prev, [field]:value }));
    setErrors(prev => ({ ...prev, [field]:undefined }));
  };

  const validateStep = () => {
    const e: RegistrationErrors = {};
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
  const submit = () => createReg.mutate({ ...form, hackathon_id: activeHackathon?.id });


  if (done) {
    return <RegistrationSuccess regId={regId} hackathonTitle={activeHackathon?.title} />;
  }

  return (
    <PageShell>
      <RegistrationHero hackathonTitle={activeHackathon?.title} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-20">
        <RegistrationProgress step={step} />

        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity:0,x:30,scale:.98 }} animate={{ opacity:1,x:0,scale:1 }}
            exit={{ opacity:0,x:-30,scale:.98 }} transition={{ duration:.28 }}>
            <div className="rounded-3xl p-6 sm:p-8"
              style={{ background:"#fff",border:"1px solid rgba(26,31,60,.09)",boxShadow:"0 8px 40px rgba(0,0,0,.07)" }}>

              <RegistrationStepContent step={step} form={form} errors={errors} activeHackathon={activeHackathon} update={update} />

              {step === 1 && (
                <div className="space-y-4">
                  {([
                    { val:"create", label:"Create a New Team", sub:"Start a team and invite others" },
                    { val:"join",   label:"Join Existing Team", sub:"Enter an invite code from your team lead" },
                  ] as const).map(opt => (
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

