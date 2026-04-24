import { useState } from "react";
import axios from "axios";

const API = "http://localhost:8081/api/bookings";

const RESTRICTED_TYPES = ["LECTURE_HALL", "LAB", "AUDITORIUM"];

const RESOURCES = [
  { id: "study-room-A", label: "Study Room A", type: "STUDY_AREA" },
  { id: "study-room-B", label: "Study Room B", type: "STUDY_AREA" },
  { id: "meeting-room-1", label: "Meeting Room 1", type: "MEETING_ROOM" },
  { id: "meeting-room-2", label: "Meeting Room 2", type: "MEETING_ROOM" },
  { id: "lecture-hall-101", label: "Lecture Hall 101", type: "LECTURE_HALL" },
  { id: "lecture-hall-202", label: "Lecture Hall 202", type: "LECTURE_HALL" },
  { id: "lab-A", label: "Computer Lab A", type: "LAB" },
  { id: "lab-B", label: "Computer Lab B", type: "LAB" },
  { id: "auditorium", label: "Main Auditorium", type: "AUDITORIUM" },
];

export default function CreateBooking({ user, setActivePage }) {
  const [form, setForm] = useState({
    resourceId: "", purpose: "", expectedAttendees: 1,
    startTime: "", endTime: "", reason: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedResource = RESOURCES.find(r => r.id === form.resourceId);
  const isRestricted = selectedResource && RESTRICTED_TYPES.includes(selectedResource.type);
  const isStudent = user.role === "STUDENT";
  const needsJustification = isStudent && isRestricted;

  const validate = () => {
    if (needsJustification) {
      if (parseInt(form.expectedAttendees) < 10)
        return "Students need at least 10 attendees to book this facility.";
      if (!form.reason.trim())
        return "Please provide a specific reason for booking this facility.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true); setMessage(""); setError("");
    try {
      const purpose = needsJustification
        ? `${form.purpose} | Reason: ${form.reason}`
        : form.purpose;

      await axios.post(`${API}?userId=${user.id}`, {
        resourceId: form.resourceId,
        purpose,
        expectedAttendees: parseInt(form.expectedAttendees),
        startTime: form.startTime + ":00",
        endTime: form.endTime + ":00"
      });
      setMessage("Booking request submitted successfully! Waiting for admin approval.");
      setForm({ resourceId: "", purpose: "", expectedAttendees: 1, startTime: "", endTime: "", reason: "" });
      setTimeout(() => setActivePage("myBookings"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "8px",
    border: "1.5px solid #e0e0e0", fontSize: "14px", outline: "none",
    background: "white", fontFamily: "inherit"
  };
  const labelStyle = {
    fontSize: "13px", fontWeight: "600", color: "#444",
    marginBottom: "6px", display: "block"
  };

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <div style={{ fontSize: "13px", color: "#888" }}>Booking Management</div>
        <div style={{ fontSize: "26px", fontWeight: "700", color: "#1a1a2e" }}>New Booking Request</div>
      </div>

      {/* Student Policy Notice */}
      {isStudent && (
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "14px 18px", marginBottom: "20px" }}>
          <div style={{ fontWeight: "700", color: "#1e40af", marginBottom: "4px" }}>
            📌 Student Booking Policy
          </div>
          <div style={{ fontSize: "13px", color: "#1e40af", lineHeight: "1.6" }}>
            ✅ <b>Free to book:</b> Study Rooms, Meeting Rooms<br />
            ⚠️ <b>Restricted (need 10+ attendees + reason):</b> Lecture Halls, Labs, Auditorium
          </div>
        </div>
      )}

      <div style={{ background: "white", borderRadius: "16px", padding: "32px", maxWidth: "620px", boxShadow: "0 2px 12px rgba(37,99,235,0.08)" }}>

        {/* Booking as */}
        <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "10px 14px", marginBottom: "20px", fontSize: "13px", color: "#555" }}>
          📝 Booking as: <strong>{user.name}</strong> ({user.role})
        </div>

        {message && (
          <div style={{ background: "#d1fae5", color: "#065f46", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontWeight: "600" }}>
            ✅ {message}
          </div>
        )}
        {error && (
          <div style={{ background: "#fee2e2", color: "#991b1b", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontWeight: "600" }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Resource Select */}
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Select Resource</label>
            <select style={{ ...inputStyle }}
              value={form.resourceId}
              onChange={e => setForm({ ...form, resourceId: e.target.value })} required>
              <option value="">-- Choose a resource --</option>
              <optgroup label="📚 Study Areas">
                {RESOURCES.filter(r => r.type === "STUDY_AREA").map(r =>
                  <option key={r.id} value={r.id}>{r.label}</option>
                )}
              </optgroup>
              <optgroup label="🤝 Meeting Rooms">
                {RESOURCES.filter(r => r.type === "MEETING_ROOM").map(r =>
                  <option key={r.id} value={r.id}>{r.label}</option>
                )}
              </optgroup>
              <optgroup label="🏫 Lecture Halls">
                {RESOURCES.filter(r => r.type === "LECTURE_HALL").map(r =>
                  <option key={r.id} value={r.id}>{r.label} {isStudent ? "⚠️" : ""}</option>
                )}
              </optgroup>
              <optgroup label="🔬 Labs">
                {RESOURCES.filter(r => r.type === "LAB").map(r =>
                  <option key={r.id} value={r.id}>{r.label} {isStudent ? "⚠️" : ""}</option>
                )}
              </optgroup>
              <optgroup label="🎭 Auditorium">
                {RESOURCES.filter(r => r.type === "AUDITORIUM").map(r =>
                  <option key={r.id} value={r.id}>{r.label} {isStudent ? "⚠️" : ""}</option>
                )}
              </optgroup>
            </select>
          </div>

          {/* Restricted Warning */}
          {needsJustification && (
            <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px" }}>
              <div style={{ fontSize: "13px", color: "#92400e", fontWeight: "700" }}>
                ⚠️ Restricted Facility — Extra Details Required
              </div>
              <div style={{ fontSize: "12px", color: "#92400e", marginTop: "4px" }}>
                Minimum 10 attendees and a specific reason are required for students.
              </div>
            </div>
          )}

          {/* Purpose */}
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Purpose</label>
            <input style={inputStyle}
              placeholder="e.g. Group study, Workshop, Project presentation"
              value={form.purpose}
              onChange={e => setForm({ ...form, purpose: e.target.value })} required />
          </div>

          {/* Attendees */}
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>
              Expected Attendees
              {needsJustification && <span style={{ color: "#ef4444", marginLeft: "4px" }}>(min. 10 required)</span>}
            </label>
            <input style={inputStyle} type="number"
              min={needsJustification ? 10 : 1}
              value={form.expectedAttendees}
              onChange={e => setForm({ ...form, expectedAttendees: e.target.value })} required />
          </div>

          {/* Extra Reason for restricted */}
          {needsJustification && (
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>
                Specific Reason <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea style={{ ...inputStyle, height: "80px", resize: "vertical" }}
                placeholder="Explain why you need this facility (e.g. Organizing a club seminar for 15 students)"
                value={form.reason}
                onChange={e => setForm({ ...form, reason: e.target.value })} />
            </div>
          )}

          {/* Time Range */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
            <div>
              <label style={labelStyle}>Start Time</label>
              <input style={inputStyle} type="datetime-local"
                value={form.startTime}
                onChange={e => setForm({ ...form, startTime: e.target.value })} required />
            </div>
            <div>
              <label style={labelStyle}>End Time</label>
              <input style={inputStyle} type="datetime-local"
                value={form.endTime}
                onChange={e => setForm({ ...form, endTime: e.target.value })} required />
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "13px",
            background: loading ? "#93c5fd" : "linear-gradient(135deg, #1e3a8a, #2563eb)",
            color: "white", border: "none", borderRadius: "10px",
            fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit"
          }}>
            {loading ? "⏳ Submitting..." : "📅 Submit Booking Request"}
          </button>
        </form>
      </div>
    </div>
  );
}