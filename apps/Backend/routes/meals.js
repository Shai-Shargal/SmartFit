const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Helper function to get today's date in user's timezone
const getTodayInTimezone = (timezone = "UTC") => {
  const now = new Date();
  const userDate = new Date(
    now.toLocaleString("en-US", { timeZone: timezone })
  );
  return new Date(
    userDate.getFullYear(),
    userDate.getMonth(),
    userDate.getDate()
  );
};

// Helper function to calculate calories from food name (basic estimation)
const calculateCalories = (foodName) => {
  const food = foodName.toLowerCase();

  // Basic calorie estimation based on common foods
  if (
    food.includes("apple") ||
    food.includes("banana") ||
    food.includes("orange")
  ) {
    return 80;
  } else if (food.includes("chicken") || food.includes("breast")) {
    return 165;
  } else if (food.includes("rice") || food.includes("pasta")) {
    return 130;
  } else if (food.includes("salad") || food.includes("vegetables")) {
    return 50;
  } else if (food.includes("bread") || food.includes("toast")) {
    return 80;
  } else if (food.includes("eggs") || food.includes("egg")) {
    return 70;
  } else if (food.includes("milk") || food.includes("yogurt")) {
    return 120;
  } else if (food.includes("fish") || food.includes("salmon")) {
    return 200;
  } else if (food.includes("beef") || food.includes("steak")) {
    return 250;
  } else if (food.includes("pizza")) {
    return 300;
  } else if (food.includes("burger") || food.includes("hamburger")) {
    return 350;
  } else if (food.includes("coffee") || food.includes("tea")) {
    return 5;
  } else if (food.includes("water")) {
    return 0;
  } else {
    // Default estimation
    return 150;
  }
};

// Add a meal for a specific date
router.post("/add/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, mealType, date, notes, calories, protein, carbs, fat } =
      req.body;
    const timezone = req.query.timezone || "UTC";

    // Validate required fields
    if (!name || !mealType || !date) {
      return res
        .status(400)
        .json({ error: "Name, mealType, and date are required" });
    }

    // Validate meal type
    const validMealTypes = ["breakfast", "lunch", "dinner", "snack"];
    if (!validMealTypes.includes(mealType)) {
      return res
        .status(400)
        .json({
          error:
            "Invalid meal type. Must be breakfast, lunch, dinner, or snack",
        });
    }

    // Parse and validate date
    const mealDate = new Date(date);
    if (isNaN(mealDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // Calculate estimated calories if not provided
    const estimatedCalories = calories || calculateCalories(name);

    console.log(
      `[Meals] Adding meal for user ${userId} on ${mealDate.toDateString()}`
    );
    console.log(
      `[Meals] Meal: ${name}, Type: ${mealType}, Calories: ${estimatedCalories}`
    );

    // Create the meal
    const meal = await prisma.meal.create({
      data: {
        userId: parseInt(userId),
        name,
        mealType,
        date: mealDate,
        calories: estimatedCalories,
        protein: protein || null,
        carbs: carbs || null,
        fat: fat || null,
        notes: notes || null,
      },
    });

    // Update daily meal summary
    await updateDailyMealSummary(parseInt(userId), mealDate, timezone);

    res.json({
      success: true,
      meal,
      message: "Meal added successfully",
    });
  } catch (error) {
    console.error("Error adding meal:", error);
    res.status(500).json({ error: "Failed to add meal" });
  }
});

// Get meals for a specific date
router.get("/date/:userId/:date", async (req, res) => {
  try {
    const { userId, date } = req.params;
    const timezone = req.query.timezone || "UTC";

    // Parse date
    const mealDate = new Date(date);
    if (isNaN(mealDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    console.log(
      `[Meals] Getting meals for user ${userId} on ${mealDate.toDateString()}`
    );

    // Get meals for the date
    const meals = await prisma.meal.findMany({
      where: {
        userId: parseInt(userId),
        date: mealDate,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Get daily summary
    const dailySummary = await prisma.dailyMealSummary.findUnique({
      where: {
        userId_date: {
          userId: parseInt(userId),
          date: mealDate,
        },
      },
    });

    res.json({
      success: true,
      meals,
      dailySummary,
      date: mealDate.toISOString().split("T")[0],
    });
  } catch (error) {
    console.error("Error getting meals:", error);
    res.status(500).json({ error: "Failed to get meals" });
  }
});

// Get meals for today
router.get("/today/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const timezone = req.query.timezone || "UTC";
    const today = getTodayInTimezone(timezone);

    console.log(`[Meals] Getting today's meals for user ${userId}`);
    console.log(
      `[Meals] Today's date in timezone ${timezone}: ${today.toDateString()}`
    );

    // Get meals for today
    const meals = await prisma.meal.findMany({
      where: {
        userId: parseInt(userId),
        date: today,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Get daily summary
    const dailySummary = await prisma.dailyMealSummary.findUnique({
      where: {
        userId_date: {
          userId: parseInt(userId),
          date: today,
        },
      },
    });

    res.json({
      success: true,
      meals,
      dailySummary,
      date: today.toISOString().split("T")[0],
    });
  } catch (error) {
    console.error("Error getting today's meals:", error);
    res.status(500).json({ error: "Failed to get today's meals" });
  }
});

// Get meals for a date range (for calendar view)
router.get("/range/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    const timezone = req.query.timezone || "UTC";

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "startDate and endDate are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    console.log(
      `[Meals] Getting meals for user ${userId} from ${start.toDateString()} to ${end.toDateString()}`
    );

    // Get meals for the date range
    const meals = await prisma.meal.findMany({
      where: {
        userId: parseInt(userId),
        date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        date: "asc",
        createdAt: "asc",
      },
    });

    // Get daily summaries for the range
    const dailySummaries = await prisma.dailyMealSummary.findMany({
      where: {
        userId: parseInt(userId),
        date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    res.json({
      success: true,
      meals,
      dailySummaries,
    });
  } catch (error) {
    console.error("Error getting meals range:", error);
    res.status(500).json({ error: "Failed to get meals range" });
  }
});

// Delete a meal
router.delete("/:mealId", async (req, res) => {
  try {
    const { mealId } = req.params;
    const timezone = req.query.timezone || "UTC";

    // Get the meal to know the date and userId
    const meal = await prisma.meal.findUnique({
      where: { id: parseInt(mealId) },
    });

    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }

    console.log(`[Meals] Deleting meal ${mealId} for user ${meal.userId}`);

    // Delete the meal
    await prisma.meal.delete({
      where: { id: parseInt(mealId) },
    });

    // Update daily meal summary
    await updateDailyMealSummary(meal.userId, meal.date, timezone);

    res.json({
      success: true,
      message: "Meal deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting meal:", error);
    res.status(500).json({ error: "Failed to delete meal" });
  }
});

// Helper function to update daily meal summary
async function updateDailyMealSummary(userId, date, timezone) {
  try {
    // Get all meals for the date
    const meals = await prisma.meal.findMany({
      where: {
        userId,
        date,
      },
    });

    // Calculate totals
    const totals = {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      breakfastCalories: 0,
      lunchCalories: 0,
      dinnerCalories: 0,
      snackCalories: 0,
    };

    meals.forEach((meal) => {
      const calories = meal.calories || 0;
      const protein = parseFloat(meal.protein) || 0;
      const carbs = parseFloat(meal.carbs) || 0;
      const fat = parseFloat(meal.fat) || 0;

      totals.totalCalories += calories;
      totals.totalProtein += protein;
      totals.totalCarbs += carbs;
      totals.totalFat += fat;

      // Add to meal type totals
      switch (meal.mealType) {
        case "breakfast":
          totals.breakfastCalories += calories;
          break;
        case "lunch":
          totals.lunchCalories += calories;
          break;
        case "dinner":
          totals.dinnerCalories += calories;
          break;
        case "snack":
          totals.snackCalories += calories;
          break;
      }
    });

    // Upsert daily summary
    await prisma.dailyMealSummary.upsert({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
      update: {
        totalCalories: totals.totalCalories,
        totalProtein: totals.totalProtein,
        totalCarbs: totals.totalCarbs,
        totalFat: totals.totalFat,
        breakfastCalories: totals.breakfastCalories,
        lunchCalories: totals.lunchCalories,
        dinnerCalories: totals.dinnerCalories,
        snackCalories: totals.snackCalories,
      },
      create: {
        userId,
        date,
        totalCalories: totals.totalCalories,
        totalProtein: totals.totalProtein,
        totalCarbs: totals.totalCarbs,
        totalFat: totals.totalFat,
        breakfastCalories: totals.breakfastCalories,
        lunchCalories: totals.lunchCalories,
        dinnerCalories: totals.dinnerCalories,
        snackCalories: totals.snackCalories,
      },
    });

    console.log(
      `[Meals] Updated daily summary for user ${userId} on ${date.toDateString()}`
    );
    console.log(`[Meals] Total calories: ${totals.totalCalories}`);
  } catch (error) {
    console.error("Error updating daily meal summary:", error);
  }
}

module.exports = router;
