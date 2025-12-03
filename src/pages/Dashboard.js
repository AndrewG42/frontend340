// src/pages/Dashboard.js
import React from "react";
import { useAuth } from "../auth/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user?.username || "User"}</h2>
      <p>This is your FixIT dashboard. From here you'll manage tickets and view activity.</p>

      <div className="dashboard-card">
        <h3>Your Tickets</h3>
        <p>(Ticket list will go here in a later milestone.)</p>
      </div>

      <div className="dashboard-card">
        <h3>Search & Knowledge Base</h3>
        <p>(Search functionality will go here later.)</p>
      </div>
    </div>
  );
}

export default Dashboard;
