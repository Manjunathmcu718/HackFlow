import { motion } from "framer-motion";
import { Send, X } from "lucide-react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { Announcement, AnnouncementPriority } from "@/mocks/types";

type AnnouncementForm = {
  title: string;
  message: string;
  priority: AnnouncementPriority;
};

type AnnouncementModalProps = {
  announcement: AnnouncementForm;
  announceMutation: UseMutationResult<Announcement, Error, AnnouncementForm, unknown>;
  setAnnouncement: React.Dispatch<React.SetStateAction<AnnouncementForm>>;
  setShowAnnounce: (show: boolean) => void;
};

export default function AnnouncementModal({ announcement, announceMutation, setAnnouncement, setShowAnnounce }: AnnouncementModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:"rgba(0,0,0,.4)",backdropFilter:"blur(4px)" }} role="dialog" aria-modal="true" aria-labelledby="ann-title">
      <motion.div initial={{scale:.9,opacity:0}} animate={{scale:1,opacity:1}} className="rounded-3xl p-6 max-w-md w-full" style={{ background:"#fff",boxShadow:"0 20px 60px rgba(0,0,0,.2)" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 id="ann-title" className="font-heading font-bold text-lg" style={{ color:"#1A1F3C" }}>Broadcast Announcement</h3>
          <button onClick={()=>setShowAnnounce(false)} aria-label="Close"><X className="w-4 h-4" style={{ color:"rgba(26,31,60,.5)" }} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="ann-title-in" className="block text-sm font-semibold mb-1.5" style={{ color:"#1A1F3C" }}>Title</label>
            <input id="ann-title-in" value={announcement.title} onChange={e=>setAnnouncement(a=>({...a,title:e.target.value}))} placeholder="Important Update" className="w-full px-4 py-3 rounded-2xl text-sm outline-none" style={{ background:"#F8F7FF",border:"1.5px solid rgba(26,31,60,.14)",color:"#1A1F3C" }} />
          </div>
          <div>
            <label htmlFor="ann-msg" className="block text-sm font-semibold mb-1.5" style={{ color:"#1A1F3C" }}>Message</label>
            <textarea id="ann-msg" value={announcement.message} onChange={e=>setAnnouncement(a=>({...a,message:e.target.value}))} placeholder="Write your announcement..." style={{ background:"#F8F7FF",border:"1.5px solid rgba(26,31,60,.14)",borderRadius:12,padding:"12px 16px",color:"#1A1F3C",fontSize:14,outline:"none",width:"100%",minHeight:100,resize:"vertical" }} />
          </div>
          <div>
            <label htmlFor="ann-prio" className="block text-sm font-semibold mb-1.5" style={{ color:"#1A1F3C" }}>Priority</label>
            <select id="ann-prio" value={announcement.priority} onChange={e=>setAnnouncement(a=>({...a,priority:e.target.value as AnnouncementPriority}))} className="w-full px-4 py-3 rounded-2xl text-sm outline-none" style={{ background:"#F8F7FF",border:"1.5px solid rgba(26,31,60,.14)",color:"#1A1F3C" }}>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={()=>setShowAnnounce(false)} className="btn-outline flex-1 px-4 py-2.5 text-sm">Cancel</button>
          <button onClick={()=>announceMutation.mutate(announcement)} disabled={announceMutation.isPending||!announcement.title.trim()} className="btn-primary flex items-center gap-2 flex-1 justify-center px-4 py-2.5 text-sm disabled:opacity-60">
            <Send className="w-4 h-4" aria-hidden="true" /> {announceMutation.isPending?"Sending...":"Send"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
