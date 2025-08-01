const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function addTodayData() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log("Adding fitness data for today:", today.toDateString());

    const fitnessData = await prisma.dailyFitnessData.upsert({
      where: {
        userId_date: {
          userId: 1,
          date: today,
        },
      },
      update: {
        steps: 4200,
        caloriesBurned: 320,
        activeMinutes: 22,
        distance: 3.1,
        floorsClimbed: 6,
        heartRate: 75,
        sleepHours: 8.2,
      },
      create: {
        userId: 1,
        date: today,
        steps: 4200,
        caloriesBurned: 320,
        activeMinutes: 22,
        distance: 3.1,
        floorsClimbed: 6,
        heartRate: 75,
        sleepHours: 8.2,
      },
    });

    console.log("✅ Today's fitness data added successfully!");
    console.log("📊 Data:", {
      steps: fitnessData.steps,
      caloriesBurned: fitnessData.caloriesBurned,
      activeMinutes: fitnessData.activeMinutes,
      distance: fitnessData.distance,
      floorsClimbed: fitnessData.floorsClimbed,
      heartRate: fitnessData.heartRate,
      sleepHours: fitnessData.sleepHours,
    });
  } catch (error) {
    console.error("❌ Error adding today's data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

addTodayData();
