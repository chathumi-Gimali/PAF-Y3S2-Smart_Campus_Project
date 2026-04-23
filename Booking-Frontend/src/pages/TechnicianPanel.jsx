import { useState } from "react";

const DUMMY_TICKETS = [
  { id: "T001", title: "Projector not working", category: "IT / Equipment", priority: "HIGH", location: "Lab A", status: "OPEN", raisedBy: "John Student" },
  { id: "T002", title: "AC not cooling", category: "Air Conditioning", priority: "MEDIUM", location: "Lecture Hall 101", status: "IN_PROGRESS", raisedBy: "Dr. Smith" },
  { id: "T003", title: "Broken chair", category: "Furniture", priority: "LOW", location: "Study Room B", status: "OPEN", raisedBy: "John Student" },
];

export default function TechnicianPanel({ user }) {
  const [tickets, setTickets] = useState(DUMMY_TICKETS);
  const [message, setMessage] = useState("");

  const updateStatus = (id, newStatus) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
    setMessage(`Ticket ${id} updated to ${newStatus}`);
  };

  const priorityColor = (p) => ({ HIGH: "#fee2e2", CRITICAL: "#fecaca", MEDIUM: "#fef3c7", LOW: "#d1fae5" }[p] || "#f3f4f6");
  const priorityText = (p) => ({ HIGH: "#991b1b", CRITICAL: "#7f1d1d", MEDIUM: "#92400e", LOW: "#065f46" }[p] || "#374151");
  const statusColor = (s) => ({ OPEN: "#eff6ff", IN_PROGRESS: "#fef3c7", RESOLVED: "#d1fae5", CLOSED: "#f3f4f6" }[s] || "#f3f4f6");
  const statusText = (s) => ({ OPEN: "#1e40af", IN_PROGRESS: "#92400e", RESOLVED: "#065f46", CLOSED: "#374151" }[s] || "#374151");

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <div style={{ fontSize: "13px", color: "#888" }}>Maintenance</div>
        <div style={{ fontSize: "26px", fontWeight: "700", color: "#1a1a2e" }}>My Assigned Tickets</div>
      </div>

      {message && <div style={{ background: "#d1fae5", color: "#065f46", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontWeight: "600" }}>✅ {message}</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {tickets.map(t => (
          <div key={t.id} style={{ background: "white", borderRadius: "16px", padding: "20px 24px", boxShadow: "0 2px 12px rgba(37,99,235,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <span style={{ fontWeight: "700", fontSize: "16px" }}>{t.title}</span>
                  <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", background: priorityColor(t.priority), color: priorityText(t.priority) }}>{t.priority}</span>
                </div>
                <div style={{ fontSize: "13px", color: "#888", marginBottom: "4px" }}>📍 {t.location} · 🏷️ {t.category}</div>
                <div style={{ fontSize: "12px", color: "#aaa" }}>Raised by: {t.raisedBy} · #{t.id}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <span style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", background: statusColor(t.status), color: statusText(t.status) }}>{t.status.replace("_", " ")}</span>
                {t.status === "OPEN" && (
                  <button onClick={() => updateStatus(t.id, "IN_PROGRESS")} style={{ padding: "7px 14px", background: "#fef3c7", color: "#92400e", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>▶ Start</button>
                )}
                {t.status === "IN_PROGRESS" && (
                  <button onClick={() => updateStatus(t.id, "RESOLVED")} style={{ padding: "7px 14px", background: "#d1fae5", color: "#065f46", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>✅ Resolve</button>
                )}
                {t.status === "RESOLVED" && (
                  <button onClick={() => updateStatus(t.id, "CLOSED")} style={{ padding: "7px 14px", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>🔒 Close</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}