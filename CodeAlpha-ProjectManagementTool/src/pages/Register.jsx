
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Register({ onNavigate }) {
  const { register, loading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await register({ name, email, password });
      onNavigate?.("/");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    }
  }

  return (
    <main className="form-card">
      <h1>Create account</h1>
      <p>Join TaskFlow and start managing projects.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
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
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p style={{ marginTop: 20 }}>
        Already registered?{" "}
        <button
          type="button"
          className="secondary-button"
          onClick={() => onNavigate?.("/login")}
        >
          Sign In
        </button>
      </p>
    </main>
  );
}
