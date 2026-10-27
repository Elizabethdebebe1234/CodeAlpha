
import { useMemo, useState } from "react";
import {
  FolderKanban,
  CheckCircle2,
  Clock3,
  Users,
  Plus,
  ArrowRight,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProjectCard from "../components/ProjectCard";
import TaskCard from "../components/TaskCard";

const initialProjects = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Create a better digital experience for our customers.",
    progress: 72,
    tasks: 18,
    members: 5,
    color: "#e7f0e9",
    iconColor: "#1c4938",
  },
  {
    id: 2,
    name: "Mobile Application",
    description: "Build an intuitive mobile experience from the ground up.",
    progress: 45,
    tasks: 24,
    members: 4,
    color: "#eaf0ff",
    iconColor: "#5477c2",
  },
  {
    id: 3,
    name: "Marketing Campaign",
    description: "Plan and launch our next product campaign.",
    progress: 30,
    tasks: 12,
    members: 3,
    color: "#fff0df",
    iconColor: "#b77a35",
  },
];

const initialTasks = [
  {
    id: 1,
    title: "Design the landing page",
    description: "Finalize the homepage layout and visual direction.",
    status: "In Progress",
    priority: "High",
    dueDate: "Oct 24",
    comments: 4,
  },
  {
    id: 2,
    title: "Review user requirements",
    description: "Confirm the project scope with the team.",
    status: "To Do",
    priority: "Medium",
    dueDate: "Oct 25",
    comments: 2,
  },
  {
    id: 3,
    title: "Prepare initial wireframes",
    description: "Create wireframes for the main application pages.",
    status: "Done",
    priority: "Low",
    dueDate: "Oct 20",
    comments: 3,
  },
];

export default function Dashboard({ onNavigate }) {
  const [projects, setProjects] = useState(initialProjects);
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) =>
        `${project.name} ${project.description}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [projects, search]
  );

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) =>
        `${task.title} ${task.description}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [tasks, search]
  );

  function createProject() {
    const name = window.prompt("Enter your new project name:");
    if (!name?.trim()) return;

    setProjects((current) => [
      ...current,
      {
        id: Date.now(),
        name: name.trim(),
        description: "A new project ready for your team.",
        progress: 0,
        tasks: 0,
        members: 1,
        color: "#e7f0e9",
        iconColor: "#1c4938",
      },
    ]);
  }

  function updateTaskStatus(taskId, status) {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, status } : task
      )
    );
  }

  const completed = tasks.filter((task) => task.status === "Done").length;
  const inProgress = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const stats = [
    {
      label: "Total Projects",
      value: projects.length,
      note: "Projects in this demo workspace",
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
      note: "Tasks currently being worked on",
      icon: Clock3,
      color: "#eaf0ff",
      iconColor: "#5477c2",
    },
    {
      label: "Team Members",
      value: projects.reduce((sum, project) => sum + project.members, 0),
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
              WEDNESDAY, OCTOBER 21
            </p>
            <h1>Good morning, Liz 👋</h1>
            <p>Here's what's happening with your projects today.</p>
          </div>

          <button className="primary-button" onClick={createProject}>
            <Plus size={18} />
            New project
          </button>
        </section>

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
            <div className="panel empty-state">No projects match your search.</div>
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
            {filteredTasks.map((task) => (
              <div className="task-row" key={task.id}>
                <TaskCard task={task} onStatusChange={updateTaskStatus} />
              </div>
            ))}

            {filteredTasks.length === 0 && (
              <div className="empty-state">No tasks match your search.</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
