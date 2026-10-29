
import { useEffect, useMemo, useState } from "react";
import {
  FolderKanban,
  CheckCircle2,
  Clock3,
  Users,
  Plus,
  ArrowRight,
  LogOut,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProjectCard from "../components/ProjectCard";
import TaskCard from "../components/TaskCard";
import { useAuth } from "../context/AuthContext";
import {
  getProjects,
  getTasks,
  createProject,
  apiRequest,
} from "../services/api";

function formatStatus(status) {
  const value = String(status || "TODO").toUpperCase();

  if (value === "DONE" || value === "COMPLETED") return "Done";
  if (value === "IN_PROGRESS" || value === "IN PROGRESS") {
    return "In Progress";
  }

  return "To Do";
}

function apiStatus(status) {
  if (status === "Done") return "DONE";
  if (status === "In Progress") return "IN_PROGRESS";
  return "TODO";
}

export default function Dashboard({ onNavigate }) {
  const { user, logout } = useAuth();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const result = await getProjects();
        const list = Array.isArray(result)
          ? result
          : result.projects || [];

        const projectList = list.map((project) => ({
          ...project,
          name: project.title || project.name || "Untitled project",
          progress: project.progress ?? 0,
          tasks: project._count?.tasks ?? project.tasksCount ?? 0,
          members: project.members?.length ?? project.membersCount ?? 1,
          color: "#e7f0e9",
          iconColor: "#1c4938",
        }));

        const taskGroups = await Promise.all(
          projectList.map(async (project) => {
            try {
              const result = await getTasks(project.id);
              const list = Array.isArray(result)
                ? result
                : result.tasks || [];

              return list.map((task) => ({
                ...task,
                status: formatStatus(task.status),
                priority: String(task.priority || "MEDIUM")
                  .toLowerCase()
                  .replace(/^./, (letter) => letter.toUpperCase()),
                dueDate: task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "",
                comments:
                  task._count?.comments ?? task.comments?.length ?? 0,
                projectName: project.name,
              }));
            } catch {
              return [];
            }
          })
        );

        if (!cancelled) {
          setProjects(projectList);
          setTasks(taskGroups.flat());
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load your dashboard.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) =>
        `${project.name} ${project.description || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [projects, search]
  );

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) =>
        `${task.title} ${task.description || ""} ${task.projectName || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [tasks, search]
  );

  async function handleCreateProject() {
    const name = window.prompt("Enter your new project name:");
    if (!name?.trim() || creating) return;

    const description =
      window.prompt("Project description:")?.trim() || "";

    try {
      setCreating(true);
      setError("");

      const result = await createProject({
        title: name.trim(),
        description,
      });

      const saved = result.project || result;

      setProjects((current) => [
        {
          ...saved,
          name: saved.title || saved.name || name.trim(),
          progress: 0,
          tasks: 0,
          members: 1,
          color: "#e7f0e9",
          iconColor: "#1c4938",
        },
        ...current,
      ]);
    } catch (err) {
      setError(err.message || "Could not create the project.");
    } finally {
      setCreating(false);
    }
  }

  async function updateTaskStatus(taskId, status) {
    const previous = tasks;

    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, status } : task
      )
    );

    try {
      await apiRequest(`/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: apiStatus(status) }),
      });
    } catch (err) {
      setTasks(previous);
      setError(err.message || "Could not update task status.");
    }
  }

  function handleLogout() {
    logout();
    onNavigate?.("/login");
  }

  const completed = tasks.filter(
    (task) => task.status === "Done"
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const stats = [
    {
      label: "Total Projects",
      value: projects.length,
      note: "Your saved projects",
      icon: FolderKanban,
      color: "#e7f0e9",
      iconColor: "#1c4938",
    },
    {
      label: "Completed Tasks",
      value: completed,
      note: "Tasks marked as done",
      icon: CheckCircle2,
      color: "#e5f5e9",
      iconColor: "#32764f",
    },
    {
      label: "In Progress",
      value: inProgress,
      note: "Tasks being worked on",
      icon: Clock3,
      color: "#eaf0ff",
      iconColor: "#5477c2",
    },
    {
      label: "Team Members",
      value: projects.reduce(
        (sum, project) => sum + (project.members || 1),
        0
      ),
      note: "Combined project memberships",
      icon: Users,
      color: "#fff0df",
      iconColor: "#b77a35",
    },
  ];

  return (
    <div className="app-layout">
      <Sidebar active="Dashboard" onNavigate={onNavigate} />

      <main className="main-content">
        <Navbar search={search} onSearchChange={setSearch} />

        <section className="page-heading">
          <div>
            <p style={{ color: "#1c4938", fontWeight: 700, marginBottom: 8 }}>
              TASKFLOW WORKSPACE
            </p>
            <h1>
              Good day{user?.name ? `, ${user.name}` : ""} 👋
            </h1>
            <p>Here's what's happening with your projects today.</p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              className="secondary-button"
              onClick={handleLogout}
            >
              <LogOut size={16} /> Logout
            </button>

            <button
              className="primary-button"
              onClick={handleCreateProject}
              disabled={creating}
            >
              <Plus size={18} />
              {creating ? "Creating..." : "New project"}
            </button>
          </div>
        </section>

        {error && (
          <div className="panel" role="alert" style={{ marginBottom: 16 }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="panel">Loading your workspace...</div>
        ) : (
          <>
            <section className="stats-grid" aria-label="Workspace statistics">
              {stats.map(({ label, value, note, icon: Icon, color, iconColor }) => (
                <article className="stat-card" key={label}>
                  <div className="stat-top">
                    <span>{label}</span>
                    <span
                      style={{
                        display: "grid",
                        placeItems: "center",
                        background: color,
                        color: iconColor,
                        width: 35,
                        height: 35,
                        borderRadius: 10,
                      }}
                    >
                      <Icon size={18} />
                    </span>
                  </div>

                  <div className="stat-value">{value}</div>
                  <p className="stat-note">{note}</p>
                </article>
              ))}
            </section>

            <section>
              <div className="section-header">
                <h2>My Projects</h2>
                <button
                  className="secondary-button"
                  onClick={() => onNavigate?.("/projects")}
                >
                  View all <ArrowRight size={16} />
                </button>
              </div>

              <div className="project-grid">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onOpen={() => onNavigate?.(`/projects/${project.id}`)}
                  />
                ))}
              </div>

              {filteredProjects.length === 0 && (
                <div className="panel empty-state">
                  {search
                    ? "No projects match your search."
                    : "No projects yet. Create your first project!"}
                </div>
              )}
            </section>

            <section className="panel">
              <div className="section-header">
                <h2>Recent Tasks</h2>
                <span style={{ color: "#818a84", fontSize: 12 }}>
                  {filteredTasks.length} tasks
                </span>
              </div>

              <div className="task-list">
                {filteredTasks.slice(0, 8).map((task) => (
                  <div className="task-row" key={task.id}>
                    <TaskCard
                      task={task}
                      onStatusChange={updateTaskStatus}
                    />
                  </div>
                ))}

                {filteredTasks.length === 0 && (
                  <div className="empty-state">
                    No tasks found in your projects yet.
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
