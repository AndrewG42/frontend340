import React from "react";
import { useAuth } from "../auth/AuthContext";

function Footer() {
	const { user, logout } = useAuth();
  return (
    <footer className="app-footer">
      <p>© 2025 FixIT | Internal Support Portal</p>
	{user && (
	<>
	<button onClick={logout} className="logout-btn">
	Logout
	</button>
	</>
	)}
    </footer>
  );
}

export default Footer;
