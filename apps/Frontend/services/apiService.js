import { auth } from "./firebase";

const API_BASE_URL = "http://localhost:5000/api"; // Change this to your backend URL

export const apiService = {
  // Get auth token for API requests
  getAuthToken: async () => {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  },

  // Make authenticated API request
  makeAuthenticatedRequest: async (url, options = {}) => {
    const token = await apiService.getAuthToken();
    if (!token) {
      throw new Error("No authentication token available");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  },

  // Get user greeting
  getUserGreeting: async () => {
    try {
      return await apiService.makeAuthenticatedRequest("/user/greeting");
    } catch (error) {
      console.error("Error fetching user greeting:", error);
      throw error;
    }
  },
};
