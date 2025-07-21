const express = require("express");
const { body, validationResult } = require("express-validator");
const prisma = require("../database");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Get user greeting
router.get("/greeting", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        displayName: true,
        email: true,
        lastLogin: true,
      },
    });

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // Try displayName first, then email, then fallback
    const username =
      userData.displayName || userData.email?.split("@")[0] || "User";

    // Get current time to determine greeting
    const currentHour = new Date().getHours();
    let greeting;

    if (currentHour < 12) {
      greeting = "Good morning";
    } else if (currentHour < 17) {
      greeting = "Good afternoon";
    } else {
      greeting = "Good evening";
    }

    const finalGreeting = `${greeting}, ${username}!`;

    res.json({
      greeting: finalGreeting,
      username: username,
      time: currentHour,
      lastLogin: userData.lastLogin,
    });
  } catch (error) {
    console.error("Error fetching user greeting:", error);
    res.status(500).json({ error: "Failed to fetch greeting" });
  }
});

// Get user profile setup status
router.get("/profile-setup-status", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        profileSetupCompleted: true,
        displayName: true,
      },
    });

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      profileSetupCompleted: userData.profileSetupCompleted || false,
      hasDisplayName: !!userData.displayName,
    });
  } catch (error) {
    console.error("Error fetching profile setup status:", error);
    res.status(500).json({ error: "Failed to fetch profile setup status" });
  }
});

// Setup user profile
router.post(
  "/setup-profile",
  verifyToken,
  [
    body("displayName").notEmpty().trim(),
    body("age").isInt({ min: 1, max: 120 }),
    body("weight").isFloat({ min: 20, max: 500 }),
    body("height").isFloat({ min: 100, max: 250 }),
    body("exerciseFrequency").isInt({ min: 0, max: 7 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user.id;
      const {
        displayName,
        age,
        weight,
        height,
        exerciseFrequency,
        exerciseRoutine,
        eatingHabits,
      } = req.body;

      // Update user profile
      await prisma.user.update({
        where: { id: userId },
        data: {
          displayName,
          age,
          weight,
          height,
          exerciseFrequency,
          exerciseRoutine,
          eatingHabits,
          profileSetupCompleted: true,
        },
      });

      res.json({
        success: true,
        message: "Profile setup completed successfully",
        displayName: displayName,
      });
    } catch (error) {
      console.error("Error setting up user profile:", error);
      res.status(500).json({ error: "Failed to setup profile" });
    }
  }
);

// Get user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const userData = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: userData.id,
      email: userData.email,
      displayName: userData.displayName,
      age: userData.age,
      weight: userData.weight,
      height: userData.height,
      exerciseFrequency: userData.exerciseFrequency,
      exerciseRoutine: userData.exerciseRoutine,
      eatingHabits: userData.eatingHabits,
      profileSetupCompleted: userData.profileSetupCompleted,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      lastLogin: userData.lastLogin,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Update user profile
router.put(
  "/profile",
  verifyToken,
  [
    body("displayName").optional().notEmpty().trim(),
    body("age").optional().isInt({ min: 1, max: 120 }),
    body("weight").optional().isFloat({ min: 20, max: 500 }),
    body("height").optional().isFloat({ min: 100, max: 250 }),
    body("exerciseFrequency").optional().isInt({ min: 0, max: 7 }),
    // exerciseRoutine and eatingHabits are optional strings
    body("exerciseRoutine")
      .optional()
      .custom((v) => v === null || typeof v === "string"),
    body("eatingHabits")
      .optional()
      .custom((v) => v === null || typeof v === "string"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const userId = req.user.id;
      const updateFields = {};
      const allowedFields = [
        "displayName",
        "age",
        "weight",
        "height",
        "exerciseFrequency",
        "exerciseRoutine",
        "eatingHabits",
      ];
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          updateFields[field] = req.body[field];
        }
      });
      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ error: "No valid fields to update" });
      }
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateFields,
      });
      res.json({
        success: true,
        message: "Profile updated successfully",
        profile: {
          id: updatedUser.id,
          email: updatedUser.email,
          displayName: updatedUser.displayName,
          age: updatedUser.age,
          weight: updatedUser.weight,
          height: updatedUser.height,
          exerciseFrequency: updatedUser.exerciseFrequency,
          exerciseRoutine: updatedUser.exerciseRoutine,
          eatingHabits: updatedUser.eatingHabits,
          profileSetupCompleted: updatedUser.profileSetupCompleted,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
          lastLogin: updatedUser.lastLogin,
        },
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  }
);

module.exports = router;
