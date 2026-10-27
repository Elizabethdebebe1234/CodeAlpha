
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";

const initialProjects = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Improve the company website.",
    progress: 60,
    tasks: 10,
    members: 4,
  },
  {
    id: 2,
    name: "Mobile Application",
    description: "Develop the mobile application.",
    progress: 35,
    tasks: 12,
    members: 3,
  },
];

export default function Projects({ onNavigate }) {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");

  function addProject() {
    const name = window.prompt("Project name:");
    if (!name?.trim()) return;

    setProjects((previous) => [
      ...previous,
      {
        id: Date.now(),
        name: name.trim(),
        description: "New project",
        progress: 0,
        tasks: 0,
        members: 1,
      },
    ]);
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
            <p>Organize and track your team's work.</p>
          </div>
          <button className="primary-button" onClick={addProject}>
            + New Project
          </button>
        </section>

        <div className="project-grid">
          {visibleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={() => onNavigate?.(`/projects/${project.id}`)}
            />
          ))}
        </div>

        {visibleProjects.length === 0 && (
          <div className="panel empty-state">No projects found.</div>
        )}
      </main>
    </div>
  );
}
