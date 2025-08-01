const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function fixTodayData() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    console.log("Today's date:", today.toDateString());
    console.log("Yesterday's date:", yesterday.toDateString());

    // Delete the old record with yesterday's date
    await prisma.dailyFitnessData.deleteMany({
      where: {
        userId: 1,
        date: yesterday,
      },
    });

    console.log("✅ Deleted old data from yesterday");

    // Update the existing record for today
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

    console.log("✅ Created new fitness data for today!");
    console.log("📅 Date:", fitnessData.date);
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
    console.error("❌ Error fixing today's data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixTodayData();
