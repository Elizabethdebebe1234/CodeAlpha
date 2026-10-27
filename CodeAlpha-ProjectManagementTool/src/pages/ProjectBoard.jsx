
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";

const initialTasks = [
  {
    id: 1,
    title: "Design homepage",
    description: "Create the main page layout.",
    status: "To Do",
    priority: "High",
    dueDate: "Oct 25",
    comments: 2,
  },
  {
    id: 2,
    title: "Build navigation",
    description: "Implement responsive navigation.",
    status: "In Progress",
    priority: "Medium",
    dueDate: "Oct 27",
    comments: 1,
  },
  {
    id: 3,
    title: "Create project setup",
    description: "Initialize the application.",
    status: "Done",
    priority: "Low",
    dueDate: "Oct 20",
    comments: 0,
  },
];

const statuses = ["To Do", "In Progress", "Done"];

export default function ProjectBoard({ onNavigate }) {
  const [tasks, setTasks] = useState(initialTasks);

  function addTask() {
    const title = window.prompt("Enter task title:");
    if (!title?.trim()) return;

    setTasks((previous) => [
      ...previous,
      {
        id: Date.now(),
        title: title.trim(),
        description: "New task",
        status: "To Do",
        priority: "Medium",
        dueDate: "",
        comments: 0,
      },
    ]);
  }

  function updateStatus(id, status) {
    setTasks((previous) =>
      previous.map((task) => task.id === id ? { ...task, status } : task)
    );
  }

  return (
    <div className="app-layout">
      <Sidebar active="My Projects" onNavigate={onNavigate} />

      <main className="main-content">
        <Navbar />

        <section className="page-heading">
          <div>
            <h1>Website Redesign</h1>
            <p>Project board · Manage tasks and progress</p>
          </div>
          <button className="primary-button" onClick={addTask}>
            + Add Task
          </button>
        </section>

        <div className="board-columns">
          {statuses.map((status) => {
            const columnTasks = tasks.filter((task) => task.status === status);

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
      </main>
    </div>
  );
}
