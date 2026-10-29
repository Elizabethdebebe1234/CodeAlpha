
import { useEffect, useState } from "react";
import { Users, Mail } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { apiRequest } from "../services/api";

export default function Team({ onNavigate }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/users/team")
      .then((data) => setMembers(Array.isArray(data) ? data : data.users || []))
      .catch((err) => setError(err.message || "Could not load team members."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-layout">
      <Sidebar active="Team" onNavigate={onNavigate} />
      <main className="main-content">
        <Navbar />
        <section className="page-heading">
          <div>
            <h1>Team</h1>
            <p>Your workspace members and contact details.</p>
          </div>
          <Users size={30} />
        </section>

        {loading ? <div className="panel">Loading team...</div> : null}
        {error && <div className="panel" role="alert">{error}</div>}

        <div className="project-grid">
          {members.map((member) => (
            <article className="project-card" key={member.id}>
              <div className="project-card-top">
                <div className="user-avatar">
                  {(member.name || member.email || "U").charAt(0).toUpperCase()}
                </div>
                <span className="status-badge status-done">Registered</span>
              </div>
              <h3>{member.name || "Team member"}</h3>
              <p><Mail size={13} style={{ display: "inline", marginRight: 6 }} />
                {member.email}
              </p>
            </article>
          ))}
        </div>

        {!loading && !error && members.length === 0 && (
          <div className="panel empty-state">No team members found.</div>
        )}
      </main>
    </div>
  );
}
