import type { CSSProperties, ChangeEvent, KeyboardEvent } from "react";
import { ExternalLink, Github, Film, FileText, Plus, X } from "lucide-react";

type ProjectForm = {
  project_title: string;
  description: string;
  tech_stack: string[];
  demo_url: string;
  github_url: string;
  pitch_deck_url: string;
  video_url: string;
};

type ProjectSubmissionFieldsProps = {
  form: ProjectForm;
  techInput: string;
  pitchFileName: string;
  setForm: React.Dispatch<React.SetStateAction<ProjectForm>>;
  setTechInput: React.Dispatch<React.SetStateAction<string>>;
  addTech: () => void;
  removeTech: (tech: string) => void;
  handlePitchUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  iStyle: CSSProperties;
  cStyle: CSSProperties;
};

export default function ProjectSubmissionFields({
  form,
  techInput,
  pitchFileName,
  setForm,
  setTechInput,
  addTech,
  removeTech,
  handlePitchUpload,
  iStyle,
  cStyle,
}: ProjectSubmissionFieldsProps) {
  const handleTechKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTech();
    }
  };

  return (
    <>
      <section aria-labelledby="details-h" style={cStyle}>
        <h2 id="details-h" className="font-heading font-bold text-base mb-4" style={{ color:"#1A1F3C" }}>Project Details</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="ptitle" className="block text-sm font-semibold mb-1.5" style={{ color:"#1A1F3C" }}>Project Title *</label>
            <input id="ptitle" style={iStyle} value={form.project_title} onChange={e=>setForm(f=>({...f,project_title:e.target.value}))} placeholder="DeFi Shield" aria-required="true" />
          </div>
          <div>
            <label htmlFor="pdesc" className="block text-sm font-semibold mb-1.5" style={{ color:"#1A1F3C" }}>Description *</label>
            <textarea id="pdesc" style={{...iStyle,minHeight:120,resize:"vertical"}} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Describe your project..." aria-required="true" />
          </div>
          <div>
            <label htmlFor="tech-in" className="block text-sm font-semibold mb-1.5" style={{ color:"#1A1F3C" }}>Tech Stack</label>
            <div className="flex gap-2">
              <input id="tech-in" style={iStyle} value={techInput} onChange={e=>setTechInput(e.target.value)} placeholder="React" onKeyDown={handleTechKey} aria-label="Add technology" />
              <button type="button" onClick={addTech} aria-label="Add tech" className="px-4 py-2 rounded-xl font-semibold text-sm flex-shrink-0" style={{ background:"rgba(244,98,42,.1)",color:"#F4622A",border:"1px solid rgba(244,98,42,.2)" }}>
                <Plus className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2" role="list" aria-label="Selected technologies">
              {form.tech_stack.map(t=>(
                <span key={t} role="listitem" className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full pill-violet">
                  {t}
                  <button onClick={()=>removeTech(t)} aria-label={`Remove ${t}`} className="hover:opacity-70 ml-1"><X className="w-3 h-3" aria-hidden="true" /></button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="links-h" style={cStyle}>
        <h2 id="links-h" className="font-heading font-bold text-base mb-4" style={{ color:"#1A1F3C" }}>Links &amp; Files</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="demo-url" className="block text-sm font-semibold mb-1.5 flex items-center gap-1.5" style={{ color:"#1A1F3C" }}>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> Demo URL *
            </label>
            <input id="demo-url" style={iStyle} value={form.demo_url} onChange={e=>setForm(f=>({...f,demo_url:e.target.value}))} placeholder="https://your-demo.com" type="url" aria-required="true" />
          </div>
          <div>
            <label htmlFor="github-url" className="block text-sm font-semibold mb-1.5 flex items-center gap-1.5" style={{ color:"#1A1F3C" }}>
              <Github className="w-3.5 h-3.5" aria-hidden="true" /> GitHub Repository *
            </label>
            <input id="github-url" style={iStyle} value={form.github_url} onChange={e=>setForm(f=>({...f,github_url:e.target.value}))} placeholder="https://github.com/..." type="url" aria-required="true" />
          </div>
          <div>
            <label htmlFor="pitch-file" className="block text-sm font-semibold mb-1.5 flex items-center gap-1.5" style={{ color:"#1A1F3C" }}>
              <FileText className="w-3.5 h-3.5" aria-hidden="true" /> Pitch Deck (PDF, max 10 MB) *
            </label>
            <input id="pitch-file" type="file" accept="application/pdf,.pdf" onChange={handlePitchUpload} aria-describedby="pitch-hint" aria-required="true" className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
            <span id="pitch-hint" className="text-xs" style={{ color:"rgba(26,31,60,.4)" }}>PDF only, max 10 MB</span>
            {pitchFileName && <p className="mt-2 text-xs flex items-center gap-1.5" style={{ color:"#10B981" }}><FileText className="w-3 h-3" aria-hidden="true" /> {pitchFileName} - ready</p>}
          </div>
          <div>
            <label htmlFor="video-url" className="block text-sm font-semibold mb-1.5 flex items-center gap-1.5" style={{ color:"#1A1F3C" }}>
              <Film className="w-3.5 h-3.5" aria-hidden="true" /> Demo Video (YouTube / Loom)
            </label>
            <input id="video-url" style={iStyle} value={form.video_url} onChange={e=>setForm(f=>({...f,video_url:e.target.value}))} placeholder="https://youtube.com/..." type="url" />
          </div>
        </div>
      </section>
    </>
  );
}
