import { apiService } from "./apiService";

class MealService {
  constructor() {
    this.baseUrl = "/meals";
  }

  // Get user's timezone
  getUserTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  // Add a meal for a specific date
  async addMeal(userId, mealData) {
    try {
      const timezone = this.getUserTimezone();
      console.log(`[MealService] Adding meal for user ${userId}`);
      console.log(`[MealService] Meal data:`, mealData);
      console.log(`[MealService] User timezone: ${timezone}`);

      const response = await apiService.post(
        `${this.baseUrl}/add/${userId}`,
        mealData,
        { params: { timezone } }
      );

      console.log(`[MealService] Meal added successfully:`, response);
      return response;
    } catch (error) {
      console.error("[MealService] Error adding meal:", error);
      throw error;
    }
  }

  // Get meals for today
  async getTodayMeals(userId) {
    try {
      const timezone = this.getUserTimezone();
      console.log(`[MealService] Getting today's meals for user ${userId}`);
      console.log(`[MealService] User timezone: ${timezone}`);

      const response = await apiService.get(`${this.baseUrl}/today/${userId}`, {
        params: { timezone },
      });

      console.log(`[MealService] Today's meals:`, response);
      return response;
    } catch (error) {
      console.error("[MealService] Error getting today's meals:", error);
      throw error;
    }
  }

  // Get meals for a specific date
  async getMealsByDate(userId, date) {
    try {
      const timezone = this.getUserTimezone();
      const dateString = date.toISOString().split("T")[0];

      console.log(
        `[MealService] Getting meals for user ${userId} on ${dateString}`
      );
      console.log(`[MealService] User timezone: ${timezone}`);

      const response = await apiService.get(
        `${this.baseUrl}/date/${userId}/${dateString}`,
        { params: { timezone } }
      );

      console.log(`[MealService] Meals for ${dateString}:`, response);
      return response;
    } catch (error) {
      console.error("[MealService] Error getting meals by date:", error);
      throw error;
    }
  }

  // Get meals for a date range (for calendar view)
  async getMealsByRange(userId, startDate, endDate) {
    try {
      const timezone = this.getUserTimezone();
      const startString = startDate.toISOString().split("T")[0];
      const endString = endDate.toISOString().split("T")[0];

      console.log(
        `[MealService] Getting meals for user ${userId} from ${startString} to ${endString}`
      );
      console.log(`[MealService] User timezone: ${timezone}`);

      const response = await apiService.get(`${this.baseUrl}/range/${userId}`, {
        params: {
          startDate: startString,
          endDate: endString,
          timezone,
        },
      });

      console.log(`[MealService] Meals for range:`, response);
      return response;
    } catch (error) {
      console.error("[MealService] Error getting meals by range:", error);
      throw error;
    }
  }

  // Delete a meal
  async deleteMeal(mealId) {
    try {
      const timezone = this.getUserTimezone();
      console.log(`[MealService] Deleting meal ${mealId}`);
      console.log(`[MealService] User timezone: ${timezone}`);

      const response = await apiService.delete(`${this.baseUrl}/${mealId}`, {
        params: { timezone },
      });

      console.log(`[MealService] Meal deleted successfully:`, response);
      return response;
    } catch (error) {
      console.error("[MealService] Error deleting meal:", error);
      throw error;
    }
  }

  // Calculate estimated calories from food name
  calculateCalories(foodName) {
    const food = foodName.toLowerCase();

    // Basic calorie estimation based on common foods
    if (
      food.includes("apple") ||
      food.includes("banana") ||
      food.includes("orange")
    ) {
      return 80;
    } else if (food.includes("chicken") || food.includes("breast")) {
      return 165;
    } else if (food.includes("rice") || food.includes("pasta")) {
      return 130;
    } else if (food.includes("salad") || food.includes("vegetables")) {
      return 50;
    } else if (food.includes("bread") || food.includes("toast")) {
      return 80;
    } else if (food.includes("eggs") || food.includes("egg")) {
      return 70;
    } else if (food.includes("milk") || food.includes("yogurt")) {
      return 120;
    } else if (food.includes("fish") || food.includes("salmon")) {
      return 200;
    } else if (food.includes("beef") || food.includes("steak")) {
      return 250;
    } else if (food.includes("pizza")) {
      return 300;
    } else if (food.includes("burger") || food.includes("hamburger")) {
      return 350;
    } else if (food.includes("coffee") || food.includes("tea")) {
      return 5;
    } else if (food.includes("water")) {
      return 0;
    } else {
      // Default estimation
      return 150;
    }
  }

  // Get meal type options
  getMealTypes() {
    return [
      { value: "breakfast", label: "Breakfast", icon: "sunny" },
      { value: "lunch", label: "Lunch", icon: "restaurant" },
      { value: "dinner", label: "Dinner", icon: "moon" },
      { value: "snack", label: "Snack", icon: "cafe" },
    ];
  }

  // Format meal data for display
  formatMealData(meals) {
    if (!meals || !Array.isArray(meals)) return {};

    const mealTypes = this.getMealTypes();
    const formatted = {};

    mealTypes.forEach((type) => {
      formatted[type.value] = meals.filter(
        (meal) => meal.mealType === type.value
      );
    });

    return formatted;
  }

  // Calculate daily totals
  calculateDailyTotals(meals) {
    if (!meals || !Array.isArray(meals)) {
      return {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        mealCount: 0,
      };
    }

    return meals.reduce(
      (totals, meal) => {
        totals.totalCalories += meal.calories || 0;
        totals.totalProtein += parseFloat(meal.protein) || 0;
        totals.totalCarbs += parseFloat(meal.carbs) || 0;
        totals.totalFat += parseFloat(meal.fat) || 0;
        totals.mealCount += 1;
        return totals;
      },
      {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        mealCount: 0,
      }
    );
  }

  // Check if a date is today
  isToday(date) {
    const today = new Date();
    const checkDate = new Date(date);

    return (
      checkDate.getDate() === today.getDate() &&
      checkDate.getMonth() === today.getMonth() &&
      checkDate.getFullYear() === today.getFullYear()
    );
  }

  // Check if a date is in the future
  isFutureDate(date) {
    const today = new Date();
    const checkDate = new Date(date);

    return checkDate > today;
  }

  // Get today's date in user's timezone
  getTodayDate() {
    const timezone = this.getUserTimezone();
    const now = new Date();
    const userDate = new Date(
      now.toLocaleString("en-US", { timeZone: timezone })
    );
    return new Date(
      userDate.getFullYear(),
      userDate.getMonth(),
      userDate.getDate()
    );
  }
}

export const mealService = new MealService();
