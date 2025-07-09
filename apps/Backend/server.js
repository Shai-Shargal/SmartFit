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
app.use(
  cors({
    origin: [
      "http://localhost:19006",
      "http://localhost:3000",
      "http://localhost:8081",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
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
    console.log("User data from Firebase:", userData); // Debug log

    // Try displayName first, then username, then email, then fallback
    const username =
      userData.displayName ||
      userData.username ||
      userData.email?.split("@")[0] ||
      "User";
    console.log("Extracted username:", username); // Debug log

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

    const finalGreeting = `${greeting}, ${username}!`;
    console.log("Final greeting:", finalGreeting); // Debug log

    res.json({
      greeting: finalGreeting,
      username: username,
      time: currentHour,
      lastLogin: userData.lastLogin,
    });
  } catch (error) {
    console.error("Error fetching user greeting:", error);
    res.status(500).json({ error: "Failed to fetch greeting" });
  }
});

// Get user profile setup status
app.get("/api/user/profile-setup-status", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    const userDoc = await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();
    res.json({
      profileSetupCompleted: userData.profileSetupCompleted || false,
      hasDisplayName: !!userData.displayName,
    });
  } catch (error) {
    console.error("Error fetching profile setup status:", error);
    res.status(500).json({ error: "Failed to fetch profile setup status" });
  }
});

// Setup user profile
app.post("/api/user/setup-profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const {
      displayName,
      age,
      weight,
      height,
      exerciseFrequency,
      exerciseRoutine,
      eatingHabits,
    } = req.body;

    // Validate required fields
    if (!displayName || !age || !weight || !height || !exerciseFrequency) {
      return res.status(400).json({
        error:
          "Missing required fields: displayName, age, weight, height, exerciseFrequency",
      });
    }

    // Validate data types
    if (typeof age !== "number" || age < 1 || age > 120) {
      return res
        .status(400)
        .json({ error: "Age must be a number between 1 and 120" });
    }

    if (typeof weight !== "number" || weight < 20 || weight > 500) {
      return res
        .status(400)
        .json({ error: "Weight must be a number between 20 and 500" });
    }

    if (typeof height !== "number" || height < 100 || height > 250) {
      return res
        .status(400)
        .json({ error: "Height must be a number between 100 and 250 cm" });
    }

    if (
      typeof exerciseFrequency !== "number" ||
      exerciseFrequency < 0 ||
      exerciseFrequency > 7
    ) {
      return res
        .status(400)
        .json({ error: "Exercise frequency must be a number between 0 and 7" });
    }

    // Update user profile
    await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .update({
        displayName: displayName,
        profileSetupCompleted: true,
        profile: {
          personalInfo: {
            age: age,
            weight: weight,
            height: height,
            exerciseFrequency: exerciseFrequency,
            exerciseRoutine: exerciseRoutine || null,
            eatingHabits: eatingHabits || null,
          },
        },
        updatedAt: new Date(),
      });

    res.json({
      success: true,
      message: "Profile setup completed successfully",
      displayName: displayName,
    });
  } catch (error) {
    console.error("Error setting up user profile:", error);
    res.status(500).json({ error: "Failed to setup profile" });
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
