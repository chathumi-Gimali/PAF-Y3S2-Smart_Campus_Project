import { useState } from "react";

export default function RaiseTicket({ user, setActivePage }) {
  const [form, setForm] = useState({ title: "", category: "", priority: "", location: "", description: "" });
  const [submitted, setSubmitted] = useState(false);

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid #e0e0e0", fontSize: "14px", outline: "none", background: "white" };
  const labelStyle = { fontSize: "13px", fontWeight: "600", color: "#444", marginBottom: "6px", display: "block" };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setActivePage("dashboard"), 2000);
  };

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <div style={{ fontSize: "13px", color: "#888" }}>Maintenance</div>
        <div style={{ fontSize: "26px", fontWeight: "700", color: "#1a1a2e" }}>Raise Incident Ticket</div>
      </div>

      <div style={{ background: "white", borderRadius: "16px", padding: "32px", maxWidth: "600px", boxShadow: "0 2px 12px rgba(37,99,235,0.08)" }}>
        {submitted && <div style={{ background: "#d1fae5", color: "#065f46", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontWeight: "600" }}>✅ Ticket submitted! A technician will be assigned shortly.</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Issue Title</label>
            <input style={inputStyle} placeholder="e.g. Projector not working in Lab A"
              value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                <option value="">-- Select --</option>
                <option>Electrical</option>
                <option>Plumbing</option>
                <option>IT / Equipment</option>
                <option>Air Conditioning</option>
                <option>Furniture</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Priority</label>
              <select style={inputStyle} value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} required>
                <option value="">-- Select --</option>
                <option>LOW</option>
                <option>MEDIUM</option>
                <option>HIGH</option>
                <option>CRITICAL</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Location</label>
            <input style={inputStyle} placeholder="e.g. Block A, Room 203"
              value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...inputStyle, height: "100px", resize: "vertical" }}
              placeholder="Describe the issue in detail..."
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          </div>

          <button type="submit" style={{ width: "100%", padding: "13px", background: "#2563eb", color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
            🎫 Submit Ticket
          </button>
        </form>
      </div>
    </div>
  );
}