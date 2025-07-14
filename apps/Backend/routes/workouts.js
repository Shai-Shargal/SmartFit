const express = require("express");
const { body, validationResult } = require("express-validator");
const prisma = require("../database");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Add new workout
router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().trim(),
    body("duration").optional().isInt({ min: 1 }),
    body("caloriesBurned").optional().isInt({ min: 0 }),
    body("workoutType")
      .optional()
      .isIn([
        "cardio",
        "strength",
        "flexibility",
        "yoga",
        "pilates",
        "hiit",
        "other",
      ]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user.id;
      const { name, duration, caloriesBurned, workoutType, exercises, notes } =
        req.body;

      const workout = await prisma.workout.create({
        data: {
          userId,
          name,
          duration,
          caloriesBurned,
          workoutType,
          exercises,
          notes,
        },
      });

      res.status(201).json({
        message: "Workout added successfully",
        workout: {
          id: workout.id,
          name: workout.name,
          duration: workout.duration,
          caloriesBurned: workout.caloriesBurned,
          workoutType: workout.workoutType,
          exercises: workout.exercises,
          notes: workout.notes,
          createdAt: workout.createdAt,
        },
      });
    } catch (error) {
      console.error("Error adding workout:", error);
      res.status(500).json({ error: "Failed to add workout" });
    }
  }
);

// Get user's workouts
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const workouts = await prisma.workout.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      workouts: workouts.map((workout) => ({
        id: workout.id,
        name: workout.name,
        duration: workout.duration,
        caloriesBurned: workout.caloriesBurned,
        workoutType: workout.workoutType,
        exercises: workout.exercises,
        notes: workout.notes,
        createdAt: workout.createdAt,
        updatedAt: workout.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching workouts:", error);
    res.status(500).json({ error: "Failed to fetch workouts" });
  }
});

// Get specific workout
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const workoutId = parseInt(req.params.id);

    const workout = await prisma.workout.findFirst({
      where: {
        id: workoutId,
        userId,
      },
    });

    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }

    res.json({
      workout: {
        id: workout.id,
        name: workout.name,
        duration: workout.duration,
        caloriesBurned: workout.caloriesBurned,
        workoutType: workout.workoutType,
        exercises: workout.exercises,
        notes: workout.notes,
        createdAt: workout.createdAt,
        updatedAt: workout.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching workout:", error);
    res.status(500).json({ error: "Failed to fetch workout" });
  }
});

// Update workout
router.put(
  "/:id",
  verifyToken,
  [
    body("name").optional().notEmpty().trim(),
    body("duration").optional().isInt({ min: 1 }),
    body("caloriesBurned").optional().isInt({ min: 0 }),
    body("workoutType")
      .optional()
      .isIn([
        "cardio",
        "strength",
        "flexibility",
        "yoga",
        "pilates",
        "hiit",
        "other",
      ]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user.id;
      const workoutId = parseInt(req.params.id);
      const updates = req.body;

      // Check if workout exists and belongs to user
      const existingWorkout = await prisma.workout.findFirst({
        where: {
          id: workoutId,
          userId,
        },
      });

      if (!existingWorkout) {
        return res.status(404).json({ error: "Workout not found" });
      }

      // Update workout
      const workout = await prisma.workout.update({
        where: { id: workoutId },
        data: updates,
      });

      res.json({
        message: "Workout updated successfully",
        workout: {
          id: workout.id,
          name: workout.name,
          duration: workout.duration,
          caloriesBurned: workout.caloriesBurned,
          workoutType: workout.workoutType,
          exercises: workout.exercises,
          notes: workout.notes,
          createdAt: workout.createdAt,
          updatedAt: workout.updatedAt,
        },
      });
    } catch (error) {
      console.error("Error updating workout:", error);
      res.status(500).json({ error: "Failed to update workout" });
    }
  }
);

// Delete workout
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const workoutId = parseInt(req.params.id);

    const workout = await prisma.workout.findFirst({
      where: {
        id: workoutId,
        userId,
      },
    });

    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }

    await prisma.workout.delete({
      where: { id: workoutId },
    });

    res.json({
      message: "Workout deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting workout:", error);
    res.status(500).json({ error: "Failed to delete workout" });
  }
});

module.exports = router;
