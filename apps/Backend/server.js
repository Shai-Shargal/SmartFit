const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const mealRoutes = require("./routes/meals");
const workoutRoutes = require("./routes/workouts");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:19006",
      "http://localhost:8081",
      "http://localhost:5000",
      "http://192.168.1.230:5000",
      "http://192.168.1.230:19006",
      "http://172.23.32.1:5000",
      "http://172.23.32.1:19006",
      // Allow all origins in development
      "*",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan("combined"));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "SmartFit Backend API is running!" });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/workouts", workoutRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Listen on all network interfaces (0.0.0.0) to allow external connections
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Server is accessible at:`);
  console.log(`  - http://localhost:${PORT}`);
  console.log(`  - http://192.168.1.230:${PORT}`);
  console.log(`  - http://172.23.32.1:${PORT}`);
});

module.exports = app;
