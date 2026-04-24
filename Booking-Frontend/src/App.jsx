import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import MyBookings from "./pages/MyBookings";
import CreateBooking from "./pages/CreateBooking";
import AdminPanel from "./pages/AdminPanel";
import TechnicianPanel from "./pages/TechnicianPanel";
import RaiseTicket from "./pages/RaiseTicket";
import OAuthSuccess from "./pages/OAuthSuccess";
import "./index.css";

export default function App() {
  const [user, setUser] = useState(() => {
    // Load user from localStorage on startup
    const saved = localStorage.getItem("smartcampus_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [activePage, setActivePage] = useState("dashboard");

  // Save user to localStorage whenever it changes
  const handleSetUser = (userData) => {
    if (userData) {
      localStorage.setItem("smartcampus_user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("smartcampus_user");
    }
    setUser(userData);
  };

  // Handle OAuth callback
  if (window.location.pathname === "/oauth-success") {
    return <OAuthSuccess setUser={handleSetUser} />;
  }

  if (!user) return <Login setUser={handleSetUser} />;

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <Dashboard user={user} setActivePage={setActivePage} />;
      case "myBookings": return <MyBookings user={user} />;
      case "createBooking": return <CreateBooking user={user} setActivePage={setActivePage} />;
      case "admin": return <AdminPanel />;
      case "technician": return <TechnicianPanel user={user} />;
      case "raiseTicket": return <RaiseTicket user={user} setActivePage={setActivePage} />;
      default: return <Dashboard user={user} setActivePage={setActivePage} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} user={user} setUser={handleSetUser} />
      <main style={{ flex: 1, padding: "30px", overflowY: "auto", background: "#f0f2ff" }}>
        {renderPage()}
      </main>
    </div>
  );
}