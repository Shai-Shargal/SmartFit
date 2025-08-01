// Test HealthKit integration
import { healthKitService } from "./services/healthKitService";

async function testHealthKit() {
  console.log("Testing HealthKit integration...");

  try {
    // Check if HealthKit is available
    const isAvailable = healthKitService.isHealthKitAvailable();
    console.log("HealthKit available:", isAvailable);

    if (!isAvailable) {
      console.log("HealthKit not available on this platform");
      return;
    }

    // Request permissions
    console.log("Requesting HealthKit permissions...");
    const permissionsResult = await healthKitService.requestPermissions();
    console.log("Permissions result:", permissionsResult);

    // Get fitness data
    console.log("Getting fitness data...");
    const fitnessData = await healthKitService.getTodayFitnessData();
    console.log("Fitness data:", fitnessData);

    // Test syncing with backend
    console.log("Testing sync with backend...");
    const syncedData = await healthKitService.syncHealthKitData(1); // User ID 1
    console.log("Synced data:", syncedData);
  } catch (error) {
    console.error("HealthKit test failed:", error);
  }
}

// Run the test
testHealthKit();
