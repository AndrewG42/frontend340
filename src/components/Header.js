import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <h1>FixIT Helpdesk Portal</h1>

      <nav className="nav-bar">
        {!user && (
          <>
            <Link to="/">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
