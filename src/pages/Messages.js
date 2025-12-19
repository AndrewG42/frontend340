import React, { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import "./LoginReg.css";

export default function Messages() {
  const { userId } = useParams();

  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const load = useCallback(async () => {
    setErr("");
    setOk("");
    try {
      const res = await fetch(`/dm/${userId}`, { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || "Failed to load messages.");
        return;
      }
      setMessages(data.messages || []);
    } catch {
      setErr("Server unreachable.");
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const send = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");

    if (!body.trim()) return setErr("Message cannot be empty.");

    try {
      const res = await fetch(`/dm/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ body: body.trim() }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setErr(data.error || "Send failed.");

      setBody("");
      setOk("Sent.");
      await load(); // works now
    } catch {
      setErr("Server unreachable.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-row">
        <h2>Direct Messages</h2>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <Link className="secondary-btn" to="/dashboard">
            Dashboard
          </Link>
          <button className="secondary-btn" type="button" onClick={load}>
            Refresh
          </button>
        </div>
      </div>

      <div className="panel">
        <h3>Conversation with User #{userId}</h3>

        {err && <p className="error">{err}</p>}
        {ok && <p className="ok">{ok}</p>}

        <div className="comment-list" style={{ marginTop: "0.75rem" }}>
          {messages.length === 0 ? (
            <p style={{ opacity: 0.9 }}>No messages yet.</p>
          ) : (
            messages.map((m) => (
              <div className="comment-card" key={m.id}>
                <div className="comment-meta">
                  From #{m.sender_user_id} •{" "}
                  {new Date(m.created_at).toLocaleString()}
                </div>
                <div style={{ marginTop: "0.4rem" }}>{m.body}</div>
              </div>
            ))
          )}
        </div>

        <form className="ticket-form" onSubmit={send} style={{ marginTop: "1rem" }}>
          <label htmlFor="body">Send a message</label>
          <textarea
            id="body"
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}
