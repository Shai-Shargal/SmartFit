import apiService from "./apiService";

class FitnessService {
  constructor() {
    this.baseURL = "/fitness"; // Remove the /api prefix since apiService already includes it
  }

  // Get today's fitness data for a user
  async getTodayFitnessData(userId) {
    try {
      const response = await apiService.get(`${this.baseURL}/today/${userId}`);
      return response; // The response is already the data, not response.data
    } catch (error) {
      console.error("Error fetching today's fitness data:", error);
      throw error;
    }
  }

  // Update today's fitness data with HealthKit data
  async updateTodayFitnessData(userId, fitnessData) {
    try {
      const response = await apiService.post(
        `${this.baseURL}/update/${userId}`,
        fitnessData
      );
      return response; // The response is already the data, not response.data
    } catch (error) {
      console.error("Error updating fitness data:", error);
      throw error;
    }
  }

  // Get fitness data for a date range
  async getFitnessDataRange(userId, startDate, endDate) {
    try {
      const response = await apiService.get(`${this.baseURL}/range/${userId}`, {
        params: {
          startDate,
          endDate,
        },
      });
      return response; // The response is already the data, not response.data
    } catch (error) {
      console.error("Error fetching fitness data range:", error);
      throw error;
    }
  }

  // Calculate progress percentage for a metric
  calculateProgressPercentage(current, goal) {
    if (!goal || goal === 0) return 0;
    return Math.min((current / goal) * 100, 100);
  }

  // Get default goals (these can be customized per user later)
  getDefaultGoals() {
    return {
      steps: 10000,
      caloriesBurned: 500,
      activeMinutes: 30,
      distance: 5, // km
      floorsClimbed: 10,
      sleepHours: 8,
    };
  }
}

export const fitnessService = new FitnessService();
