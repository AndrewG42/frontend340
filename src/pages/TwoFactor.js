import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./LoginReg.css";
import { useAuth } from "../auth/AuthContext";

export default function TwoFactor() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // username passed from Login step
  const username = location.state?.username || "";

  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!username) {
      setErr("Missing username. Please log in again.");
      return;
    }

    try {
      const res = await fetch("/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, code }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || "2FA failed.");
        return;
      }

      login(data.user.username);
      navigate("/dashboard");
    } catch (e2) {
      setErr("Server unreachable.");
    }
  };

  return (
    <div className="form-container">
      <form className="main-form" onSubmit={submit}>
        <h2>Two-Factor Verification</h2>
        <p style={{ opacity: 0.9, marginTop: 0 }}>
          Enter the 6-digit code that was sent to your email.
        </p>

        <label htmlFor="code">Verification Code</label>
        <input
          id="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="123456"
        />

        {err && <p className="error">{err}</p>}
        <button type="submit">Verify</button>
      </form>
    </div>
  );
}
