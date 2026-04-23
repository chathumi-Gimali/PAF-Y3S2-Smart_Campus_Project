import { useState } from "react";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import MyBookings from "./pages/MyBookings";
import CreateBooking from "./pages/CreateBooking";
import AdminPanel from "./pages/AdminPanel";
import TechnicianPanel from "./pages/TechnicianPanel";
import RaiseTicket from "./pages/RaiseTicket";
import "./index.css";

export default function App() {
  const [user, setUser] = useState(null); // { name, role }
  const [activePage, setActivePage] = useState("dashboard");

  if (!user) return <Login setUser={setUser} />;

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
      <Sidebar activePage={activePage} setActivePage={setActivePage} user={user} setUser={setUser} />
      <main style={{ flex: 1, padding: "30px", overflowY: "auto", background: "#f0f2ff" }}>
        {renderPage()}
      </main>
    </div>
  );
}