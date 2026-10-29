
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import { getProjects, createProject } from "../services/api";

function formatProject(project) {
  return {
    ...project,
    name: project.name || project.title || "Untitled project",
    priority: project.priority || "MEDIUM",
    progress: project.progress ?? 0,
    tasks: project._count?.tasks ?? project.tasks?.length ?? 0,
    members: project.members?.length ?? project.membersCount ?? 1,
  };
}

export default function Projects({ onNavigate }) {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        const result = await getProjects();
        const list = Array.isArray(result) ? result : result.projects || [];
        setProjects(list.map(formatProject));
      } catch (err) {
        setError(err.message || "Could not load projects.");
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  async function addProject() {
    const name = window.prompt("Project name:");
    if (!name?.trim() || creating) return;

    const description =
      window.prompt("Project description (optional):")?.trim() || "";

    const choice = window.prompt(
      "Project priority:\n1 = High\n2 = Medium\n3 = Low",
      "2"
    );

    if (choice === null) return;

    const priorities = { "1": "HIGH", "2": "MEDIUM", "3": "LOW" };
    const priority = priorities[choice.trim()];

    if (!priority) {
      window.alert("Choose 1, 2, or 3 for priority.");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const result = await createProject({
        title: name.trim(),
        description,
        priority,
      });

      const savedProject = result.project || result;
      setProjects((previous) => [...previous, formatProject(savedProject)]);
    } catch (err) {
      setError(err.message || "Could not create the project.");
    } finally {
      setCreating(false);
    }
  }

  const visibleProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-layout">
      <Sidebar active="My Projects" onNavigate={onNavigate} />
      <main className="main-content">
        <Navbar search={search} onSearchChange={setSearch} />

        <section className="page-heading">
          <div>
            <h1>Projects</h1>
            <p>Organize your work and focus on what matters.</p>
          </div>
          <button className="primary-button" onClick={addProject} disabled={creating}>
            {creating ? "Creating..." : "+ New Project"}
          </button>
        </section>

        {error && <div className="panel" role="alert">{error}</div>}

        {loading ? (
          <div className="panel">Loading projects...</div>
        ) : (
          <>
            <div className="project-grid">
              {visibleProjects.map((project) => (
                <div key={project.id}>
                  <ProjectCard
                    project={project}
                    onOpen={() => onNavigate?.(`/projects/${project.id}`)}
                  />
                  <p className={`priority-badge priority-${project.priority.toLowerCase()}`}
                    style={{ display: "inline-flex", marginTop: 8 }}>
                    {project.priority} priority
                  </p>
                </div>
              ))}
            </div>
            {visibleProjects.length === 0 && (
              <div className="panel empty-state">
                {search ? "No matching projects." : "No projects yet. Create your first project."}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
