import { motion } from "framer-motion";
import type { UseMutationResult } from "@tanstack/react-query";
import type { Submission } from "@/mocks/types";

type JudgeDialogsProps = {
  selected: Submission;
  total: number;
  showConfirm: boolean;
  showDeck: boolean;
  scoreMutation: UseMutationResult<void, Error, void, unknown>;
  setShowConfirm: (show: boolean) => void;
  setShowDeck: (show: boolean) => void;
};

export default function JudgeDialogs({
  selected,
  total,
  showConfirm,
  showDeck,
  scoreMutation,
  setShowConfirm,
  setShowDeck,
}: JudgeDialogsProps) {
  return (
    <>
      {showConfirm&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:"rgba(0,0,0,.4)",backdropFilter:"blur(4px)" }} role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <motion.div initial={{ scale:.9,opacity:0 }} animate={{ scale:1,opacity:1 }} className="rounded-3xl p-6 max-w-sm w-full" style={{ background:"#fff",boxShadow:"0 20px 60px rgba(0,0,0,.2)" }}>
            <h3 id="confirm-title" className="font-heading font-bold text-lg mb-2" style={{ color:"#1A1F3C" }}>Confirm Score Submission</h3>
            <p className="text-sm mb-6" style={{ color:"rgba(26,31,60,.6)" }}>
              Submit score of <strong>{total}/40</strong> for <strong>{selected.project_title}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={()=>setShowConfirm(false)} className="btn-outline flex-1 px-4 py-2.5 text-sm">Cancel</button>
              <button onClick={()=>scoreMutation.mutate()} disabled={scoreMutation.isPending} className="btn-primary flex-1 px-4 py-2.5 text-sm disabled:opacity-60">
                {scoreMutation.isPending?"Submitting...":"Confirm"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showDeck&&selected.pitch_deck_url&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:"rgba(0,0,0,.5)",backdropFilter:"blur(4px)" }} role="dialog" aria-modal="true" aria-labelledby="deck-title">
          <motion.div initial={{ scale:.95,opacity:0 }} animate={{ scale:1,opacity:1 }} className="rounded-3xl overflow-hidden w-full max-w-5xl max-h-[90vh] flex flex-col" style={{ background:"#fff",boxShadow:"0 20px 60px rgba(0,0,0,.25)" }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor:"rgba(26,31,60,.08)" }}>
              <div>
                <h3 id="deck-title" className="font-heading font-bold text-lg" style={{ color:"#1A1F3C" }}>Pitch Deck Viewer</h3>
                <p className="text-xs" style={{ color:"rgba(26,31,60,.5)" }}>{selected.project_title}</p>
              </div>
              <button onClick={()=>setShowDeck(false)} className="btn-outline px-4 py-2 text-sm">Close</button>
            </div>
            <div className="flex-1 min-h-0 bg-slate-50">
              <iframe title={`${selected.project_title} pitch deck`} src={selected.pitch_deck_url} className="w-full h-[70vh]" loading="lazy" />
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
