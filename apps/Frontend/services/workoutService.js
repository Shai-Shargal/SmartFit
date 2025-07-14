import apiService from "./apiService";

export const workoutService = {
  // Add new workout
  addWorkout: async (workoutData) => {
    try {
      const response = await apiService.post("/workouts", workoutData);
      return response.workout.id;
    } catch (error) {
      throw error;
    }
  },

  // Get user's workouts
  getUserWorkouts: async () => {
    try {
      const response = await apiService.get("/workouts");
      return response.workouts.map((workout) => ({
        id: workout.id,
        name: workout.name,
        duration: workout.duration,
        caloriesBurned: workout.calories_burned,
        workoutType: workout.workout_type,
        exercises: workout.exercises,
        notes: workout.notes,
        createdAt: workout.created_at,
        updatedAt: workout.updated_at,
      }));
    } catch (error) {
      throw error;
    }
  },

  // Get specific workout
  getWorkout: async (workoutId) => {
    try {
      const response = await apiService.get(`/workouts/${workoutId}`);
      const workout = response.workout;
      return {
        id: workout.id,
        name: workout.name,
        duration: workout.duration,
        caloriesBurned: workout.calories_burned,
        workoutType: workout.workout_type,
        exercises: workout.exercises,
        notes: workout.notes,
        createdAt: workout.created_at,
        updatedAt: workout.updated_at,
      };
    } catch (error) {
      throw error;
    }
  },

  // Update workout
  updateWorkout: async (workoutId, updates) => {
    try {
      const response = await apiService.put(`/workouts/${workoutId}`, updates);
      const workout = response.workout;
      return {
        id: workout.id,
        name: workout.name,
        duration: workout.duration,
        caloriesBurned: workout.calories_burned,
        workoutType: workout.workout_type,
        exercises: workout.exercises,
        notes: workout.notes,
        createdAt: workout.created_at,
        updatedAt: workout.updated_at,
      };
    } catch (error) {
      throw error;
    }
  },

  // Delete workout
  deleteWorkout: async (workoutId) => {
    try {
      await apiService.delete(`/workouts/${workoutId}`);
    } catch (error) {
      throw error;
    }
  },
};
