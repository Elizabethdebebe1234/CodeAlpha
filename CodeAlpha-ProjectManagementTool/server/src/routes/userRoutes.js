
const express = require("express");
const prisma = require("../lib/prisma");
const authenticateToken = require("../middleware/authMiddleware");


const router = express.Router();

// Get registered users for the Team page
router.get("/team", authenticateToken, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json(users);
  } catch (error) {
    console.error("Load team error:", error);
    res.status(500).json({ message: "Could not load team members" });
  }
});

// Update the signed-in user's display name
router.patch("/profile", authenticateToken, async (req, res) => {
  try {
    const name = req.body.name?.trim();

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    res.json({ message: "Profile updated", user });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Could not update profile" });
  }
});

module.exports = router;
