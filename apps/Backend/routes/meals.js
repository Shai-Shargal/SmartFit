const express = require("express");
const { body, validationResult } = require("express-validator");
const prisma = require("../database");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Add new meal
router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().trim(),
    body("calories").optional().isInt({ min: 0 }),
    body("protein").optional().isFloat({ min: 0 }),
    body("carbs").optional().isFloat({ min: 0 }),
    body("fat").optional().isFloat({ min: 0 }),
    body("mealType").optional().isIn(["breakfast", "lunch", "dinner", "snack"]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user.id;
      const { name, calories, protein, carbs, fat, mealType, notes } = req.body;

      const meal = await prisma.meal.create({
        data: {
          userId,
          name,
          calories,
          protein,
          carbs,
          fat,
          mealType,
          notes,
        },
      });

      res.status(201).json({
        message: "Meal added successfully",
        meal: {
          id: meal.id,
          name: meal.name,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
          mealType: meal.mealType,
          notes: meal.notes,
          createdAt: meal.createdAt,
        },
      });
    } catch (error) {
      console.error("Error adding meal:", error);
      res.status(500).json({ error: "Failed to add meal" });
    }
  }
);

// Get user's meals
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const meals = await prisma.meal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      meals: meals.map((meal) => ({
        id: meal.id,
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        mealType: meal.mealType,
        notes: meal.notes,
        createdAt: meal.createdAt,
        updatedAt: meal.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching meals:", error);
    res.status(500).json({ error: "Failed to fetch meals" });
  }
});

// Get specific meal
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const mealId = parseInt(req.params.id);

    const meal = await prisma.meal.findFirst({
      where: {
        id: mealId,
        userId,
      },
    });

    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }

    res.json({
      meal: {
        id: meal.id,
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        mealType: meal.mealType,
        notes: meal.notes,
        createdAt: meal.createdAt,
        updatedAt: meal.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching meal:", error);
    res.status(500).json({ error: "Failed to fetch meal" });
  }
});

// Update meal
router.put(
  "/:id",
  verifyToken,
  [
    body("name").optional().notEmpty().trim(),
    body("calories").optional().isInt({ min: 0 }),
    body("protein").optional().isFloat({ min: 0 }),
    body("carbs").optional().isFloat({ min: 0 }),
    body("fat").optional().isFloat({ min: 0 }),
    body("mealType").optional().isIn(["breakfast", "lunch", "dinner", "snack"]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user.id;
      const mealId = parseInt(req.params.id);
      const updates = req.body;

      // Check if meal exists and belongs to user
      const existingMeal = await prisma.meal.findFirst({
        where: {
          id: mealId,
          userId,
        },
      });

      if (!existingMeal) {
        return res.status(404).json({ error: "Meal not found" });
      }

      // Update meal
      const meal = await prisma.meal.update({
        where: { id: mealId },
        data: updates,
      });

      res.json({
        message: "Meal updated successfully",
        meal: {
          id: meal.id,
          name: meal.name,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
          mealType: meal.mealType,
          notes: meal.notes,
          createdAt: meal.createdAt,
          updatedAt: meal.updatedAt,
        },
      });
    } catch (error) {
      console.error("Error updating meal:", error);
      res.status(500).json({ error: "Failed to update meal" });
    }
  }
);

// Delete meal
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const mealId = parseInt(req.params.id);

    const meal = await prisma.meal.findFirst({
      where: {
        id: mealId,
        userId,
      },
    });

    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }

    await prisma.meal.delete({
      where: { id: mealId },
    });

    res.json({
      message: "Meal deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting meal:", error);
    res.status(500).json({ error: "Failed to delete meal" });
  }
});

module.exports = router;
