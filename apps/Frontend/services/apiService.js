import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configure API URL based on platform
const getApiBaseUrl = () => {
  if (__DEV__) {
    // Development mode
    console.log("Platform:", Platform.OS);

    if (Platform.OS === "android") {
      // For Android emulator, use 10.0.2.2
      const url = "http://10.0.2.2:5000/api";
      console.log("Using Android API URL:", url);
      return url;
    } else if (Platform.OS === "ios") {
      // For iOS simulator, use localhost
      // For physical iOS device, you'll need to use your computer's IP address
      const url = "http://localhost:5000/api";
      console.log("Using iOS API URL:", url);
      return url;
    } else {
      // Fallback for other platforms
      const url = "http://localhost:5000/api";
      console.log("Using fallback API URL:", url);
      return url;
    }
  } else {
    // Production mode - replace with your actual server URL
    return "https://your-production-server.com/api";
  }
};

// For testing - you can temporarily override the API URL here
// Uncomment and replace with your computer's IP address if using a physical device
const API_BASE_URL = "http://192.168.1.230:5000/api";

// const API_BASE_URL = getApiBaseUrl();
console.log("Final API Base URL:", API_BASE_URL);

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get stored token (using AsyncStorage for React Native)
  async getToken() {
    try {
      return await AsyncStorage.getItem("authToken");
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }

  // Set token (using AsyncStorage for React Native)
  async setToken(token) {
    try {
      await AsyncStorage.setItem("authToken", token);
    } catch (error) {
      console.error("Error setting token:", error);
    }
  }

  // Remove token (using AsyncStorage for React Native)
  async removeToken() {
    try {
      await AsyncStorage.removeItem("authToken");
    } catch (error) {
      console.error("Error removing token:", error);
    }
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const token = await this.getToken();
    const fullUrl = `${this.baseURL}${endpoint}`;

    console.log("Making request to:", fullUrl);
    console.log("Request options:", options);

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(fullUrl, config);
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      console.error("Request URL:", fullUrl);
      throw error;
    }
  }

  // GET request
  async get(endpoint, options = {}) {
    let url = endpoint;

    // Handle query parameters
    if (options.params) {
      const params = new URLSearchParams();
      Object.keys(options.params).forEach((key) => {
        if (options.params[key] !== undefined && options.params[key] !== null) {
          params.append(key, options.params[key]);
        }
      });
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return this.request(url, { method: "GET" });
  }

  // POST request
  async post(endpoint, data, options = {}) {
    let url = endpoint;

    // Handle query parameters
    if (options.params) {
      const params = new URLSearchParams();
      Object.keys(options.params).forEach((key) => {
        if (options.params[key] !== undefined && options.params[key] !== null) {
          params.append(key, options.params[key]);
        }
      });
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return this.request(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

export default new ApiService();
