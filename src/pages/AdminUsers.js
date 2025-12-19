import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./LoginReg.css";
import { useAuth } from "../auth/AuthContext";

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const load = async () => {
    setErr(""); setOk("");
    try {
      const res = await fetch("/admin/users", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setErr(data.error || "Failed to load users.");
      setUsers(data.users || []);
    } catch {
      setErr("Server unreachable.");
    }
  };

  useEffect(() => { load(); }, []);

  if (user?.role !== "admin") {
    return (
      <div className="page-container">
        <div className="panel">
          <p className="error">Forbidden (admin only).</p>
          <Link className="link-btn" to="/dashboard">Back</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header-row">
        <h2>Admin: Users</h2>
        <Link className="link-btn" to="/dashboard">Dashboard</Link>
      </div>

      <div className="panel">
        {err && <p className="error">{err}</p>}
        {ok && <p className="ok">{ok}</p>}

        <button className="secondary-btn" type="button" onClick={load}>Refresh</button>

        <div className="ticket-list" style={{ marginTop: "1rem" }}>
          {users.map((u) => (
            <div className="ticket-card" key={u.id}>
              <div className="ticket-card-top">
                <div>
                  <div className="ticket-title">#{u.id} — {u.username}</div>
                  <div className="ticket-meta">Role: <b>{u.role}</b> • {u.email}</div>
                </div>

                <select
                  value={u.role}
                  onChange={async (e) => {
                    setErr(""); setOk("");
                    try {
                      const res = await fetch(`/admin/users/${u.id}/role`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ role: e.target.value }),
                      });
                      const data = await res.json().catch(() => ({}));
                      if (!res.ok) return setErr(data.error || "Role update failed.");
                      setOk("Role updated.");
                      load();
                    } catch {
                      setErr("Server unreachable.");
                    }
                  }}
                >
                  <option value="user">user</option>
                  <option value="specialist">specialist</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
