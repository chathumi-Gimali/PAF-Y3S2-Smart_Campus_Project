export default function Sidebar({ activePage, setActivePage, user, setUser }) {
  const { role, name } = user;

  const allMenuItems = {
    STUDENT: [
      { id: "dashboard", label: "Dashboard", icon: "📊" },
      { id: "createBooking", label: "New Booking", icon: "➕" },
      { id: "myBookings", label: "My Bookings", icon: "📋" },
      { id: "raiseTicket", label: "Raise Ticket", icon: "🎫" },
    ],
    LECTURER: [
      { id: "dashboard", label: "Dashboard", icon: "📊" },
      { id: "createBooking", label: "New Booking", icon: "➕" },
      { id: "myBookings", label: "My Bookings", icon: "📋" },
      { id: "raiseTicket", label: "Raise Ticket", icon: "🎫" },
    ],
    ADMIN: [
      { id: "dashboard", label: "Dashboard", icon: "📊" },
      { id: "admin", label: "Manage Bookings", icon: "🛡️" },
    ],
    TECHNICIAN: [
      { id: "dashboard", label: "Dashboard", icon: "📊" },
      { id: "technician", label: "My Tickets", icon: "🔧" },
    ],
  };

  const menuItems = allMenuItems[role] || [];

  const roleIcons = {
    STUDENT: "👨‍🎓",
    LECTURER: "👨‍🏫",
    ADMIN: "🛡️",
    TECHNICIAN: "🔧",
  };

  return (
    <div style={{
      width: "240px",
      minHeight: "100vh",
      background: "linear-gradient(180deg, #1e3a8a 0%, #2563eb 100%)",
      display: "flex",
      flexDirection: "column",
      padding: "20px 0",
      position: "sticky",
      top: 0
    }}>
      {/* Logo */}
      <div style={{
        padding: "0 20px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.15)"
      }}>
        <div style={{ fontSize: "18px", fontWeight: "700", color: "white" }}>
          🎓 Smart Campus
        </div>
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", marginTop: "4px" }}>
          Operations Hub · SLIIT
        </div>
      </div>

      {/* Role Badge */}
      <div style={{
        padding: "14px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.15)"
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "5px 12px", borderRadius: "20px",
          background: "rgba(255,255,255,0.15)"
        }}>
          <span style={{ fontSize: "14px" }}>{roleIcons[role]}</span>
          <span style={{ color: "white", fontSize: "12px", fontWeight: "600" }}>{role}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "16px 12px" }}>
        {menuItems.map(item => (
          <div
            key={item.id}
            onClick={() => setActivePage(item.id)}
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "12px 16px", borderRadius: "10px", marginBottom: "4px",
              cursor: "pointer",
              background: activePage === item.id ? "rgba(255,255,255,0.2)" : "transparent",
              color: "white",
              fontWeight: activePage === item.id ? "600" : "400",
              transition: "background 0.2s"
            }}
          >
            <span style={{ fontSize: "18px" }}>{item.icon}</span>
            <span style={{ fontSize: "14px" }}>{item.label}</span>
            {activePage === item.id && (
              <div style={{
                marginLeft: "auto", width: "6px", height: "6px",
                borderRadius: "50%", background: "white"
              }} />
            )}
          </div>
        ))}
      </nav>

      {/* User Info + Logout */}
      <div style={{
        padding: "16px 20px",
        borderTop: "1px solid rgba(255,255,255,0.15)"
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px"
        }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "50%",
            background: "rgba(255,255,255,0.2)", display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: "16px"
          }}>
            {roleIcons[role]}
          </div>
          <div>
            <div style={{ color: "white", fontSize: "13px", fontWeight: "600" }}>{name}</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>{role}</div>
          </div>
        </div>
        <button
          onClick={() => setUser(null)}
          style={{
            width: "100%", padding: "8px",
            background: "rgba(255,255,255,0.1)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px", cursor: "pointer",
            fontSize: "13px", fontWeight: "600"
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}