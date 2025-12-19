import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./LoginReg.css";

export default function Inbox() {
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/dm/inbox", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setErr(data.error || "Failed to load inbox.");
      setUsers(data.users || []);
    } catch {
      setErr("Server unreachable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header-row">
        <h2>Inbox</h2>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <Link className="secondary-btn" to="/dashboard">Dashboard</Link>
          <button className="secondary-btn" type="button" onClick={load}>Refresh</button>
        </div>
      </div>

      <div className="panel">
        {err && <p className="error">{err}</p>}

        {loading ? (
          <p style={{ opacity: 0.9 }}>Loading inbox...</p>
        ) : users.length === 0 ? (
          <p style={{ opacity: 0.9 }}>No conversations yet.</p>
        ) : (
          <div className="ticket-list">
            {users.map((u) => (
              <div className="ticket-card" key={u.user_id}>
                <div className="ticket-card-top">
                  <div>
                    <div className="ticket-title">{u.username}</div>
                    <div className="ticket-meta">
                      Last message: {u.last_at ? new Date(u.last_at).toLocaleString() : "—"}
                    </div>
                  </div>

                  <Link className="link-btn" to={`/messages/${u.user_id}`}>
                    Open
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
