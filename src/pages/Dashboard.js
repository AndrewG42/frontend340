// src/pages/Dashboard.js
import React from "react";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user?.username || "User"}</h2>
      <p>This is your FixIT dashboard. From here you'll manage tickets and view activity.</p>

	{user?.role === "admin" && (
  <div className="dashboard-card">
    <h3>Admin</h3>
    <p>Manage users and roles.</p>
    <Link className="link-btn" to="/admin/users">Admin Users</Link>
  </div>
)}


      <div className="dashboard-card">
        <h3>Your Tickets</h3>
        <p>Create and view your support tickets.</p>
        <Link className="link-btn" to="/tickets">View Tickets</Link>
      </div>

	<div className="dashboard-card">
  <h3>Messages</h3>
  <p>View your direct messages.</p>
  <Link className="link-btn" to="/inbox">Open Inbox</Link>
</div>

      <div className="dashboard-card">
        <h3>Search & Knowledge Base</h3>
        <p>(Search functionality will go here later.)</p>
      </div>
    </div>
  );
}

export default Dashboard;
