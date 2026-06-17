import React from "react";
import { Check, Code2, Eye, User, Users } from "lucide-react";

const STEPS = ["Personal Info","Team Setup","Track Selection","Review & Submit"];
const STEP_ICONS = [User, Users, Code2, Eye];

export default function RegistrationProgress({ step }: { step: number }) {
  return (
    <nav aria-label="Registration steps" className="flex items-center gap-2 mb-8">
      {STEPS.map((s, i) => {
        const Icon = STEP_ICONS[i];
        const isDone = i < step;
        const isActive = i === step;

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
  );
}
