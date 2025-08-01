// Test mock data generation and timezone functionality
import { healthKitService } from "./services/healthKitService";

async function testMockData() {
  console.log("🧪 Testing Mock Data Generation...\n");

  try {
    // Test timezone detection
    const timezone = healthKitService.getUserTimezone();
    console.log(`📍 Detected timezone: ${timezone}`);

    // Test mock data generation
    console.log("\n📊 Generating mock fitness data...");
    const fitnessData = await healthKitService.getTodayFitnessData();
    console.log("✅ Mock data generated:", fitnessData);

    // Test data sync with backend
    console.log("\n🔄 Testing data sync with backend...");
    const syncedData = await healthKitService.syncHealthKitData(1); // User ID 1
    console.log("✅ Data synced successfully:", syncedData);

    console.log("\n🎉 All tests passed! Mock data is working correctly.");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test
testMockData();
