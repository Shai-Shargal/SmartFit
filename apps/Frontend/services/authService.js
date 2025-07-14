import apiService from "./apiService";

export const authService = {
  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      const response = await apiService.post("/auth/login", {
        email,
        password,
      });

      // Store the token
      await apiService.setToken(response.token);

      return response.user;
    } catch (error) {
      throw error;
    }
  },

  // Register new user
  register: async (email, password) => {
    try {
      const response = await apiService.post("/auth/register", {
        email,
        password,
      });

      // Store the token
      await apiService.setToken(response.token);

      return response.user;
    } catch (error) {
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      // Remove the token
      await apiService.removeToken();
    } catch (error) {
      throw error;
    }
  },

  // Get current user from stored token
  getCurrentUser: async () => {
    const token = await apiService.getToken();
    if (!token) {
      return null;
    }

    // For now, we'll return a basic user object
    // In a real app, you might want to decode the JWT token or make an API call
    return { token };
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    const token = await apiService.getToken();
    return !!token;
  },

  // Get user profile from API
  getUserProfile: async () => {
    try {
      const response = await apiService.get("/user/profile");
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (updates) => {
    try {
      const response = await apiService.put("/user/profile", updates);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user greeting
  getUserGreeting: async () => {
    try {
      const response = await apiService.get("/user/greeting");
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get profile setup status
  getProfileSetupStatus: async () => {
    try {
      const response = await apiService.get("/user/profile-setup-status");
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Setup user profile
  setupProfile: async (profileData) => {
    try {
      const response = await apiService.post(
        "/user/setup-profile",
        profileData
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};
