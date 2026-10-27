
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
  LogOut,
  ClipboardList,
} from "lucide-react";

const links = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "My Projects", icon: FolderKanban, path: "/projects" },
  { label: "My Tasks", icon: CheckSquare, path: "/tasks" },
  { label: "Team", icon: Users, path: "/team" },
];

export default function Sidebar({ active = "Dashboard", onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">T</div>
        <span className="brand-name">TaskFlow</span>
      </div>

      <p className="nav-label">WORKSPACE</p>

      {links.map(({ label, icon: Icon, path }) => (
        <button
          key={label}
          type="button"
          className={`nav-link ${active === label ? "active" : ""}`}
          onClick={() => onNavigate?.(path)}
          style={{ width: "100%", border: 0, textAlign: "left", background: active === label ? undefined : "transparent" }}
        >
          <Icon size={19} />
          <span className="nav-text">{label}</span>
        </button>
      ))}

      <p className="nav-label">PREFERENCES</p>

      <button
        type="button"
        className="nav-link"
        onClick={() => onNavigate?.("/settings")}
        style={{ width: "100%", border: 0, background: "transparent", textAlign: "left" }}
      >
        <Settings size={19} />
        <span className="nav-text">Settings</span>
      </button>

      <div style={{ marginTop: 35 }}>
        <div style={{ background: "#f8f7f2", borderRadius: 12, padding: 13 }}>
          <ClipboardList size={22} color="#1c4938" />
          <p style={{ fontWeight: 700, marginTop: 10 }}>Stay organized</p>
          <p style={{ fontSize: 11, color: "#818a84", lineHeight: 1.6, marginTop: 5 }}>
            Keep your team moving forward, one task at a time.
          </p>
        </div>

        <button
          type="button"
          className="nav-link"
          onClick={() => onNavigate?.("/login")}
          style={{ width: "100%", border: 0, background: "transparent", textAlign: "left", marginTop: 15 }}
        >
          <LogOut size={19} />
          <span className="nav-text">Sign in</span>
        </button>
      </div>
    </aside>
  );
}
