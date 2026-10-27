
const express = require("express");
const prisma = require("../lib/prisma");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateToken);

// GET /api/projects — list the logged-in user's projects
router.get("/", async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { ownerId: req.user.id },
      include: {
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load projects" });
  }
});

// POST /api/projects — create a project
router.post("/", async (req, res) => {
  try {
    const { title, description = "" } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Project title is required" });
    }

    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        description: String(description),
        ownerId: req.user.id,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not create project" });
  }
});

// GET /api/projects/:projectId/tasks — list project tasks
router.get("/:projectId/tasks", async (req, res) => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.projectId,
        ownerId: req.user.id,
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const tasks = await prisma.task.findMany({
      where: { projectId: project.id },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load tasks" });
  }
});

// POST /api/projects/:projectId/tasks — create a task
router.post("/:projectId/tasks", async (req, res) => {
  try {
    const { title, description = "", priority = "MEDIUM", dueDate, assigneeId } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: req.params.projectId,
        ownerId: req.user.id,
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const allowedPriorities = ["LOW", "MEDIUM", "HIGH"];
    if (!allowedPriorities.includes(priority)) {
      return res.status(400).json({ message: "Invalid task priority" });
    }

    if (assigneeId) {
      const assignee = await prisma.user.findUnique({
        where: { id: assigneeId },
      });

      if (!assignee) {
        return res.status(400).json({ message: "Assignee not found" });
      }
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: String(description),
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: project.id,
        assigneeId: assigneeId || null,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not create task" });
  }
});

module.exports = router;
