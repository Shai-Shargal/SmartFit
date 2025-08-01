const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function fixDate() {
  try {
    // Delete all existing records
    await prisma.dailyFitnessData.deleteMany({
      where: {
        userId: 1,
      },
    });

    console.log("✅ Deleted all existing records");

    // Create new record with correct date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log("Creating record for:", today.toDateString());

    const fitnessData = await prisma.dailyFitnessData.create({
      data: {
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

    console.log("✅ Created new record!");
    console.log("📅 Date:", fitnessData.date.toDateString());
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
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDate();
