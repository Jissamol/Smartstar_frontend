import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    navigate("/admin-login");
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      {/* Sidebar Navigation */}
      <div className="admin-container">
        <aside className="admin-sidebar">
          <ul>
            <li onClick={() => navigate("/admin-dashboard")} className="active">Dashboard</li>
            <li onClick={() => navigate("/pending-teachers")}>Pending Teachers</li>
          </ul>
        </aside>

        {/* Main Dashboard */}
        <main className="admin-main">
          <h2>Welcome, Admin!</h2>
          <p>Use the sidebar to navigate.</p>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
