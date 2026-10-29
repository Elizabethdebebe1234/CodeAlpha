
const express = require("express");
const prisma = require("../lib/prisma");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateToken);

async function findAccessibleTask(taskId, userId) {
  return prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        ownerId: userId,
      },
    },
  });
}
// PATCH /api/tasks/:id — update status, priority or assignment
router.patch("/:id", async (req, res) => {
  try {
    const task = await findAccessibleTask(req.params.id, req.user.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const { title, description, status, priority, assigneeId, dueDate } = req.body;
    const data = {};

    if (title !== undefined) {
      if (!String(title).trim()) {
        return res.status(400).json({ message: "Title cannot be empty" });
      }
      data.title = String(title).trim();
    }

    if (description !== undefined) data.description = String(description);

    if (status !== undefined) {
      if (!["TODO", "IN_PROGRESS", "DONE"].includes(status)) {
        return res.status(400).json({ message: "Invalid task status" });
      }
      data.status = status;
    }

    if (priority !== undefined) {
      if (!["LOW", "MEDIUM", "HIGH"].includes(priority)) {
        return res.status(400).json({ message: "Invalid task priority" });
      }
      data.priority = priority;
    }

    if (assigneeId !== undefined) {
      if (assigneeId) {
        const user = await prisma.user.findUnique({ where: { id: assigneeId } });
        if (!user) {
          return res.status(400).json({ message: "Assignee not found" });
        }
      }
      data.assigneeId = assigneeId || null;
    }

    if (dueDate !== undefined) {
      const parsedDate = dueDate ? new Date(dueDate) : null;
      if (parsedDate && Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: "Invalid due date" });
      }
      data.dueDate = parsedDate;
    }

    const updated = await prisma.task.update({
      where: { id: task.id },
      data,
      include: {
        assignee: { select: { id: true, name: true, email: true } },
      },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not update task" });
  }
});

// GET /api/tasks/:id/comments — list comments
router.get("/:id/comments", async (req, res) => {
  try {
    const task = await findAccessibleTask(req.params.id, req.user.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const comments = await prisma.comment.findMany({
      where: { taskId: task.id },
      include: {
        author: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load comments" });
  }
});

// POST /api/tasks/:id/comments — add a comment
router.post("/:id/comments", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const task = await findAccessibleTask(req.params.id, req.user.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        taskId: task.id,
        authorId: req.user.id,
      },
      include: {
        author: { select: { id: true, name: true } },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not add comment" });
  }
});

module.exports = router;
