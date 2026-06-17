import React, { useState } from "react";
import { Bell, X } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(current => !current)}
        className="hidden md:inline-flex items-center justify-center w-11 h-11 rounded-2xl transition-all"
        style={{ background: "rgba(26,31,60,.05)", border: "1px solid rgba(26,31,60,.08)", color: "rgba(26,31,60,.65)" }}
        aria-label="Open notifications"
        aria-expanded={open}
      >
        <Bell className="w-4 h-4" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-[360px] max-w-[90vw] rounded-3xl overflow-hidden shadow-2xl z-50" style={{ background: "#fff", border: "1px solid rgba(26,31,60,.08)" }}>
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(26,31,60,.08)" }}>
            <div>
              <p className="text-sm font-bold" style={{ color: "#1A1F3C" }}>Notifications</p>
              <p className="text-xs" style={{ color: "rgba(26,31,60,.45)" }}>{unreadCount} unread</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={markAllRead} className="text-xs font-semibold px-3 py-1.5 rounded-full btn-outline">Mark all read</button>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close notifications" className="p-1 rounded-full" style={{ color: "rgba(26,31,60,.5)" }}>
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="max-h-[360px] overflow-auto p-2 space-y-2">
            {notifications.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: "rgba(26,31,60,.45)" }}>No notifications yet.</p>
            ) : notifications.map(notification => (
              <button
                key={notification.id}
                type="button"
                onClick={() => markRead(notification.id)}
                className="w-full text-left p-3 rounded-2xl transition-all"
                style={{ background: notification.read ? "rgba(26,31,60,.02)" : "rgba(244,98,42,.06)", border: "1px solid rgba(26,31,60,.06)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#1A1F3C" }}>{notification.title}</p>
                    <p className="text-xs mt-1" style={{ color: "rgba(26,31,60,.55)" }}>{notification.message}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full pill-coral">{notification.priority}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
