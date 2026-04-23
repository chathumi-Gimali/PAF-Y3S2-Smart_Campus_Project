import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8081/api/bookings";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  const fetchBookings = () => {
    axios.get(`${API}/my?userId=user123`).then(r => setBookings(r.data)).catch(() => {});
  };

  useEffect(() => { fetchBookings(); }, []);

  const cancelBooking = async (id) => {
    try {
      await axios.put(`${API}/${id}/cancel?userId=user123`);
      setMessage("Booking cancelled!");
      fetchBookings();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error cancelling");
    }
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
        <div style={{ fontSize: "13px", color: "#888" }}>Booking Management</div>
        <div style={{ fontSize: "26px", fontWeight: "700", color: "#1a1a2e" }}>My Bookings</div>
      </div>

      {message && <div style={{ background: "#d1fae5", color: "#065f46", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontWeight: "600" }}>✅ {message}</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {bookings.length === 0 && (
          <div style={{ background: "white", borderRadius: "16px", padding: "40px", textAlign: "center", color: "#888", boxShadow: "0 2px 12px rgba(109,40,217,0.08)" }}>
            No bookings found. Create your first booking!
          </div>
        )}
        {bookings.map(b => (
          <div key={b.id} style={{ background: "white", borderRadius: "16px", padding: "20px 24px", boxShadow: "0 2px 12px rgba(109,40,217,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "4px" }}>{b.resourceId}</div>
              <div style={{ color: "#888", fontSize: "13px", marginBottom: "4px" }}>{b.purpose}</div>
              <div style={{ color: "#aaa", fontSize: "12px" }}>{b.startTime?.replace("T", " ")} → {b.endTime?.replace("T", " ")}</div>
              {b.rejectionReason && <div style={{ color: "#991b1b", fontSize: "12px", marginTop: "4px" }}>Reason: {b.rejectionReason}</div>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", background: statusColor(b.status).bg, color: statusColor(b.status).color }}>{b.status}</span>
              {b.status === "APPROVED" && (
                <button onClick={() => cancelBooking(b.id)} style={{ padding: "8px 16px", background: "#fee2e2", color: "#991b1b", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>Cancel</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}