import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, CheckCheck, Timer, MessageCircle, User, AlertTriangle, RefreshCw, X } from "lucide-react";
import { supabase } from "../../supabaseClient";

const TYPE_CONFIG = {
  focus_complete: { icon: Timer,         bg: "#f3e8ff", iconColor: "#9333ea" },
  new_comment:    { icon: MessageCircle, bg: "#dbeafe", iconColor: "#2563eb" },
  task_assigned:  { icon: User,          bg: "#dcfce7", iconColor: "#16a34a" },
  status_change:  { icon: RefreshCw,     bg: "#fef3c7", iconColor: "#d97706" },
  due_date:       { icon: AlertTriangle, bg: "#fee2e2", iconColor: "#dc2626" },
};

const formatTime = (dateString) => {
  const diff = Date.now() - new Date(dateString).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
};

const NotiRow = ({ n, onRead, onMarkRead, onDelete }) => {
  const [hovered, setHovered] = useState(false);
  const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.status_change;
  const Icon = cfg.icon;

  return (
    <div
      onClick={onRead}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "flex-start", gap: 12,
        padding: "12px 16px", borderBottom: "1px solid #f3f4f6",
        background: hovered ? "#f9fafb" : (!n.is_read ? "rgba(238,242,255,0.5)" : "#fff"),
        cursor: "pointer", transition: "background 0.1s",
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
        background: cfg.bg, display: "flex", alignItems: "center",
        justifyContent: "center", marginTop: 2,
      }}>
        <Icon size={16} color={cfg.iconColor} strokeWidth={1.8} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 13, margin: 0, lineHeight: 1.45,
          fontWeight: n.is_read ? 400 : 600,
          color: n.is_read ? "#6b7280" : "#111827",
        }}>
          {n.title}
        </p>
        {n.message && (
          <p style={{
            fontSize: 12, color: "#9ca3af", margin: "3px 0 0",
            overflow: "hidden", display: "-webkit-box",
            WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          }}>
            {n.message}
          </p>
        )}
        <p style={{ fontSize: 11, color: "#c4c4c4", marginTop: 5, marginBottom: 0 }}>
          {formatTime(n.created_at)}
        </p>
      </div>

      <div style={{
        display: "flex", gap: 2, flexShrink: 0,
        opacity: hovered ? 1 : 0, transition: "opacity 0.15s",
      }}>
        {!n.is_read && (
          <button
            onClick={(e) => { e.stopPropagation(); onMarkRead(); }}
            title="Mark as read"
            style={{ padding: 4, background: "none", border: "none", cursor: "pointer", borderRadius: 4, display: "flex" }}
            onMouseEnter={e => e.currentTarget.style.background = "#e0e7ff"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            <CheckCheck size={13} color="#6366f1" />
          </button>
        )}
        <button
          onClick={onDelete}
          title="Delete"
          style={{ padding: 4, background: "none", border: "none", cursor: "pointer", borderRadius: 4, display: "flex" }}
          onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
        >
          <X size={13} color="#d1d5db" />
        </button>
      </div>

      {!n.is_read && (
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#6366f1", flexShrink: 0, marginTop: 10 }} />
      )}
    </div>
  );
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const dropdownRef = useRef(null);
  const isUpdating = useRef(false);

  const fetchNotifications = useCallback(async () => {
    if (isUpdating.current) return;
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);
    if (!error && data) setNotifications(data);
  }, []);

  useEffect(() => {
    fetchNotifications();
    const channel = supabase
      .channel("notifications_realtime_unified")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, () => {
        fetchNotifications();
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "notifications" }, (payload) => {
        if (!isUpdating.current) {
          setNotifications(prev =>
            prev.map(n => n.id === payload.new.id ? { ...n, ...payload.new } : n)
          );
        }
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "notifications" }, (payload) => {
        setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = async (id) => {
    isUpdating.current = true;
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    setTimeout(() => { isUpdating.current = false; }, 500);
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    if (!unreadIds.length) return;
    isUpdating.current = true;
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    await supabase.from("notifications").update({ is_read: true }).in("id", unreadIds);
    setTimeout(() => { isUpdating.current = false; }, 500);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    isUpdating.current = true;
    setNotifications(prev => prev.filter(n => n.id !== id));
    await supabase.from("notifications").delete().eq("id", id);
    setTimeout(() => { isUpdating.current = false; }, 500);
  };

  const handleClearRead = async () => {
    isUpdating.current = true;
    setNotifications(prev => prev.filter(n => !n.is_read));
    await supabase.from("notifications").delete().eq("is_read", true);
    setTimeout(() => { isUpdating.current = false; }, 500);
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>

      {/* Bell Button — outline style */}
      <button
        onClick={() => setShowDropdown(o => !o)}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        style={{
          position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 36, height: 36, borderRadius: 8,
          border: "none", cursor: "pointer",
          background: btnHovered ? "#f4f4f4" : "none",
          transition: "background 0.15s", padding: 0,
        }}
      >
        {/* outline Bell — strokeWidth ทำให้ดู outline เหมือนในภาพ */}
        <Bell size={22} color="#374151" strokeWidth={1.6} />
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: -2, right: -2,
            minWidth: 17, height: 17,
            background: "#ef4444", color: "#fff",
            fontSize: 10, fontWeight: 700, borderRadius: 9999,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0 3px",
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div style={{
          position: "absolute", right: 0, top: "calc(100% + 8px)",
          width: 380, background: "#fff",
          borderRadius: 12, border: "1px solid #e5e7eb",
          boxShadow: "0 8px 30px rgba(0,0,0,0.10)",
          zIndex: 9999, overflow: "hidden",
        }}>

          {/* Header — เหมือนในภาพ: "Notifications" พร้อม Bell outline */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 16px", borderBottom: "1px solid #f3f4f6",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Bell size={16} color="#374151" strokeWidth={1.6} />
              <span style={{ fontWeight: 600, fontSize: 14, color: "#1f2937" }}>Notifications</span>
              {unreadCount > 0 && (
                <span style={{
                  background: "#fee2e2", color: "#dc2626",
                  fontSize: 11, padding: "1px 7px", borderRadius: 9999, fontWeight: 500,
                }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6366f1", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}
                onMouseEnter={e => e.currentTarget.style.color = "#4f46e5"}
                onMouseLeave={e => e.currentTarget.style.color = "#6366f1"}
              >
                <CheckCheck size={13} /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: 340, overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "52px 16px", textAlign: "center" }}>
                <Bell
                  size={38}
                  color="#d1d5db"
                  strokeWidth={1.4}
                  style={{ margin: "0 auto 14px", display: "block" }}
                />
                <p style={{ fontSize: 15, color: "#9ca3af", fontWeight: 600, margin: 0 }}>
                  No notifications yet
                </p>
                <p style={{ fontSize: 13, color: "#c4c4c4", marginTop: 5 }}>
                  Activity will appear here
                </p>
              </div>
            ) : notifications.map(n => (
              <NotiRow
                key={n.id}
                n={n}
                onRead={() => !n.is_read && handleMarkAsRead(n.id)}
                onMarkRead={() => handleMarkAsRead(n.id)}
                onDelete={(e) => handleDelete(n.id, e)}
              />
            ))}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div style={{
              padding: "10px 16px", borderTop: "1px solid #f3f4f6",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "#fafafa",
            }}>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>
                {notifications.length} total · {unreadCount} unread
              </span>
              <button
                onClick={handleClearRead}
                style={{ fontSize: 12, color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
                onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}
              >
                Clear read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;