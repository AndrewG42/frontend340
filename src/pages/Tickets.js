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

  // Search state
  const [q, setQ] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchErr, setSearchErr] = useState("");

  async function loadTickets() {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/tickets", { credentials: "include" });
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

  const runSearch = async (e) => {
    e.preventDefault();
    const query = q.trim();
    setSearchErr("");
    setSearchResults([]);

    if (!query) {
      setSearching(false);
      return;
    }

    setSearching(true);

    try {
      const res = await fetch(`/tickets/search?q=${encodeURIComponent(query)}`, {
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setSearchErr(data.error || "Search failed.");
        return;
      }

      setSearchResults(data.results || []);
    } catch {
      setSearchErr("Server unreachable.");
    }
  };

  const clearSearch = () => {
    setQ("");
    setSearching(false);
    setSearchResults([]);
    setSearchErr("");
  };

  const displayTickets = searching ? searchResults : tickets;

  return (
    <div className="page-container">
      <div className="page-header-row">
        <h2>Your Tickets</h2>
        <Link className="link-btn" to="/dashboard">
          Back to Dashboard
        </Link>
      </div>

      <div className="panel">
        <h3>Search Tickets</h3>
        <form className="ticket-form" onSubmit={runSearch}>
          <label htmlFor="ticketSearch">Search by title/body</label>
          <input
            id="ticketSearch"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g., SQL, connection refused, 500 error"
          />
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button type="submit">Search</button>
            <button type="button" className="secondary-btn" onClick={clearSearch}>
              Clear
            </button>
          </div>
          {searchErr && <p className="error">{searchErr}</p>}
          {searching && !searchErr && (
            <p style={{ opacity: 0.85, marginTop: "0.5rem" }}>
              Showing search results for: <b>{q.trim()}</b>
            </p>
          )}
        </form>
      </div>

      <div className="panel" style={{ marginTop: "1.25rem" }}>
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
          <h3>{searching ? "Search Results" : "Recent Tickets"}</h3>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button className="secondary-btn" onClick={loadTickets} type="button">
              Refresh
            </button>
          </div>
        </div>

        {loading && !searching ? (
          <p style={{ opacity: 0.9 }}>Loading tickets...</p>
        ) : displayTickets.length === 0 ? (
          <p style={{ opacity: 0.9 }}>{searching ? "No matches found." : "No tickets yet."}</p>
        ) : (
          <div className="ticket-list">
            {displayTickets.map((t) => (
              <div className="ticket-card" key={t.id}>
                <div className="ticket-card-top">
                  <div>
                    <div className="ticket-title">
                      #{t.id} — {t.title}
                    </div>
                    <div className="ticket-meta">
                      Status: <b>{t.status}</b> • Last activity:{" "}
                      {t.last_activity_at ? new Date(t.last_activity_at).toLocaleString() : "—"}
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

                {t.body && (
                  <div className="ticket-body-preview">
                    {t.body.length > 180 ? t.body.slice(0, 180) + "…" : t.body}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
