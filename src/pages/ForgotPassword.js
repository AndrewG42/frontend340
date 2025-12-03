import React, { useState } from "react";
import { sanitize, isValidEmail } from "../utils/validation";
import { Link } from "react-router-dom";
import "./LoginReg.css"; // reuse same styling as login/register

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!isValidEmail(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Later: call backend /auth/forgot-password
    alert(
      "If an account exists with that email, password reset instructions will be sent."
    );
  };

  return (
    <div className="form-container">
      <form className="main-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(sanitize(e.target.value))}
	  placeholder="Enter your email address"
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <button type="submit">Send Reset Link</button>

        <p style={{ marginTop: "1rem" }}>
          Remembered your password? <Link to="/">Back to login</Link>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;
