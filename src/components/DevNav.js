import { Link } from "react-router-dom";

function DevNav() {
  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link to="/" style={{ marginRight: "15px" }}>Login</Link>
      <Link to="/register" style={{ marginRight: "15px" }}>Register</Link>
      <Link to="/dashboard" style={{ marginRight: "15px" }}>Dashboard</Link>
      <Link to="/tickets" style={{ marginRight: "15px" }}>Tickets</Link>
      <Link to="/create-ticket" style={{ marginRight: "15px" }}>Create Ticket</Link>
      <Link to="/search" style={{ marginRight: "15px" }}>Search</Link>
      <Link to="/admin">Admin Panel</Link>
    </nav>
  );
}

export default DevNav;
