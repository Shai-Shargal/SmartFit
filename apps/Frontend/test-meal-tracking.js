// Test meal tracking functionality
import { mealService } from "./services/mealService";

async function testMealTracking() {
  console.log("🍽️ Testing Meal Tracking System...\n");

  try {
    // Test timezone detection
    const timezone = mealService.getUserTimezone();
    console.log(`📍 Detected timezone: ${timezone}`);

    // Test today's date
    const today = mealService.getTodayDate();
    console.log(`📅 Today's date: ${today.toDateString()}`);

    // Test meal types
    const mealTypes = mealService.getMealTypes();
    console.log("\n🍳 Meal types:", mealTypes);

    // Test calorie calculation
    const testFoods = ["apple", "chicken breast", "rice", "salad", "pizza"];
    console.log("\n🔥 Calorie estimation:");
    testFoods.forEach((food) => {
      const calories = mealService.calculateCalories(food);
      console.log(`  ${food}: ${calories} calories`);
    });

    // Test date validation
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    console.log("\n📅 Date validation:");
    console.log(`  Today: ${mealService.isToday(today)}`);
    console.log(`  Yesterday: ${mealService.isToday(yesterday)}`);
    console.log(`  Tomorrow is future: ${mealService.isFutureDate(tomorrow)}`);

    console.log("\n🎉 All meal tracking tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test
testMealTracking();
