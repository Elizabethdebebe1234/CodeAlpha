
import { ArrowUpRight, FolderKanban } from "lucide-react";

export default function ProjectCard({ project, onOpen }) {
  const progress = Math.min(100, Math.max(0, project.progress ?? 0));

  return (
    <article className="project-card">
      <div className="project-card-top">
        <div
          className="project-icon"
          style={{
            background: project.color || "#e7f0e9",
            color: project.iconColor || "#1c4938",
          }}
        >
          <FolderKanban size={21} />
        </div>

        <button
          type="button"
          className="icon-button"
          aria-label={`Open ${project.name}`}
          onClick={() => onOpen?.(project)}
        >
          <ArrowUpRight size={18} />
        </button>
      </div>

      <h3>{project.name}</h3>
      <p>{project.description}</p>

      <div className="project-progress">
        <div className="progress-label">
          <span>Progress</span>
          <strong>{progress}%</strong>
        </div>

        <div
          className="progress-track"
          role="progressbar"
          aria-label={`${project.name} progress`}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <p style={{ marginTop: 15 }}>
        {project.tasks} tasks · {project.members} team members
      </p>
    </article>
  );
}
