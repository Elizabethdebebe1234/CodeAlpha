
import { useState } from "react";

export default function Login({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    window.alert("Login UI only. Backend authentication will be connected next.");
  }

  return (
    <main className="form-card">
      <h1>Welcome back</h1>
      <p>Sign in to access your TaskFlow workspace.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <button className="primary-button" type="submit">
          Sign In
        </button>
      </form>

      <p style={{ marginTop: 20 }}>
        New here?{" "}
        <button className="secondary-button" onClick={() => onNavigate?.("/register")}>
          Create Account
        </button>
      </p>
    </main>
  );
}
