import type { InputHTMLAttributes, ReactNode } from "react";
import type { Hackathon } from "@/mocks/types";

export type TeamAction = "create" | "join";

export type RegistrationForm = {
  participant_name: string;
  email: string;
  organization: string;
  role_title: string;
  team_action: TeamAction;
  team_name: string;
  invite_code: string;
  track: string;
};

export type RegistrationErrors = Partial<Record<keyof RegistrationForm, string>>;

type RegistrationStepContentProps = {
  step: number;
  form: RegistrationForm;
  errors: RegistrationErrors;
  activeHackathon?: Hackathon;
  update: <K extends keyof RegistrationForm>(field: K, value: RegistrationForm[K]) => void;
};

const FL = ({ htmlFor, children }: { htmlFor: string; children: ReactNode }) => (
  <label htmlFor={htmlFor} className="block text-sm font-bold mb-2" style={{ color:"#1A1F3C" }}>{children}</label>
);

const FI = ({ id, ...props }: InputHTMLAttributes<HTMLInputElement> & { id: string }) => (
  <input id={id} {...props}
    className="w-full px-4 py-3 rounded-2xl text-sm font-medium outline-none transition-all"
    style={{ background:"#F8F7FF",border:"1.5px solid rgba(26,31,60,.14)",color:"#1A1F3C" }}
    onFocus={e => { e.target.style.borderColor="#F4622A"; e.target.style.boxShadow="0 0 0 3px rgba(244,98,42,.12)"; }}
    onBlur={e =>  { e.target.style.borderColor="rgba(26,31,60,.14)"; e.target.style.boxShadow="none"; }} />
);

export default function RegistrationStepContent({ step, form, errors, activeHackathon, update }: RegistrationStepContentProps) {
  const Err = ({ field }: { field: keyof RegistrationForm }) => errors[field]
    ? <p className="text-xs font-semibold mt-1.5" style={{ color:"#F43F5E" }} role="alert">{errors[field]}</p>
    : null;

  if (step === 0) {
    return (
      <div className="space-y-5">
        <div><FL htmlFor="name">Full Name *</FL><FI id="name" value={form.participant_name} onChange={e=>update("participant_name",e.target.value)} placeholder="John Doe" aria-required="true" /><Err field="participant_name" /></div>
        <div><FL htmlFor="email">Email Address *</FL><FI id="email" type="email" value={form.email} onChange={e=>update("email",e.target.value)} placeholder="john@example.com" aria-required="true" /><Err field="email" /></div>
        <div><FL htmlFor="org">College / Organization *</FL><FI id="org" value={form.organization} onChange={e=>update("organization",e.target.value)} placeholder="MIT" aria-required="true" /><Err field="organization" /></div>
        <div><FL htmlFor="role">Your Role *</FL><FI id="role" value={form.role_title} onChange={e=>update("role_title",e.target.value)} placeholder="Frontend Developer" aria-required="true" /><Err field="role_title" /></div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="space-y-4">
        {([
          { val:"create", label:"Create a New Team", sub:"Start a team and invite others" },
          { val:"join", label:"Join Existing Team", sub:"Enter an invite code from your team lead" },
        ] as const).map(opt => (
          <div key={opt.val} onClick={() => update("team_action",opt.val)}
            className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer"
            style={{ border:`2px solid ${form.team_action===opt.val?"#F4622A":"rgba(26,31,60,.1)"}`,background:form.team_action===opt.val?"rgba(244,98,42,.05)":"#fff" }}
            role="radio" aria-checked={form.team_action===opt.val} tabIndex={0}
            onKeyDown={e => e.key===" "&&update("team_action",opt.val)}>
            <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor:form.team_action===opt.val?"#F4622A":"rgba(26,31,60,.2)" }}>
              {form.team_action===opt.val&&<div className="w-2.5 h-2.5 rounded-full" style={{ background:"#F4622A" }} />}
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color:"#1A1F3C" }}>{opt.label}</p>
              <p className="text-xs mt-0.5" style={{ color:"rgba(26,31,60,.5)" }}>{opt.sub}</p>
            </div>
          </div>
        ))}
        {form.team_action==="create" && <div><FL htmlFor="tname">Team Name *</FL><FI id="tname" value={form.team_name} onChange={e=>update("team_name",e.target.value)} placeholder="ChainBreakers" /><Err field="team_name" /></div>}
        {form.team_action==="join" && <div><FL htmlFor="icode">Invite Code *</FL><FI id="icode" value={form.invite_code} onChange={e=>update("invite_code",e.target.value)} placeholder="CB-2025-X7K" className="font-mono" /><Err field="invite_code" /></div>}
      </div>
    );
  }

  if (step === 2) {
    return (
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
    );
  }

  return (
    <div>
      <h2 className="font-heading font-extrabold text-xl mb-5" style={{ color:"#1A1F3C" }}>Review Your Registration</h2>
      <dl className="rounded-2xl overflow-hidden" style={{ border:"1px solid rgba(26,31,60,.09)" }}>
        {[
          { label:"Name", value:form.participant_name },
          { label:"Email", value:form.email },
          { label:"Organization", value:form.organization },
          { label:"Role", value:form.role_title },
          { label:"Team", value:form.team_action==="create"?`Create: ${form.team_name}`:`Join: ${form.invite_code}` },
          { label:"Track", value:form.track },
        ].map((item,i) => (
          <div key={item.label} className="flex items-center justify-between px-4 py-3" style={{ borderBottom:i<5?"1px solid rgba(26,31,60,.07)":"none",background:i%2===0?"rgba(26,31,60,.015)":"#fff" }}>
            <dt className="text-xs font-bold uppercase tracking-wider" style={{ color:"rgba(26,31,60,.4)" }}>{item.label}</dt>
            <dd className="text-sm font-semibold" style={{ color:"#1A1F3C" }}>{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
