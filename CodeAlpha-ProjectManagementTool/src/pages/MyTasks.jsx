
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import { getProjects, getTasks, apiRequest } from "../services/api";

const statuses = ["To Do", "In Progress", "Done"];

function toUiStatus(status) {
  const value = String(status || "TODO").toUpperCase();

  if (value === "DONE" || value === "COMPLETED") return "Done";
  if (value === "IN_PROGRESS" || value === "IN PROGRESS") {
    return "In Progress";
  }

  return "To Do";
}

function toApiStatus(status) {
  if (status === "Done") return "DONE";
  if (status === "In Progress") return "IN_PROGRESS";
  return "TODO";
}

function formatTask(task, project) {
  return {
    ...task,
    projectName: project.title || project.name || "Untitled project",
    status: toUiStatus(task.status),
    priority: String(task.priority || "MEDIUM")
      .toLowerCase()
      .replace(/^./, (letter) => letter.toUpperCase()),
    dueDate: task.dueDate
      ? new Date(task.dueDate).toLocaleDateString()
      : "",
    comments: task._count?.comments ?? task.comments?.length ?? 0,
  };
}

export default function MyTasks({ onNavigate }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  useEffect(() => {
    let cancelled = false;

    async function loadTasks() {
      try {
        setLoading(true);
        setError("");

        const result = await getProjects();
        const projects = Array.isArray(result)
          ? result
          : result.projects || [];

        const taskGroups = await Promise.all(
          projects.map(async (project) => {
            const taskResult = await getTasks(project.id);
            const projectTasks = Array.isArray(taskResult)
              ? taskResult
              : taskResult.tasks || [];

            return projectTasks.map((task) =>
              formatTask(task, project)
            );
          })
        );

        if (!cancelled) {
          setTasks(taskGroups.flat());
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load your tasks.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTasks();

    return () => {
      cancelled = true;
    };
  }, []);

  async function updateStatus(taskId, status) {
    const previousTasks = tasks;

    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, status } : task
      )
    );

    try {
      await apiRequest(`/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: toApiStatus(status) }),
      });
    } catch (err) {
      setTasks(previousTasks);
      setError(err.message || "Could not update task.");
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" ||
      task.priority.toLowerCase() === priorityFilter.toLowerCase();

    return matchesStatus && matchesPriority;
  });

  return (
    <div className="app-layout">
      <Sidebar active="My Tasks" onNavigate={onNavigate} />

      <main className="main-content">
        <Navbar />

        <section className="page-heading">
          <div>
            <h1>My Tasks</h1>
            <p>All your tasks across every project in one place.</p>
          </div>
        </section>

        <div className="panel">
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 20,
            }}
          >
            <label>
              Status{" "}
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option>All</option>
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>

            <label>
              Priority{" "}
              <select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
              >
                <option>All</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </label>
          </div>

          {error && <p role="alert">{error}</p>}

          {loading ? (
            <p>Loading your tasks...</p>
          ) : filteredTasks.length === 0 ? (
            <p>No tasks match these filters. Try another filter or create a task in a project.</p>
          ) : (
            <div className="board-columns">
              {statuses.map((status) => {
                const columnTasks = filteredTasks.filter(
                  (task) => task.status === status
                );

                return (
                  <section className="board-column" key={status}>
                    <div className="column-title">
                      <span>{status}</span>
                      <span>{columnTasks.length}</span>
                    </div>

                    {columnTasks.map((task) => (
                      <div key={task.id}>
                        <p style={{ fontSize: 12, color: "#68756d" }}>
                          Project: {task.projectName}
                        </p>
                        <TaskCard
                          task={task}
                          onStatusChange={updateStatus}
                        />
                      </div>
                    ))}
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
