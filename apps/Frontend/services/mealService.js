import apiService from "./apiService";

export const mealService = {
  // Add new meal
  addMeal: async (mealData) => {
    try {
      const response = await apiService.post("/meals", mealData);
      return response.meal.id;
    } catch (error) {
      throw error;
    }
  },

  // Get user's meals
  getUserMeals: async () => {
    try {
      const response = await apiService.get("/meals");
      return response.meals.map((meal) => ({
        id: meal.id,
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        mealType: meal.meal_type,
        notes: meal.notes,
        createdAt: meal.created_at,
        updatedAt: meal.updated_at,
      }));
    } catch (error) {
      throw error;
    }
  },

  // Get specific meal
  getMeal: async (mealId) => {
    try {
      const response = await apiService.get(`/meals/${mealId}`);
      const meal = response.meal;
      return {
        id: meal.id,
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        mealType: meal.meal_type,
        notes: meal.notes,
        createdAt: meal.created_at,
        updatedAt: meal.updated_at,
      };
    } catch (error) {
      throw error;
    }
  },

  // Update meal
  updateMeal: async (mealId, updates) => {
    try {
      const response = await apiService.put(`/meals/${mealId}`, updates);
      const meal = response.meal;
      return {
        id: meal.id,
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        mealType: meal.meal_type,
        notes: meal.notes,
        createdAt: meal.created_at,
        updatedAt: meal.updated_at,
      };
    } catch (error) {
      throw error;
    }
  },

  // Delete meal
  deleteMeal: async (mealId) => {
    try {
      await apiService.delete(`/meals/${mealId}`);
    } catch (error) {
      throw error;
    }
  },
};
