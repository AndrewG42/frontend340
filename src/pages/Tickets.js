import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./LoginReg.css";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    body: "",
    tags: "",
  });

  const [err, setErr] = useState("");
  const [okMsg, setOkMsg] = useState("");

  async function loadTickets() {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/tickets", {
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || "Failed to load tickets.");
        setLoading(false);
        return;
      }
      setTickets(data.tickets || []);
    } catch (e) {
      setErr("Server unreachable.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setErr("");
    setOkMsg("");

    if (!form.title.trim() || !form.body.trim()) {
      setErr("Title and description are required.");
      return;
    }

    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: form.title.trim(),
          body: form.body.trim(),
          tags,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || "Failed to create ticket.");
        return;
      }

      setOkMsg(`Ticket created (id=${data.id}).`);
      setForm({ title: "", body: "", tags: "" });
      await loadTickets();
    } catch (e) {
      setErr("Server unreachable.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-row">
        <h2>Your Tickets</h2>
        <Link className="link-btn" to="/dashboard">
          Back to Dashboard
        </Link>
      </div>

      <div className="panel">
        <h3>Create a Ticket</h3>
        <form className="ticket-form" onSubmit={handleCreate}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g., SQL connection failing"
          />

          <label htmlFor="body">Description</label>
          <textarea
            id="body"
            value={form.body}
            onChange={handleChange}
            rows={5}
            placeholder="Describe the issue, error messages, what you tried..."
          />

          <label htmlFor="tags">Tags (comma-separated)</label>
          <input
            id="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="SQL, Networking, Windows"
          />

          {err && <p className="error">{err}</p>}
          {okMsg && <p className="ok">{okMsg}</p>}

          <button type="submit">Create Ticket</button>
        </form>
      </div>

      <div className="panel" style={{ marginTop: "1.25rem" }}>
        <div className="tickets-header">
          <h3>Recent Tickets</h3>
          <button className="secondary-btn" onClick={loadTickets} type="button">
            Refresh
          </button>
        </div>

        {loading ? (
          <p style={{ opacity: 0.9 }}>Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p style={{ opacity: 0.9 }}>No tickets yet.</p>
        ) : (
          <div className="ticket-list">
            {tickets.map((t) => (
              <div className="ticket-card" key={t.id}>
                <div className="ticket-card-top">
                  <div>
                    <div className="ticket-title">
                      #{t.id} — {t.title}
                    </div>
                    <div className="ticket-meta">
                      Status: <b>{t.status}</b> • Last activity:{" "}
                      {new Date(t.last_activity_at).toLocaleString()}
                    </div>
                    {t.tags && (
                      <div className="ticket-tags">
                        {String(t.tags)
                          .split(",")
                          .filter(Boolean)
                          .map((tag) => (
                            <span className="tag-pill" key={`${t.id}-${tag}`}>
                              {tag}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>

                  <Link className="link-btn" to={`/tickets/${t.id}`}>
                    Open
                  </Link>
                </div>

                <div className="ticket-body-preview">
                  {t.body?.length > 180 ? t.body.slice(0, 180) + "…" : t.body}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
