const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get today's fitness data for a user
router.get("/today/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const fitnessData = await prisma.dailyFitnessData.findUnique({
      where: {
        userId_date: {
          userId: parseInt(userId),
          date: today,
        },
      },
    });

    if (!fitnessData) {
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
    const {
      steps,
      caloriesBurned,
      activeMinutes,
      distance,
      floorsClimbed,
      heartRate,
      sleepHours,
    } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

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
