/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/mockData";
import type { Announcement } from "@/mocks/types";

type Priority = "info" | "warning" | "urgent";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  priority: Priority;
  created_date: string;
  read: boolean;
}

interface NotificationContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  refresh: () => Promise<void>;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const STORAGE_KEY = "beetlex-seen-notifications";
const CHANNEL_NAME = "beetlex-notifications";
const PULSE_KEY = "beetlex-notification-pulse";

const NotificationContext = createContext<NotificationContextValue | null>(null);

function loadSeenIds() {
  if (typeof window === "undefined") {
    return new Set<string>();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set<string>();
    return new Set<string>(JSON.parse(raw) as string[]);
  } catch {
    return new Set<string>();
  }
}

function persistSeenIds(ids: Set<string>) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

function notify(announcement: { title: string; message: string; priority: Priority }) {
  if (announcement.priority === "urgent") {
    toast.error(`${announcement.title}: ${announcement.message}`);
    return;
  }

  if (announcement.priority === "warning") {
    toast.warning(`${announcement.title}: ${announcement.message}`);
    return;
  }

  toast.info(`${announcement.title}: ${announcement.message}`);
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const seenIdsRef = useRef<Set<string>>(loadSeenIds());
  const hydratedRef = useRef(false);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const mergeAnnouncements = useCallback((items: Array<{ id: string; title: string; message: string; priority: Priority; created_date: string }>) => {
    setNotifications(current => {
      const currentById = new Map(current.map(item => [item.id, item]));
      const next = items
        .slice()
        .sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime())
        .map(item => ({
          ...item,
          read: seenIdsRef.current.has(item.id) || currentById.get(item.id)?.read || false,
        }));

      if (hydratedRef.current) {
        const currentIds = new Set(current.map(item => item.id));
        next.forEach(item => {
          if (!currentIds.has(item.id)) {
            notify(item);
          }
        });
      }

      return next;
    });
  }, []);

  const refresh = useCallback(async () => {
    const announcements = await api.announcements.list() as Announcement[];
    mergeAnnouncements(announcements);
    hydratedRef.current = true;
  }, [mergeAnnouncements]);

  useEffect(() => {
    void refresh();

    const refreshFromPulse = () => void refresh();
    const handleStorage = (event: StorageEvent) => {
      if (event.key === PULSE_KEY) {
        refreshFromPulse();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(PULSE_KEY, refreshFromPulse as EventListener);

    if ("BroadcastChannel" in window) {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.onmessage = () => refreshFromPulse();
      channelRef.current = channel;
    }

    const intervalId = window.setInterval(refreshFromPulse, 15000);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(PULSE_KEY, refreshFromPulse as EventListener);
      window.clearInterval(intervalId);
      channelRef.current?.close();
      channelRef.current = null;
    };
  }, [refresh]);

  const markRead = useCallback((id: string) => {
    seenIdsRef.current.add(id);
    persistSeenIds(seenIdsRef.current);
    setNotifications(current => current.map(notification => (
      notification.id === id ? { ...notification, read: true } : notification
    )));
  }, []);

  const markAllRead = useCallback(() => {
    notifications.forEach(notification => seenIdsRef.current.add(notification.id));
    persistSeenIds(seenIdsRef.current);
    setNotifications(current => current.map(notification => ({ ...notification, read: true })));
  }, [notifications]);

  const unreadCount = useMemo(() => notifications.filter(notification => !notification.read).length, [notifications]);

  const value = useMemo<NotificationContextValue>(() => ({
    notifications,
    unreadCount,
    refresh,
    markRead,
    markAllRead,
  }), [markAllRead, markRead, notifications, unreadCount, refresh]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }

  return context;
}

export function broadcastNotificationRefresh() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PULSE_KEY, String(Date.now()));
  window.dispatchEvent(new Event(PULSE_KEY));

  if ("BroadcastChannel" in window) {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage({ type: "refresh" });
    channel.close();
  }
}
