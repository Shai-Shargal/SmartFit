const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Helper function to get today's date in user's timezone
function getTodayInTimezone(timezone = "UTC") {
  const now = new Date();
  const userDate = new Date(
    now.toLocaleString("en-US", { timeZone: timezone })
  );
  userDate.setHours(0, 0, 0, 0);
  return userDate;
}

// Get today's fitness data for a user
router.get("/today/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { timezone = "UTC" } = req.query;

    const today = getTodayInTimezone(timezone);

    console.log(`[Fitness] Getting today's data for user ${userId}`);
    console.log(`[Fitness] User timezone: ${timezone}`);
    console.log(
      `[Fitness] Today's date in user timezone: ${today.toDateString()}`
    );
    console.log(`[Fitness] Today's date ISO: ${today.toISOString()}`);

    const fitnessData = await prisma.dailyFitnessData.findUnique({
      where: {
        userId_date: {
          userId: parseInt(userId),
          date: today,
        },
      },
    });

    if (!fitnessData) {
      console.log(
        `[Fitness] No data found for user ${userId} on ${today.toDateString()}`
      );
      return res.json({
        steps: 0,
        caloriesBurned: 0,
        activeMinutes: 0,
        distance: 0,
        floorsClimbed: 0,
        heartRate: 0,
        sleepHours: 0,
      });
    }

    console.log(`[Fitness] Found data for user ${userId}:`, fitnessData);
    res.json(fitnessData);
  } catch (error) {
    console.error("Error fetching today's fitness data:", error);
    res.status(500).json({ error: "Failed to fetch fitness data" });
  }
});

// Update today's fitness data (called from iOS app with HealthKit data)
router.post("/update/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { timezone = "UTC" } = req.query;
    const {
      steps,
      caloriesBurned,
      activeMinutes,
      distance,
      floorsClimbed,
      heartRate,
      sleepHours,
    } = req.body;

    const today = getTodayInTimezone(timezone);

    console.log(`[Fitness] Updating data for user ${userId}`);
    console.log(`[Fitness] User timezone: ${timezone}`);
    console.log(
      `[Fitness] Today's date in user timezone: ${today.toDateString()}`
    );
    console.log(`[Fitness] Today's date ISO: ${today.toISOString()}`);
    console.log(`[Fitness] Fitness data received:`, {
      steps,
      caloriesBurned,
      activeMinutes,
      distance,
      floorsClimbed,
      heartRate,
      sleepHours,
    });

    const fitnessData = await prisma.dailyFitnessData.upsert({
      where: {
        userId_date: {
          userId: parseInt(userId),
          date: today,
        },
      },
      update: {
        steps: steps || 0,
        caloriesBurned: caloriesBurned || 0,
        activeMinutes: activeMinutes || 0,
        distance: distance || 0,
        floorsClimbed: floorsClimbed || 0,
        heartRate: heartRate || 0,
        sleepHours: sleepHours || 0,
      },
      create: {
        userId: parseInt(userId),
        date: today,
        steps: steps || 0,
        caloriesBurned: caloriesBurned || 0,
        activeMinutes: activeMinutes || 0,
        distance: distance || 0,
        floorsClimbed: floorsClimbed || 0,
        heartRate: heartRate || 0,
        sleepHours: sleepHours || 0,
      },
    });

    console.log(`[Fitness] Data updated successfully:`, fitnessData);
    res.json(fitnessData);
  } catch (error) {
    console.error("Error updating fitness data:", error);
    res.status(500).json({ error: "Failed to update fitness data" });
  }
});

// Get fitness data for a specific date range
router.get("/range/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const fitnessData = await prisma.dailyFitnessData.findMany({
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

    res.json(fitnessData);
  } catch (error) {
    console.error("Error fetching fitness data range:", error);
    res.status(500).json({ error: "Failed to fetch fitness data range" });
  }
});

module.exports = router;
