
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login({ onNavigate }) {
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await login({ email, password });
      onNavigate?.("/");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    }
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
            autoComplete="email"
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
            autoComplete="current-password"
            required
          />
        </div>

        {error && (
          <p role="alert" style={{ color: "crimson" }}>
            {error}
          </p>
        )}

        <button
          className="primary-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p style={{ marginTop: 20 }}>
        New here?{" "}
        <button
          type="button"
          className="secondary-button"
          onClick={() => onNavigate?.("/register")}
        >
          Create Account
        </button>
      </p>
    </main>
  );
}
