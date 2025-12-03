import React, { useState } from "react";
import { sanitize, isValidUsername } from "../utils/validation";
import { Link } from "react-router-dom";
import "./LoginReg.css";

function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: sanitize(value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

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

    alert("Username login validated — ready for backend!");
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
