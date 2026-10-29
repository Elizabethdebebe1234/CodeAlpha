
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import { getProjects, getTasks, createTask, apiRequest } from "../services/api";

const statuses = ["To Do", "In Progress", "Done"];

function toUiStatus(status) {
  const value = String(status || "TODO").toUpperCase();

  if (value === "DONE" || value === "COMPLETED") return "Done";
  if (value === "IN_PROGRESS" || value === "IN PROGRESS") return "In Progress";

  return "To Do";
}

function toApiStatus(status) {
  if (status === "Done") return "DONE";
  if (status === "In Progress") return "IN_PROGRESS";
  return "TODO";
}

function formatTask(task) {
  return {
    ...task,
    status: toUiStatus(task.status),
    priority: String(task.priority || "MEDIUM").toLowerCase()
      .replace(/^./, (letter) => letter.toUpperCase()),
    dueDate: task.dueDate
      ? new Date(task.dueDate).toLocaleDateString()
      : "",
    comments: task._count?.comments ?? task.comments?.length ?? 0,
  };
}

export default function ProjectBoard({ onNavigate }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [showTaskForm, setShowTaskForm] = useState(false);
const [taskTitle, setTaskTitle] = useState("");
const [taskDescription, setTaskDescription] = useState("");
const [taskPriority, setTaskPriority] = useState("MEDIUM");
const [taskDueDate, setTaskDueDate] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadBoard() {
      if (!id) {
        setLoading(false);
        setError("Please open a project first to view its tasks.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [projectResult, taskResult] = await Promise.all([
          getProjects(),
          getTasks(id),
        ]);

        const projectList = Array.isArray(projectResult)
          ? projectResult
          : projectResult.projects || [];

        const selectedProject = projectList.find(
          (item) => String(item.id) === String(id)
        );

        if (!selectedProject) {
          throw new Error("Project not found or you do not have access.");
        }

        if (!cancelled) {
          setProject(selectedProject);
          setTasks(
            (Array.isArray(taskResult) ? taskResult : taskResult.tasks || [])
              .map(formatTask)
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load this project.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadBoard();

    return () => {
      cancelled = true;
    };
  }, [id]);

  

   
async function addTask(event) {
  event.preventDefault();

  if (!taskTitle.trim() || creating || !id) return;

  try {
    setCreating(true);
    setError("");

    const result = await createTask(id, {
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      priority: taskPriority,
      dueDate: taskDueDate || null,
    });

    const savedTask = result.task || result;

    setTasks((previous) => [...previous, formatTask(savedTask)]);

    setTaskTitle("");
    setTaskDescription("");
    setTaskPriority("MEDIUM");
    setTaskDueDate("");
    setShowTaskForm(false);
  } catch (err) {
    setError(err.message || "Could not create the task.");
  } finally {
    setCreating(false);
  }
}

    

  async function updateStatus(taskId, status) {
    const previousTasks = tasks;

    setTasks((previous) =>
      previous.map((task) =>
        task.id === taskId ? { ...task, status } : task
      )
    );

    try {
      setError("");

      await apiRequest(`/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: toApiStatus(status) }),
      });
    } catch (err) {
      setTasks(previousTasks);
      setError(err.message || "Could not update task status.");
    }
  }

  return (
    <div className="app-layout">
      <Sidebar active="My Projects" onNavigate={onNavigate} />

      <main className="main-content">
        {showTaskForm && (
  <form className="task-form panel" onSubmit={addTask}>
    <h2>Create a new task</h2>
    <p className="form-description">
      Add a task, set its priority, and choose a deadline.
    </p>

    <div className="form-group">
      <label htmlFor="task-title">Task title</label>
      <input
        id="task-title"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        placeholder="e.g. Finish project presentation"
        required
        autoFocus
      />
    </div>

    <div className="form-group">
      <label htmlFor="task-description">Description</label>
      <textarea
        id="task-description"
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
        placeholder="What needs to be done?"
        rows={3}
      />
    </div>

    <div className="form-group">
      <label htmlFor="task-priority">Priority</label>
      <select
        id="task-priority"
        value={taskPriority}
        onChange={(e) => setTaskPriority(e.target.value)}
      >
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>
    </div>

    <div className="form-group">
      <label htmlFor="task-deadline">Deadline</label>
      <input
        id="task-deadline"
        type="date"
        value={taskDueDate}
        onChange={(e) => setTaskDueDate(e.target.value)}
        min={new Date().toLocaleDateString("en-CA")}
      />
    </div>

    <div className="task-form-actions">
      <button
        type="button"
        className="secondary-button"
        onClick={() => setShowTaskForm(false)}
      >
        Cancel
      </button>

      <button
        type="submit"
        className="primary-button"
        disabled={creating}
      >
        {creating ? "Saving..." : "Create Task"}
      </button>
    </div>
  </form>
)}
        <Navbar />

        <section className="page-heading">
          <div>
            <h1>{project?.title || project?.name || "Project Board"}</h1>
            <p>Project board · Manage tasks and progress</p>
          </div>

          <button
  className="primary-button"
  onClick={() => setShowTaskForm(true)}
  disabled={loading || creating || !id}
>
  + Add Task
</button>
        </section>

        {error && (
          <div className="panel" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="panel">Loading tasks...</div>
        ) : id && !error ? (
          <div className="board-columns">
            {statuses.map((status) => {
              const columnTasks = tasks.filter(
                (task) => task.status === status
              );

              return (
                <section className="board-column" key={status}>
                  <div className="column-title">
                    <span>{status}</span>
                    <span>{columnTasks.length}</span>
                  </div>

                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={updateStatus}
                    />
                  ))}

                  {columnTasks.length === 0 && (
                    <p style={{ color: "#818a84", fontSize: 12 }}>
                      No tasks yet.
                    </p>
                  )}
                </section>
              );
            })}
          </div>
        ) : (
          <div className="panel">
            <p>Choose a project to manage its tasks.</p>
            <button
              className="primary-button"
              onClick={() => {
                if (onNavigate) onNavigate("/projects");
                else navigate("/projects");
              }}
            >
              View Projects
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
