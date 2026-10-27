
import { useState } from "react";

export default function Register({ onNavigate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    window.alert("Registration UI only. Backend registration comes next.");
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
            required
          />
        </div>

        <button className="primary-button" type="submit">
          Create Account
        </button>
      </form>

      <p style={{ marginTop: 20 }}>
        Already registered?{" "}
        <button className="secondary-button" onClick={() => onNavigate?.("/login")}>
          Sign In
        </button>
      </p>
    </main>
  );
}
