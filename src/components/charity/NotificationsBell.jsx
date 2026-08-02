import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { base44 } from "@/api/base44Client";

const LS_KEY = "rts_notif_last_seen";

function timeAgo(d) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(d).toLocaleDateString();
}

const ICONS = {
  milestone: "🏆",
  story: "📸",
  donation: "🙏",
  general: "✨",
};

export default function NotificationsBell() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [lastSeen, setLastSeen] = useState(
    () => localStorage.getItem(LS_KEY) || "1970-01-01T00:00:00.000Z"
  );
  const wrapRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const list = await base44.entities.Notification.list("-created_date", 20);
        if (mounted) setItems(list || []);
      } catch {
        /* ignore */
      }
    };
    load();
    const unsub = base44.entities.Notification.subscribe
      ? base44.entities.Notification.subscribe(() => load())
      : null;
    return () => {
      mounted = false;
      if (typeof unsub === "function") unsub();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const unreadCount = items.filter(
    (n) => new Date(n.created_date) > new Date(lastSeen)
  ).length;

  const markAllRead = () => {
    const now = new Date().toISOString();
    localStorage.setItem(LS_KEY, now);
    setLastSeen(now);
  };

  return (
    <div className="notif-wrap" ref={wrapRef} style={{ position: "relative" }}>
      <button
        type="button"
        className="notif-bell"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        onClick={() => {
          setOpen((o) => {
            if (!o) markAllRead();
            return !o;
          });
        }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notif-dot">{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notif-panel">
          <div className="notif-panel__head">
            <h4>Updates from the home</h4>
            <button type="button" className="notif-panel__mark" onClick={markAllRead}>
              Mark all read
            </button>
          </div>
          <div className="notif-list">
            {items.length === 0 ? (
              <div className="notif-empty">
                No updates yet. <br /> Check back soon — we share milestones &amp; stories here.
              </div>
            ) : (
              items.map((n) => {
                const isUnread = new Date(n.created_date) > new Date(lastSeen);
                return (
                  <div key={n.id} className={`notif-item${isUnread ? " is-unread" : ""}`}>
                    <div className="notif-item__icon">
                      {ICONS[n.type] || ICONS.general}
                    </div>
                    <div className="notif-item__body">
                      <p className="notif-item__title">{n.title}</p>
                      {n.body && <p className="notif-item__text">{n.body}</p>}
                      <p className="notif-item__time">{timeAgo(n.created_date)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}