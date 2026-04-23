import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:8081/api/notifications";

export default function NotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API}?userId=${userId}`);
      setNotifications(res.data);
      setUnread(res.data.filter(n => !n.read).length);
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  const markAllRead = async () => {
    try {
      await axios.put(`${API}/mark-all-read?userId=${userId}`);
      fetchNotifications();
    } catch {}
  };

  const markRead = async (id) => {
    try {
      await axios.put(`${API}/${id}/read`);
      fetchNotifications();
    } catch {}
  };

  const typeIcon = (type) => ({
    BOOKING_APPROVED:  "✅",
    BOOKING_REJECTED:  "❌",
    BOOKING_PENDING:   "📅",
    BOOKING_CANCELLED: "🚫",
    TICKET_UPDATED:    "🔧",
  }[type] || "🔔");

  const typeBg = (type) => ({
    BOOKING_APPROVED:  "#f0fdf4",
    BOOKING_REJECTED:  "#fef2f2",
    BOOKING_PENDING:   "#eff6ff",
    BOOKING_CANCELLED: "#f9fafb",
    TICKET_UPDATED:    "#fefce8",
  }[type] || "#eff6ff");

  return (
    <div style={{ position: "relative" }}>

      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "relative",
          background: open ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: "10px",
          width: "38px",
          height: "38px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "17px",
          transition: "background 0.2s"
        }}
      >
        🔔
        {unread > 0 && (
          <span style={{
            position: "absolute",
            top: "-6px",
            right: "-6px",
            background: "#ef4444",
            color: "white",
            borderRadius: "50%",
            width: "18px",
            height: "18px",
            fontSize: "10px",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
          }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {open && (
        <>
          {/* Backdrop to close on outside click */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9998
            }}
          />

          {/* Panel */}
          <div style={{
            position: "fixed",
            bottom: "80px",
            left: "250px",
            width: "340px",
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)",
            zIndex: 9999,
            overflow: "hidden",
            border: "1px solid #f0f0f0"
          }}>

            {/* Header */}
            <div style={{
              padding: "16px 20px",
              borderBottom: "1px solid #f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#fafafa"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "16px" }}>🔔</span>
                <span style={{ fontWeight: "700", fontSize: "15px", color: "#1a1a2e" }}>
                  Notifications
                </span>
                {unread > 0 && (
                  <span style={{
                    background: "#ef4444",
                    color: "white",
                    borderRadius: "20px",
                    padding: "2px 8px",
                    fontSize: "11px",
                    fontWeight: "700"
                  }}>
                    {unread} new
                  </span>
                )}
              </div>
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  style={{
                    fontSize: "12px",
                    color: "#2563eb",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "600",
                    padding: "4px 8px",
                    borderRadius: "6px"
                  }}
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div style={{ maxHeight: "380px", overflowY: "auto" }}>
              {notifications.length === 0 ? (
                <div style={{
                  padding: "40px 20px",
                  textAlign: "center",
                  color: "#888"
                }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔕</div>
                  <div style={{ fontSize: "14px", fontWeight: "600" }}>No notifications yet</div>
                  <div style={{ fontSize: "12px", marginTop: "4px", color: "#aaa" }}>
                    You'll be notified about booking updates here
                  </div>
                </div>
              ) : (
                notifications.map((n, index) => (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    style={{
                      padding: "14px 20px",
                      borderBottom: index < notifications.length - 1 ? "1px solid #f5f5f5" : "none",
                      background: n.read ? "white" : typeBg(n.type),
                      cursor: "pointer",
                      transition: "background 0.15s"
                    }}
                  >
                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      {/* Icon */}
                      <div style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: n.read ? "#f3f4f6" : "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        flexShrink: 0,
                        boxShadow: n.read ? "none" : "0 2px 8px rgba(0,0,0,0.08)"
                      }}>
                        {typeIcon(n.type)}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontWeight: "600",
                          fontSize: "13px",
                          color: "#1a1a2e",
                          marginBottom: "3px"
                        }}>
                          {n.title}
                        </div>
                        <div style={{
                          fontSize: "12px",
                          color: "#666",
                          lineHeight: "1.5",
                          marginBottom: "4px"
                        }}>
                          {n.message}
                        </div>
                        <div style={{ fontSize: "11px", color: "#aaa" }}>
                          {new Date(n.createdAt).toLocaleString()}
                        </div>
                      </div>

                      {/* Unread dot */}
                      {!n.read && (
                        <div style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#2563eb",
                          flexShrink: 0,
                          marginTop: "4px"
                        }} />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div style={{
                padding: "10px 20px",
                borderTop: "1px solid #f0f0f0",
                background: "#fafafa",
                textAlign: "center"
              }}>
                <span style={{ fontSize: "12px", color: "#aaa" }}>
                  {notifications.length} total notification{notifications.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}