const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkDate() {
  try {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log("Current date/time:", now.toString());
    console.log("Today (start of day):", today.toString());
    console.log("Today (ISO):", today.toISOString());
    console.log("Today (local):", today.toLocaleDateString());

    // Check what's in the database
    const allData = await prisma.dailyFitnessData.findMany({
      where: {
        userId: 1,
      },
      orderBy: {
        date: "desc",
      },
    });

    console.log("\n📊 Database records:");
    allData.forEach((record) => {
      console.log(
        `- Date: ${record.date.toISOString()} (${record.date.toDateString()})`
      );
      console.log(
        `  Steps: ${record.steps}, Calories: ${record.caloriesBurned}`
      );
    });
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDate();
