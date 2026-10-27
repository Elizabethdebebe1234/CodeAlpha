
import { Bell, Search } from "lucide-react";

export default function Navbar({ search, onSearchChange }) {
  return (
    <header className="topbar">
      <label className="search-box">
        <Search size={18} />
        <input
          type="search"
          placeholder="Search projects and tasks..."
          value={search}
          onChange={(event) => onSearchChange?.(event.target.value)}
          aria-label="Search projects and tasks"
        />
      </label>

      <div className="topbar-right">
        <button
          type="button"
          className="icon-button"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={19} />
        </button>

        <div className="user-avatar" title="Liz">L</div>

        <div>
          <p style={{ fontWeight: 700, fontSize: 13 }}>Liz</p>
          <p style={{ color: "#818a84", fontSize: 11 }}>Workspace owner</p>
        </div>
      </div>
    </header>
  );
}
