import { Platform, NativeModules } from "react-native";

const { HealthKitManager } = NativeModules;

class HealthKitService {
  constructor() {
    this.isAvailable = Platform.OS === "ios";
    console.log("HealthKitService initialized, isAvailable:", this.isAvailable);
  }

  // Get user's timezone
  getUserTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  async requestPermissions() {
    if (!this.isAvailable) {
      throw new Error("HealthKit is not available on this platform");
    }

    try {
      console.log("Requesting HealthKit permissions...");
      // For Windows development, simulate successful permissions
      console.log("Mock permissions granted (Windows development)");
      return true;
    } catch (error) {
      console.error("Error requesting HealthKit permissions:", error);
      throw error;
    }
  }

  // Get today's fitness data from HealthKit (mock data for Windows)
  async getTodayFitnessData() {
    if (!this.isAvailable) {
      throw new Error("HealthKit is not available on this platform");
    }

    try {
      console.log(
        "Getting mock HealthKit fitness data (Windows development)..."
      );

      // Generate realistic mock data based on time of day
      const now = new Date();
      const hour = now.getHours();
      const timezone = this.getUserTimezone();

      console.log(
        `Current time: ${now.toLocaleString()}, Timezone: ${timezone}`
      );

      // Generate different data based on time of day
      let steps,
        caloriesBurned,
        activeMinutes,
        distance,
        floorsClimbed,
        heartRate,
        sleepHours;

      if (hour < 6) {
        // Early morning - low activity
        steps = Math.floor(Math.random() * 500) + 100;
        caloriesBurned = Math.floor(Math.random() * 50) + 20;
        activeMinutes = Math.floor(Math.random() * 10) + 5;
        distance = (Math.random() * 0.5 + 0.1).toFixed(1);
        floorsClimbed = Math.floor(Math.random() * 2) + 0;
        heartRate = Math.floor(Math.random() * 10) + 65;
        sleepHours = (Math.random() * 2 + 6).toFixed(1);
      } else if (hour < 12) {
        // Morning - moderate activity
        steps = Math.floor(Math.random() * 2000) + 1000;
        caloriesBurned = Math.floor(Math.random() * 150) + 80;
        activeMinutes = Math.floor(Math.random() * 20) + 15;
        distance = (Math.random() * 1.5 + 0.5).toFixed(1);
        floorsClimbed = Math.floor(Math.random() * 5) + 2;
        heartRate = Math.floor(Math.random() * 15) + 70;
        sleepHours = (Math.random() * 1 + 7).toFixed(1);
      } else if (hour < 18) {
        // Afternoon - high activity
        steps = Math.floor(Math.random() * 3000) + 2000;
        caloriesBurned = Math.floor(Math.random() * 200) + 150;
        activeMinutes = Math.floor(Math.random() * 30) + 25;
        distance = (Math.random() * 2.5 + 1.0).toFixed(1);
        floorsClimbed = Math.floor(Math.random() * 8) + 3;
        heartRate = Math.floor(Math.random() * 20) + 75;
        sleepHours = (Math.random() * 1 + 6.5).toFixed(1);
      } else {
        // Evening - winding down
        steps = Math.floor(Math.random() * 1500) + 800;
        caloriesBurned = Math.floor(Math.random() * 100) + 60;
        activeMinutes = Math.floor(Math.random() * 15) + 10;
        distance = (Math.random() * 1.0 + 0.3).toFixed(1);
        floorsClimbed = Math.floor(Math.random() * 4) + 1;
        heartRate = Math.floor(Math.random() * 12) + 68;
        sleepHours = (Math.random() * 1.5 + 6).toFixed(1);
      }

      const fitnessData = {
        steps,
        caloriesBurned,
        activeMinutes,
        distance,
        floorsClimbed,
        heartRate,
        sleepHours,
      };

      console.log("Mock HealthKit data generated:", fitnessData);
      return fitnessData;
    } catch (error) {
      console.error("Error getting HealthKit data:", error);
      throw error;
    }
  }

  // Check if HealthKit is available
  isHealthKitAvailable() {
    return this.isAvailable;
  }

  // Sync HealthKit data with backend
  async syncHealthKitData(userId) {
    try {
      const healthKitData = await this.getTodayFitnessData();

      // Import the fitness service
      const { fitnessService } = await import("./fitnessService");

      // Update the backend with HealthKit data (timezone will be included by fitnessService)
      const updatedData = await fitnessService.updateTodayFitnessData(
        userId,
        healthKitData
      );

      return updatedData;
    } catch (error) {
      console.error("Error syncing HealthKit data:", error);
      throw error;
    }
  }
}

export const healthKitService = new HealthKitService();
