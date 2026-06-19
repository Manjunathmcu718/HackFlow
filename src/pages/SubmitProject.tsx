import React, { useState, useEffect } from "react";
import { api } from "@/lib/mockData";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageShell from "@/components/shared/PageShell";
import CountdownTimer from "@/components/shared/CountdownTimer";
import { Save, Send, Lock, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import ProjectSubmissionFields from "@/components/submission/ProjectSubmissionFields";

type ProjectForm = {
  project_title: string;
  description: string;
  tech_stack: string[];
  demo_url: string;
  github_url: string;
  pitch_deck_url: string;
  video_url: string;
};

export default function SubmitProject() {
  const queryClient = useQueryClient();
  const hackathonsQuery = useQuery({ queryKey:["hackathons"],  queryFn:() => api.hackathons.list() });
  const teamsQuery = useQuery({ queryKey:["teams"], queryFn:() => api.teams.list() });
  const submissionsQuery = useQuery({ queryKey:["submissions"], queryFn:() => api.submissions.list() });
  const hackathons = hackathonsQuery.data || [];
  const teams = teamsQuery.data || [];
  const submissions = submissionsQuery.data || [];
  const hasLoadError = hackathonsQuery.isError || teamsQuery.isError || submissionsQuery.isError;

  const hackathon      = hackathons.find(h=>h.status==="active") || hackathons[0];
  const team           = teams[0];
  const existing       = submissions.find(s=>s.team_id===team?.id);
  const deadlinePassed = hackathon?.submission_deadline && new Date(hackathon.submission_deadline) < new Date();

  const [form, setForm] = useState<ProjectForm>({ project_title:"", description:"", tech_stack:[], demo_url:"", github_url:"", pitch_deck_url:"", video_url:"" });
  const [techInput, setTechInput]       = useState("");
  const [pitchFileName, setPitchFileName] = useState("");
  const [isSubmitted, setIsSubmitted]   = useState(false);

  useEffect(() => {
    if (existing) {
      setForm({
        project_title:  existing.project_title  || "",
        description:    existing.description    || "",
        tech_stack:     existing.tech_stack     || [],
        demo_url:       existing.demo_url       || "",
        github_url:     existing.github_url     || "",
        pitch_deck_url: existing.pitch_deck_url || "",
        video_url:      existing.video_url      || "",
      });
      if (existing.pitch_deck_url) setPitchFileName("pitch-deck.pdf");
      setIsSubmitted(existing.status==="submitted");
    }
  }, [existing]);

  const saveDraft = useMutation({
    mutationFn: async (data: ProjectForm) => {
      if (existing) return api.submissions.update(existing.id,{...data,is_draft:true,status:"draft"});
      return api.submissions.create({...data,hackathon_id:hackathon?.id,team_id:team?.id,team_name:team?.name,track:team?.track,is_draft:true,status:"draft"});
    },
    onSuccess: () => { queryClient.invalidateQueries({queryKey:["submissions"]}); toast.success("Draft saved!"); },
  });

  const submitFinal = useMutation({
    mutationFn: async (data: ProjectForm) => {
      if (existing) return api.submissions.update(existing.id,{...data,is_draft:false,status:"submitted"});
      return api.submissions.create({...data,hackathon_id:hackathon?.id,team_id:team?.id,team_name:team?.name,track:team?.track,is_draft:false,status:"submitted"});
    },
    onSuccess: () => { queryClient.invalidateQueries({queryKey:["submissions"]}); setIsSubmitted(true); toast.success("Project submitted!"); },
  });

  const addTech = () => {
    if (techInput.trim() && !form.tech_stack.includes(techInput.trim())) {
      setForm(prev=>({...prev,tech_stack:[...prev.tech_stack,techInput.trim()]}));
      setTechInput("");
    }
  };
  const removeTech = (t: string) => setForm(prev=>({...prev,tech_stack:prev.tech_stack.filter(x=>x!==t)}));

  const isValidHttpUrl = (value: string) => {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const validateFinalSubmission = () => {
    const errors: string[] = [];
    if (!form.project_title.trim()) errors.push("Project title is required.");
    if (!form.description.trim()) errors.push("Description is required.");
    if (!form.demo_url.trim()) errors.push("Demo URL is required.");
    else if (!isValidHttpUrl(form.demo_url.trim())) errors.push("Demo URL must start with http:// or https://.");
    if (!form.github_url.trim()) errors.push("GitHub repository URL is required.");
    else if (!isValidHttpUrl(form.github_url.trim())) errors.push("GitHub URL must start with http:// or https://.");
    if (!form.pitch_deck_url.trim()) errors.push("Pitch deck PDF is required.");
    if (form.video_url.trim() && !isValidHttpUrl(form.video_url.trim())) errors.push("Demo video URL must start with http:// or https://.");
    return errors;
  };

  const handlePitchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isPdf = file.type === "application/pdf";
    if (!isPdf) {
      toast.error("Pitch deck must be a PDF file");
      e.target.value = "";
      return;
    }
    if (file.size > 10*1024*1024) {
      toast.error("File must be under 10 MB");
      e.target.value = "";
      return;
    }
    const fakeUrl = `https://mock-storage.beetlex.io/pitch-decks/${Date.now()}-${file.name}`;
    setForm(f=>({...f,pitch_deck_url:fakeUrl}));
    setPitchFileName(file.name);
    toast.success("Pitch deck ready to submit!");
  };

  const iStyle = { background:"#fff",border:"1px solid rgba(26,31,60,.12)",borderRadius:10,padding:"10px 14px",color:"#1A1F3C",fontSize:14,outline:"none",width:"100%" };
  const cStyle = { background:"#fff",border:"1px solid rgba(26,31,60,.09)",borderRadius:16,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,.04)" };

  if (hasLoadError) return (
    <PageShell>
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background:"rgba(244,63,94,.1)" }}>
          <AlertTriangle className="w-8 h-8" style={{ color:"#F43F5E" }} aria-hidden="true" />
        </div>
        <h1 className="font-heading text-2xl font-bold mb-3" style={{ color:"#1A1F3C" }}>Could Not Load Submission</h1>
        <p style={{ color:"rgba(26,31,60,.55)" }}>Please refresh and try again.</p>
      </div>
    </PageShell>
  );

  if (deadlinePassed && !isSubmitted) return (
    <PageShell>
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background:"rgba(239,68,68,.1)" }}>
          <Lock className="w-8 h-8" style={{ color:"#EF4444" }} aria-hidden="true" />
        </div>
        <h1 className="font-heading text-2xl font-bold mb-3" style={{ color:"#1A1F3C" }}>Submissions Closed</h1>
        <p style={{ color:"rgba(26,31,60,.5)" }}>The submission deadline has passed.</p>
      </div>
    </PageShell>
  );

  return (
    <PageShell>
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16">
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-1" style={{ color:"#1A1F3C" }}>Submit Your Project</h1>
            <p style={{ color:"rgba(26,31,60,.5)" }}>Team: {team?.name} &middot; Track: {team?.track}</p>
          </div>
          <CountdownTimer targetDate={hackathon?.submission_deadline} label="Time Remaining" compact />
        </div>

        <div className="space-y-6">
          <ProjectSubmissionFields
            form={form}
            techInput={techInput}
            pitchFileName={pitchFileName}
            setForm={setForm}
            setTechInput={setTechInput}
            addTech={addTech}
            removeTech={removeTech}
            handlePitchUpload={handlePitchUpload}
            iStyle={iStyle}
            cStyle={cStyle}
          />

          <div className="flex items-center gap-3 justify-end">
            <button onClick={()=>saveDraft.mutate(form)} disabled={saveDraft.isPending}
              className="btn-outline flex items-center gap-2 px-6 py-3 text-sm disabled:opacity-60" aria-label="Save as draft">
              <Save className="w-4 h-4" aria-hidden="true" /> {saveDraft.isPending?"Saving...":"Save Draft"}
            </button>
            <button onClick={()=>{
              const validationErrors = validateFinalSubmission();
              if (validationErrors.length > 0) {
                toast.error(validationErrors[0]);
                return;
              }
              submitFinal.mutate(form);
            }} disabled={submitFinal.isPending}
              className="btn-primary flex items-center gap-2 px-8 py-3 text-sm disabled:opacity-60" aria-label="Submit project">
              <Send className="w-4 h-4" aria-hidden="true" /> {submitFinal.isPending?"Submitting...":"Submit Project"}
            </button>
          </div>

          {isSubmitted && (
            <div className="p-4 rounded-xl flex items-center gap-3" role="status" aria-live="polite"
              style={{ background:"rgba(16,185,129,.08)",border:"1px solid rgba(16,185,129,.2)" }}>
              <Check className="w-5 h-5 flex-shrink-0" style={{ color:"#10B981" }} aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold" style={{ color:"#059669" }}>Submitted Successfully</p>
                <p className="text-xs" style={{ color:"rgba(26,31,60,.5)" }}>You can still edit until the deadline.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

