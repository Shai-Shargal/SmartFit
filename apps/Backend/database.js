const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Test the connection
prisma
  .$connect()
  .then(() => {
    console.log("Connected to PostgreSQL database via Prisma");
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });

// Handle graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
