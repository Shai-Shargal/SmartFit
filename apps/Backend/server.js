const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const admin = require("firebase-admin");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

// Initialize Firebase Admin
// You'll need to add your Firebase service account key
try {
  // For now, we'll use the default initialization
  // In production, you should use a service account key
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    // Replace with your Firebase project ID
    databaseURL: `https://your-project-id.firebaseio.com`,
  });
  console.log("Firebase Admin initialized successfully");
} catch (error) {
  console.error("Firebase Admin initialization error:", error);
}

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

// Routes
app.get("/", (req, res) => {
  res.json({ message: "SmartFit Backend API is running!" });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Get user greeting
app.get("/api/user/greeting", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    // Get user data from Firestore
    const userDoc = await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();
    const username = userData.username || userData.displayName || "User";

    // Get current time to determine greeting
    const currentHour = new Date().getHours();
    let greeting;

    if (currentHour < 12) {
      greeting = "Good morning";
    } else if (currentHour < 17) {
      greeting = "Good afternoon";
    } else {
      greeting = "Good evening";
    }

    res.json({
      greeting: `${greeting}, ${username}!`,
      username: username,
      time: currentHour,
      lastLogin: userData.lastLogin,
    });
  } catch (error) {
    console.error("Error fetching user greeting:", error);
    res.status(500).json({ error: "Failed to fetch greeting" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
