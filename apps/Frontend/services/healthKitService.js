import { NativeModules, Platform } from "react-native";

const { HealthKitManager } = NativeModules;

class HealthKitService {
  constructor() {
    this.isAvailable = Platform.OS === "ios" && HealthKitManager;
  }

  // Request HealthKit permissions
  async requestPermissions() {
    if (!this.isAvailable) {
      throw new Error("HealthKit is not available on this platform");
    }

    try {
      const result = await HealthKitManager.requestHealthKitPermissions();
      return result;
    } catch (error) {
      console.error("Error requesting HealthKit permissions:", error);
      throw error;
    }
  }

  // Get today's fitness data from HealthKit
  async getTodayFitnessData() {
    if (!this.isAvailable) {
      throw new Error("HealthKit is not available on this platform");
    }

    try {
      const fitnessData = await HealthKitManager.getTodayFitnessData();
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

      // Update the backend with HealthKit data
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
