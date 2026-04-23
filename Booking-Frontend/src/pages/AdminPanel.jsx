import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8081/api/bookings";

export default function AdminPanel() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [rejectId, setRejectId] = useState(null);
  const [reason, setReason] = useState("");

  const fetchAll = () => {
    axios.get(API).then(r => setBookings(r.data)).catch(() => {});
  };

  useEffect(() => { fetchAll(); }, []);

  const approve = async (id) => {
    try {
      await axios.put(`${API}/${id}/approve`);
      setMessage("Booking approved!");
      fetchAll();
    } catch (err) { setMessage(err.response?.data?.error || "Error"); }
  };

  const reject = async (id) => {
    try {
      await axios.put(`${API}/${id}/reject`, { reason });
      setMessage("Booking rejected!");
      setRejectId(null); setReason("");
      fetchAll();
    } catch (err) { setMessage(err.response?.data?.error || "Error"); }
  };

  const deleteBooking = async (id) => {
    if (!confirm("Delete this booking?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      setMessage("Booking deleted!");
      fetchAll();
    } catch (err) { setMessage("Error deleting"); }
  };

  const statusColor = (s) => ({
    PENDING: { bg: "#fef3c7", color: "#92400e" },
    APPROVED: { bg: "#d1fae5", color: "#065f46" },
    REJECTED: { bg: "#fee2e2", color: "#991b1b" },
    CANCELLED: { bg: "#f3f4f6", color: "#374151" }
  }[s] || { bg: "#f3f4f6", color: "#374151" });

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <div style={{ fontSize: "13px", color: "#888" }}>Administration</div>
        <div style={{ fontSize: "26px", fontWeight: "700", color: "#1a1a2e" }}>Admin Panel</div>
      </div>

      {message && <div style={{ background: "#d1fae5", color: "#065f46", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontWeight: "600" }}>✅ {message}</div>}

      {/* Reject Modal */}
      {rejectId && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "32px", width: "400px" }}>
            <div style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>Reject Booking</div>
            <textarea placeholder="Enter rejection reason..." value={reason} onChange={e => setReason(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.5px solid #e0e0e0", height: "100px", marginBottom: "16px", fontSize: "14px" }} />
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => reject(rejectId)} style={{ flex: 1, padding: "10px", background: "#ef4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>Confirm Reject</button>
              <button onClick={() => setRejectId(null)} style={{ flex: 1, padding: "10px", background: "#f3f4f6", color: "#333", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(109,40,217,0.08)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f5f3ff" }}>
              {["Resource", "Purpose", "User", "Time", "Attendees", "Status", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "13px", color: "#6d28d9", fontWeight: "600" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600" }}>{b.resourceId}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px" }}>{b.purpose}</td>
                <td style={{ padding: "12px 16px", fontSize: "13px", color: "#888" }}>{b.userId}</td>
                <td style={{ padding: "12px 16px", fontSize: "12px", color: "#888" }}>{b.startTime?.replace("T", " ")}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px" }}>{b.expectedAttendees}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", background: statusColor(b.status).bg, color: statusColor(b.status).color }}>{b.status}</span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {b.status === "PENDING" && (<>
                      <button onClick={() => approve(b.id)} style={{ padding: "5px 10px", background: "#d1fae5", color: "#065f46", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>✅ Approve</button>
                      <button onClick={() => setRejectId(b.id)} style={{ padding: "5px 10px", background: "#fee2e2", color: "#991b1b", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>❌ Reject</button>
                    </>)}
                    <button onClick={() => deleteBooking(b.id)} style={{ padding: "5px 10px", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>🗑️ Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr><td colSpan="7" style={{ padding: "24px", textAlign: "center", color: "#888" }}>No bookings found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}