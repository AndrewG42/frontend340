import React from "react";
import { useAuth } from "../auth/AuthContext";

function Footer() {
	const { user, logout } = useAuth();
  return (
    <footer className="app-footer">
	{user && (
	<>
	<button onClick={logout} className="logout-btn">
	Logout
	</button>
	</>
	)}
	<p>© 2025 FixIT | Internal Support Portal</p>
    </footer>
  );
}

export default Footer;
