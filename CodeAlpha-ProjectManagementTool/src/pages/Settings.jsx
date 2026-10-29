
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { apiRequest } from "../services/api";

export default function Settings({ onNavigate }) {
  const [name, setName] = useState(
    JSON.parse(localStorage.getItem("taskflow_user") || "{}").name || ""
  );
  const [theme, setTheme] = useState(
    localStorage.getItem("taskflow_theme") || "light"
  );
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("taskflow_theme", theme);
  }, [theme]);

  async function saveProfile(event) {
    event.preventDefault();
    try {
      setSaving(true);
      setMessage("");

      const result = await apiRequest("/users/profile", {
        method: "PATCH",
        body: JSON.stringify({ name: name.trim() }),
      });

      const user = result.user || result;
      localStorage.setItem(
        "taskflow_user",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("taskflow_user") || "{}"),
          ...user,
        })
      );
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err.message || "Could not save profile. Check the backend endpoint.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="app-layout">
      <Sidebar active="Settings" onNavigate={onNavigate} />
      <main className="main-content">
        <Navbar />
        <section className="page-heading">
          <div>
            <h1>Settings</h1>
            <p>Manage your profile and appearance.</p>
          </div>
        </section>

        <form className="panel" onSubmit={saveProfile}>
          <h2 style={{ marginBottom: 18 }}>Profile</h2>
          <div className="form-group">
            <label htmlFor="profile-name">Display name</label>
            <input id="profile-name" value={name}
              onChange={(e) => setName(e.target.value)} required />
          </div>
          <button className="primary-button" disabled={saving}>
            {saving ? "Saving..." : "Save profile"}
          </button>
          {message && <p role="status" style={{ marginTop: 14 }}>{message}</p>}
        </form>

        <section className="panel">
          <h2 style={{ marginBottom: 18 }}>Appearance</h2>
          <div className="form-group">
            <label htmlFor="theme-choice">Theme preference</label>
            <select id="theme-choice" value={theme}
              onChange={(e) => setTheme(e.target.value)}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <p style={{ color: "var(--muted)" }}>
            Your preference is saved in this browser.
          </p>
        </section>
      </main>
    </div>
  );
}
