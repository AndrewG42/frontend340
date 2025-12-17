import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./LoginReg.css";

export default function TicketDetail() {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [tags, setTags] = useState([]);
  const [comments, setComments] = useState([]);

  const [newComment, setNewComment] = useState("");
  const [err, setErr] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    setOkMsg("");
    try {
      const res = await fetch(`/tickets/${id}`, { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || "Failed to load ticket.");
        setLoading(false);
        return;
      }

      setTicket(data.ticket);
      setComments(data.comments || []);
      setTags(data.tags || []);

      // keep edit fields in sync with the server ticket
      setEditTitle(data.ticket.title || "");
      setEditBody(data.ticket.body || "");
    } catch (e) {
      setErr("Server unreachable.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const submitComment = async (e) => {
    e.preventDefault();
    setErr("");
    setOkMsg("");

    if (!newComment.trim()) {
      setErr("Comment cannot be empty.");
      return;
    }

    try {
      const res = await fetch(`/tickets/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ body: newComment.trim() }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || "Failed to post comment.");
        return;
      }

      setNewComment("");
      setOkMsg("Comment posted.");
      await load();
    } catch (e2) {
      setErr("Server unreachable.");
    }
  };

  const saveEdits = async () => {
    setErr("");
    setOkMsg("");

    if (!editTitle.trim() || !editBody.trim()) {
      setErr("Title and description cannot be empty.");
      return;
    }

    try {
      const res = await fetch(`/tickets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: editTitle.trim(),
          body: editBody.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || "Update failed.");
        return;
      }

      setOkMsg("Ticket updated.");
      setEditMode(false);
      await load();
    } catch {
      setErr("Server unreachable.");
    }
  };

  const deleteTicket = async () => {
    const yes = window.confirm("Delete this ticket? This cannot be undone.");
    if (!yes) return;

    setErr("");
    setOkMsg("");

    try {
      const res = await fetch(`/tickets/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || "Delete failed.");
        return;
      }

      window.location.href = "/tickets";
    } catch {
      setErr("Server unreachable.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-row">
        <h2>Ticket #{id}</h2>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <Link className="link-btn" to="/tickets">
            Back to Tickets
          </Link>
          <Link className="secondary-btn" to="/dashboard">
            Dashboard
          </Link>
        </div>
      </div>

      {loading ? (
        <p style={{ opacity: 0.9 }}>Loading ticket...</p>
      ) : err ? (
        <div className="panel">
          <p className="error">{err}</p>
        </div>
      ) : !ticket ? (
        <div className="panel">
          <p style={{ opacity: 0.9 }}>Ticket not found.</p>
        </div>
      ) : (
        <>
          {/* Ticket details panel */}
          <div className="panel">
            <div className="ticket-detail-top">
              <div style={{ width: "100%" }}>
                {/* Title + meta + tags */}
                {!editMode ? (
                  <div className="ticket-title" style={{ fontSize: "1.15rem" }}>
                    {ticket.title}
                  </div>
                ) : (
                  <div style={{ marginBottom: "0.75rem" }}>
                    <label style={{ display: "block", marginBottom: "0.25rem" }}>
                      Title
                    </label>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </div>
                )}

                <div className="ticket-meta">
                  Status: <b>{ticket.status}</b> • Created:{" "}
                  {ticket.created_at
                    ? new Date(ticket.created_at).toLocaleString()
                    : "—"}{" "}
                  • Last activity:{" "}
                  {ticket.last_activity_at
                    ? new Date(ticket.last_activity_at).toLocaleString()
                    : "—"}
                </div>

                {tags.length > 0 && (
                  <div className="ticket-tags">
                    {tags.map((t) => (
                      <span className="tag-pill" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* ---- C) Edit/Delete buttons go RIGHT HERE ---- */}
                <div className="ticket-detail-actions">
                  {!editMode ? (
                    <>
                      <button
                        className="secondary-btn"
                        type="button"
                        onClick={() => setEditMode(true)}
                      >
                        Edit Ticket
                      </button>
                      <button
                        className="danger-btn"
                        type="button"
                        onClick={deleteTicket}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="secondary-btn"
                        type="button"
                        onClick={saveEdits}
                      >
                        Save
                      </button>
                      <button
                        className="secondary-btn"
                        type="button"
                        onClick={() => {
                          setEditMode(false);
                          // revert edits back to current ticket values
                          setEditTitle(ticket.title || "");
                          setEditBody(ticket.body || "");
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>

                {/* Body (view vs edit) */}
                {!editMode ? (
                  <div
                    style={{
                      marginTop: "1rem",
                      lineHeight: 1.45,
                      opacity: 0.98,
                    }}
                  >
                    {ticket.body}
                  </div>
                ) : (
                  <div style={{ marginTop: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.25rem" }}>
                      Description
                    </label>
                    <textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      rows={6}
                      style={{ width: "100%" }}
                    />
                  </div>
                )}
              </div>
            </div>

            {err && <p className="error" style={{ marginTop: "0.75rem" }}>{err}</p>}
            {okMsg && <p className="ok" style={{ marginTop: "0.75rem" }}>{okMsg}</p>}
          </div>

          {/* Comments panel */}
          <div className="panel" style={{ marginTop: "1.25rem" }}>
            <div className="tickets-header">
              <h3>Comments</h3>
              <button className="secondary-btn" onClick={load} type="button">
                Refresh
              </button>
            </div>

            {comments.length === 0 ? (
              <p style={{ opacity: 0.9 }}>No comments yet.</p>
            ) : (
              <div className="comment-list">
                {comments.map((c) => (
                  <div className="comment-card" key={c.id}>
                    <div className="comment-meta">
                      User #{c.user_id} •{" "}
                      {new Date(c.created_at).toLocaleString()}
                    </div>
                    <div style={{ marginTop: "0.4rem" }}>{c.body}</div>
                  </div>
                ))}
              </div>
            )}

            <form
              className="ticket-form"
              onSubmit={submitComment}
              style={{ marginTop: "1rem" }}
            >
              <label htmlFor="newComment">Add a comment</label>
              <textarea
                id="newComment"
                rows={4}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ask a question or provide an update..."
              />

              <button type="submit">Post Comment</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
