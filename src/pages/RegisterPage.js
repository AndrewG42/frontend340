import React from 'react';
import '../App.css';

export default function RegisterPage() {
  return (
    <div className="container">
      <h1>Register for FixIT</h1>
      <p>Create your account below. To register as a specialist, please attach proof of technical expertise.</p>
      <form>
        <input type="text" placeholder="Username" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <select>
          <option>User</option>
          <option>Specialist</option>
        </select>
        <input type="file" />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

