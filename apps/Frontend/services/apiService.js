import { auth } from "./firebase";
import { Platform } from "react-native";

// Configure API URL based on platform
const getApiBaseUrl = () => {
  if (__DEV__) {
    // Development mode

    // ⚠️ FOR PHYSICAL DEVICE TESTING: Uncomment the line below and replace with your computer's IP
    // return "http://172.23.32.1:5000/api";

    // For web browser, always use localhost
    if (typeof window !== "undefined") {
      return "http://localhost:5000/api";
    }

    if (Platform.OS === "android") {
      // For Android emulator, use 10.0.2.2
      return "http://10.0.2.2:5000/api";
    } else {
      // For iOS simulator, localhost works
      return "http://localhost:5000/api";
    }
  } else {
    // Production mode - replace with your actual server URL
    return "https://your-production-server.com/api";
  }
};

const API_BASE_URL = getApiBaseUrl();
console.log("Platform detected:", Platform.OS);
console.log("API_BASE_URL:", API_BASE_URL);
console.log("Is web environment:", typeof window !== "undefined");

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

    const fullUrl = `${API_BASE_URL}${url}`;
    console.log("Making API request to:", fullUrl); // Debug log

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Network request failed:", error);
      console.error("API_BASE_URL:", API_BASE_URL);
      console.error("Platform:", Platform.OS);
      throw error;
    }
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

  // Get profile setup status
  getProfileSetupStatus: async () => {
    try {
      return await apiService.makeAuthenticatedRequest(
        "/user/profile-setup-status"
      );
    } catch (error) {
      console.error("Error fetching profile setup status:", error);
      throw error;
    }
  },

  // Setup user profile
  setupProfile: async (profileData) => {
    try {
      return await apiService.makeAuthenticatedRequest("/user/setup-profile", {
        method: "POST",
        body: JSON.stringify(profileData),
      });
    } catch (error) {
      console.error("Error setting up profile:", error);
      throw error;
    }
  },
};
