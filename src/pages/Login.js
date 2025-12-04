import React, { useState } from "react";
import { sanitize, isValidUsername } from "../utils/validation";
import { Link, useNavigate } from "react-router-dom";
import "./LoginReg.css"; // your shared CSS file
import { useAuth } from "../auth/AuthContext";

function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: sanitize(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    setServerError("");

    if (!isValidUsername(form.username)) {
      newErrors.username =
        "Username must be 3–20 characters (letters, numbers, underscores only).";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important for cookies
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setServerError(data.error || "Login failed.");
        return;
      }

      const data = await res.json();
      // store user in context
      login(data.user.username);

      // redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setServerError("Unable to reach server. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <form className="main-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={form.username}
          onChange={handleChange}
	  placeholder="Enter your username"
        />
        {errors.username && <p className="error">{errors.username}</p>}

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={form.password}
          onChange={handleChange}
	  placeholder="Enter your password"
        />
        {errors.password && <p className="error">{errors.password}</p>}

        {serverError && <p className="error">{serverError}</p>}

        <button type="submit">Log In</button>

        <p style={{ marginTop: "1rem" }}>
          Don’t have an account? <Link to="/register">Register here</Link>
        </p>

        <p style={{ marginTop: "0.5rem" }}>
          <Link to="/forgot-password">Forgot your password?</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
