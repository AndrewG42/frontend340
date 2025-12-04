// src/pages/Register.js
import React, { useState } from "react";
import {
  sanitize,
  isValidEmail,
  isValidPassword,
  isValidUsername,
} from "../utils/validation";
import { Link, useNavigate } from "react-router-dom";
import "./LoginReg.css"; // shared styling file

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: sanitize(value) });
  };

  const checkAvailability = async () => {
    const res = await fetch("/auth/check-availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username: form.username, email: form.email }),
    });

    return res.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    // Username validation
    if (!isValidUsername(form.username)) {
      newErrors.username =
        "Username must be 3–20 characters (letters, numbers, underscores only).";
    }

    // Email validation
    if (!isValidEmail(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    // Password validation
    if (!isValidPassword(form.password)) {
      newErrors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
    }

    // Confirm password matches
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check username/email availability via backend
    try {
      const result = await checkAvailability();

      if (!result.usernameAvailable) {
        newErrors.username = "Username already taken.";
      }
      if (!result.emailAvailable) {
        newErrors.email = "Email already registered.";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    } catch (err) {
      console.error("Availability check failed:", err);
      setErrors({ form: "Unable to check username/email availability." });
      return;
    }

    // 🚀 Actually register the user via backend
    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrors({
          form: data.error || "Registration failed. Please try again.",
        });
        return;
      }

      // Optional: you could show a success message first
      // For now, just send them to login
      navigate("/");
    } catch (err) {
      console.error("Register error:", err);
      setErrors({ form: "Unable to reach server. Please try again." });
    }
  };

  return (
    <div className="form-container">
      <form className="main-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={form.username}
          onChange={handleChange}
	  placeholder="Create a unique username"
        />
        <p className="help-text">
          Requirements: 3–20 characters; letters, numbers, underscores only.
        </p>
        {errors.username && <p className="error">{errors.username}</p>}

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={form.email}
          onChange={handleChange}
	  placeholder="Enter your username"
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={form.password}
          onChange={handleChange}
	  placeholder="Create a new password"
        />
        <p className="help-text">
          Requirements: at least 8 characters, with uppercase, lowercase,
          number, and special character.
        </p>
        {errors.password && <p className="error">{errors.password}</p>}

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
	  placeholder="Enter the same new password"
        />
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword}</p>
        )}

        {errors.form && <p className="error">{errors.form}</p>}

        <button type="submit">Register</button>

        <p style={{ marginTop: "1rem" }}>
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
