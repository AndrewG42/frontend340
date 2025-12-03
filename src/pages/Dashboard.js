import React from "react";
import { useAuth } from "../auth/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user?.username}</h2>
      <p>This is your FixIT dashboard.</p>

      <div className="dashboard-card">
        <h3>Your Tickets</h3>
        <p>(Ticket list will go here)</p>
      </div>

      <div className="dashboard-card">
        <h3>Search Knowledge Base</h3>
        <p>(Search bar will go here)</p>
      </div>
    </div>
  );
}

export default Dashboard;
