
import { CalendarDays, MessageCircle } from "lucide-react";

const statusClass = {
  "To Do": "status-todo",
  "In Progress": "status-progress",
  Done: "status-done",
};

const priorityClass = {
  High: "priority-high",
  Medium: "priority-medium",
  Low: "priority-low",
};

export default function TaskCard({ task, onStatusChange }) {
  return (
    <article className="task-card">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <span className={`status-badge ${statusClass[task.status] || "status-todo"}`}>
          {task.status}
        </span>

        <span className={`priority-badge ${priorityClass[task.priority] || "priority-low"}`}>
          {task.priority}
        </span>
      </div>

      <h4>{task.title}</h4>
      <p>{task.description}</p>

      <div className="task-card-footer">
        <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#818a84", fontSize: 11 }}>
          <CalendarDays size={14} />
          {task.dueDate || "No deadline"}
        </span>

        <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#818a84", fontSize: 11 }}>
          <MessageCircle size={14} />
          {task.comments ?? 0}
        </span>
      </div>

      {onStatusChange && (
        <select
          aria-label={`Change status of ${task.title}`}
          value={task.status}
          onChange={(event) => onStatusChange(task.id, event.target.value)}
          style={{
            width: "100%",
            marginTop: 13,
            padding: 8,
            border: "1px solid #e8ebe6",
            borderRadius: 7,
            background: "#fff",
          }}
        >
          <option>To Do</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
      )}
    </article>
  );
}
