import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8081/api/bookings";

function StatCard({ label, value, color, icon }) {
  return (
    <div style={{
      background: "white", borderRadius: "16px", padding: "24px",
      boxShadow: "0 2px 12px rgba(37,99,235,0.08)", flex: 1
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "13px", color: "#888", marginBottom: "8px" }}>{label}</div>
          <div style={{ fontSize: "32px", fontWeight: "700", color: "#1a1a2e" }}>{value}</div>
        </div>
        <div style={{
          width: "52px", height: "52px", borderRadius: "50%",
          background: color, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "22px"
        }}>{icon}</div>
      </div>
    </div>
  );
}

export default function Dashboard({ user, setActivePage }) {
  const [bookings, setBookings] = useState([]);
  const { role } = user;

  useEffect(() => {
    axios.get(API).then(r => setBookings(r.data)).catch(() => {});
  }, []);

  const total = bookings.length;
  const pending = bookings.filter(b => b.status === "PENDING").length;
  const approved = bookings.filter(b => b.status === "APPROVED").length;
  const cancelled = bookings.filter(b => b.status === "CANCELLED").length;

  // Role-based quick actions
  const quickActions = {
    STUDENT: [
      { label: "➕ New Booking", page: "createBooking", bg: "#2563eb", color: "white" },
      { label: "📋 My Bookings", page: "myBookings", bg: "#eff6ff", color: "#2563eb" },
      { label: "🎫 Raise Ticket", page: "raiseTicket", bg: "#eff6ff", color: "#2563eb" },
    ],
    LECTURER: [
      { label: "➕ New Booking", page: "createBooking", bg: "#2563eb", color: "white" },
      { label: "📋 My Bookings", page: "myBookings", bg: "#eff6ff", color: "#2563eb" },
      { label: "🎫 Raise Ticket", page: "raiseTicket", bg: "#eff6ff", color: "#2563eb" },
    ],
    ADMIN: [
      { label: "🛡️ Manage Bookings", page: "admin", bg: "#2563eb", color: "white" },
    ],
    TECHNICIAN: [
      { label: "🔧 View My Tickets", page: "technician", bg: "#2563eb", color: "white" },
    ],
  };

  const actions = quickActions[role] || [];

  // Role-based stat cards
  const showBookingStats = role === "STUDENT" || role === "LECTURER" || role === "ADMIN";
  const showTicketStats = role === "TECHNICIAN";

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <div style={{ fontSize: "13px", color: "#888" }}>Welcome back 👋</div>
        <div style={{ fontSize: "26px", fontWeight: "700", color: "#1a1a2e" }}>Dashboard</div>
      </div>

      {/* Stat Cards */}
      {showBookingStats && (
        <div style={{ display: "flex", gap: "20px", marginBottom: "28px", flexWrap: "wrap" }}>
          <StatCard label="Total Bookings" value={total} color="#ede9fe" icon="📅" />
          <StatCard label="Pending" value={pending} color="#fef3c7" icon="⏳" />
          <StatCard label="Approved" value={approved} color="#d1fae5" icon="✅" />
          <StatCard label="Cancelled" value={cancelled} color="#fee2e2" icon="❌" />
        </div>
      )}

      {showTicketStats && (
        <div style={{ display: "flex", gap: "20px", marginBottom: "28px", flexWrap: "wrap" }}>
          <StatCard label="Open Tickets" value={3} color="#eff6ff" icon="🎫" />
          <StatCard label="In Progress" value={1} color="#fef3c7" icon="🔧" />
          <StatCard label="Resolved" value={5} color="#d1fae5" icon="✅" />
          <StatCard label="Closed" value={2} color="#f3f4f6" icon="🔒" />
        </div>
      )}

      {/* Quick Actions */}
      <div style={{
        background: "white", borderRadius: "16px", padding: "24px",
        marginBottom: "24px", boxShadow: "0 2px 12px rgba(37,99,235,0.08)"
      }}>
        <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>Quick Actions</div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {actions.map(action => (
            <button
              key={action.page}
              onClick={() => setActivePage(action.page)}
              style={{
                padding: "10px 20px",
                background: action.bg,
                color: action.color,
                border: "none", borderRadius: "8px",
                cursor: "pointer", fontWeight: "600",
                fontSize: "14px"
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Bookings Table — only for booking roles */}
      {showBookingStats && (
        <div style={{
          background: "white", borderRadius: "16px", padding: "24px",
          boxShadow: "0 2px 12px rgba(37,99,235,0.08)"
        }}>
          <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>Recent Bookings</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#eff6ff" }}>
                {["Resource", "Purpose", "Start Time", "Attendees", "Status"].map(h => (
                  <th key={h} style={{
                    padding: "12px 16px", textAlign: "left",
                    fontSize: "13px", color: "#2563eb", fontWeight: "600"
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map(b => (
                <tr key={b.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "12px 16px", fontSize: "14px" }}>{b.resourceId}</td>
                  <td style={{ padding: "12px 16px", fontSize: "14px" }}>{b.purpose}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#888" }}>
                    {b.startTime?.replace("T", " ")}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "14px" }}>{b.expectedAttendees}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      padding: "4px 10px", borderRadius: "20px",
                      fontSize: "12px", fontWeight: "600",
                      background:
                        b.status === "APPROVED" ? "#d1fae5" :
                        b.status === "PENDING" ? "#fef3c7" :
                        b.status === "REJECTED" ? "#fee2e2" : "#f3f4f6",
                      color:
                        b.status === "APPROVED" ? "#065f46" :
                        b.status === "PENDING" ? "#92400e" :
                        b.status === "REJECTED" ? "#991b1b" : "#374151"
                    }}>{b.status}</span>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: "24px", textAlign: "center", color: "#888" }}>
                    No bookings yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Technician recent tickets */}
      {showTicketStats && (
        <div style={{
          background: "white", borderRadius: "16px", padding: "24px",
          boxShadow: "0 2px 12px rgba(37,99,235,0.08)"
        }}>
          <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>Recent Tickets</div>
          {[
            { title: "Projector not working", location: "Lab A", priority: "HIGH", status: "OPEN" },
            { title: "AC not cooling", location: "Lecture Hall 101", priority: "MEDIUM", status: "IN_PROGRESS" },
            { title: "Broken chair", location: "Study Room B", priority: "LOW", status: "OPEN" },
          ].map((t, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between",
              padding: "12px 0", borderBottom: "1px solid #f0f0f0"
            }}>
              <div>
                <div style={{ fontWeight: "600", fontSize: "14px" }}>{t.title}</div>
                <div style={{ fontSize: "12px", color: "#888" }}>📍 {t.location}</div>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{
                  padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700",
                  background: t.priority === "HIGH" ? "#fee2e2" : t.priority === "MEDIUM" ? "#fef3c7" : "#d1fae5",
                  color: t.priority === "HIGH" ? "#991b1b" : t.priority === "MEDIUM" ? "#92400e" : "#065f46"
                }}>{t.priority}</span>
                <span style={{
                  padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600",
                  background: "#eff6ff", color: "#1e40af"
                }}>{t.status.replace("_", " ")}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}