import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { authService } from "../services/authService";
import { fitnessService } from "../services/fitnessService";

const { width, height } = Dimensions.get("window");

// Define a color palette for the app
const COLORS = {
  primary: "#111111", // Black (main)
  secondary: "#e11d48", // Red
  accent: "#fff", // White
  background: "#111111", // Black background
  text: "#fff", // White text
  inputBg: "#222", // Slightly lighter black for inputs
  border: "#e11d48", // Red border
  placeholder: "#9ca3af",
  subtitle: "#e11d48", // Red for subtitles
  error: "#e11d48",
};

const MainScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({
    name: "Alex",
    workoutProgress: 25,
    workoutGoal: 60,
    caloriesConsumed: 1200,
    caloriesGoal: 2000,
  });

  const [fitnessData, setFitnessData] = useState({
    steps: 0,
    caloriesBurned: 0,
    activeMinutes: 0,
    distance: 0,
    floorsClimbed: 0,
    heartRate: 0,
    sleepHours: 0,
  });

  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [greetingData, setGreetingData] = useState({
    greeting: "Good morning",
    username: "User",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentTime(timeString);

      const dateString = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setCurrentDate(dateString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check profile setup status and fetch greeting
    const checkProfileAndFetchGreeting = async () => {
      try {
        // Fetch user profile
        const profile = await authService.getUserProfile();
        // Check if all required fields are present and valid
        const requiredFields = [
          "displayName",
          "age",
          "weight",
          "height",
          "exerciseFrequency",
        ];
        const isProfileComplete = requiredFields.every((field) => {
          const value = profile[field];
          if (field === "displayName") return value && value.trim() !== "";
          if (["age", "exerciseFrequency"].includes(field))
            return !isNaN(Number(value)) && Number(value) > 0;
          if (["weight", "height"].includes(field))
            return !isNaN(Number(value)) && Number(value) > 0;
          return !!value;
        });
        if (!isProfileComplete) {
          navigation.replace("ProfileSetup");
          return;
        }
        // Greeting logic
        let username = "User";
        if (profile.displayName && profile.displayName.trim() !== "") {
          username = profile.displayName;
        } else if (profile.email) {
          username = profile.email.split("@")[0];
        }
        const greeting = getGreeting();
        setGreetingData({
          greeting: `${greeting}, ${username}!`,
          username,
        });
      } catch (error) {
        console.error("Error checking profile or fetching greeting:", error);
        // Fallback to local greeting if backend fails
        const localGreeting = getGreeting();
        setGreetingData({
          greeting: `${localGreeting}, User!`,
          username: "User",
        });
      }
    };
    checkProfileAndFetchGreeting();
  }, [navigation]);

  useEffect(() => {
    fetchFitnessData();
  }, []);

  const fetchFitnessData = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching fitness data...");
      const profile = await authService.getUserProfile();
      console.log("User profile:", profile);
      if (profile && profile.id) {
        console.log("User ID:", profile.id);
        const data = await fitnessService.getTodayFitnessData(profile.id);
        console.log("Fitness data received:", data);
        setFitnessData(data);
      } else {
        console.log("No user profile or ID found");
      }
    } catch (error) {
      console.error("Error fetching fitness data:", error);
      // Keep default values if fetch fails
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFitnessData();
    setRefreshing(false);
  };

  const handleTrackMeal = () => {
    navigation.navigate("MealTracking");
  };

  const handleTrackWorkout = () => {
    navigation.navigate("WorkoutTracking");
  };

  const handleAIAssistant = () => {
    navigation.navigate("AIAssistant");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getDefaultGoals = () => {
    return {
      steps: 10000,
      caloriesBurned: 500,
      activeMinutes: 30,
      distance: 5,
      floorsClimbed: 10,
      sleepHours: 8,
    };
  };

  const goals = getDefaultGoals();
  const stepsProgressPercentage = fitnessService.calculateProgressPercentage(
    Number(fitnessData.steps || 0),
    goals.steps
  );
  const caloriesProgressPercentage = fitnessService.calculateProgressPercentage(
    Number(fitnessData.caloriesBurned || 0),
    goals.caloriesBurned
  );
  const activeMinutesProgressPercentage =
    fitnessService.calculateProgressPercentage(
      Number(fitnessData.activeMinutes || 0),
      goals.activeMinutes
    );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.secondary}
            colors={[COLORS.secondary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.appName, { color: COLORS.accent }]}>
              FitPal AI
            </Text>
            <Text style={[styles.timeText, { color: COLORS.accent }]}>
              {currentTime}
            </Text>
            <Text style={[styles.dateText, { color: COLORS.accent }]}>
              {currentDate}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate("ProfileSetup", { edit: true })}
          >
            <Ionicons name="person-circle" size={40} color={COLORS.secondary} />
          </TouchableOpacity>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.greeting, { color: COLORS.accent }]}>
            {greetingData.greeting}
          </Text>
          <Text style={[styles.welcomeSubtext, { color: COLORS.accent }]}>
            Ready to crush your fitness goals today?
          </Text>
        </View>

        {/* Progress Summary */}
        <View style={styles.progressContainer}>
          <Text style={[styles.sectionTitle, { color: COLORS.accent }]}>
            Today's Progress
          </Text>

          {/* Steps Progress */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Ionicons name="footsteps" size={24} color={COLORS.secondary} />
              <Text style={[styles.progressTitle, { color: COLORS.accent }]}>
                Steps
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(stepsProgressPercentage, 100)}%` },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: COLORS.accent }]}>
              {Number(fitnessData.steps || 0).toLocaleString()}/
              {goals.steps.toLocaleString()} steps
            </Text>
          </View>

          {/* Calories Burned Progress */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Ionicons name="flame" size={24} color={COLORS.secondary} />
              <Text style={[styles.progressTitle, { color: COLORS.accent }]}>
                Calories Burned
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(caloriesProgressPercentage, 100)}%`,
                    backgroundColor: COLORS.secondary,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: COLORS.accent }]}>
              {Number(fitnessData.caloriesBurned || 0)}/{goals.caloriesBurned}{" "}
              kcal
            </Text>
          </View>

          {/* Active Minutes Progress */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Ionicons name="fitness" size={24} color={COLORS.secondary} />
              <Text style={[styles.progressTitle, { color: COLORS.accent }]}>
                Active Minutes
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(activeMinutesProgressPercentage, 100)}%`,
                    backgroundColor: COLORS.secondary,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: COLORS.accent }]}>
              {Number(fitnessData.activeMinutes || 0)}/{goals.activeMinutes}{" "}
              minutes
            </Text>
          </View>

          {/* Additional Fitness Metrics */}
          <View style={styles.metricsContainer}>
            <View style={styles.metricCard}>
              <Ionicons name="location" size={20} color={COLORS.secondary} />
              <Text style={[styles.metricValue, { color: COLORS.accent }]}>
                {Number(fitnessData.distance || 0).toFixed(1)} km
              </Text>
              <Text style={[styles.metricLabel, { color: COLORS.accent }]}>
                Distance
              </Text>
            </View>

            <View style={styles.metricCard}>
              <Ionicons name="trending-up" size={20} color={COLORS.secondary} />
              <Text style={[styles.metricValue, { color: COLORS.accent }]}>
                {Number(fitnessData.floorsClimbed || 0)}
              </Text>
              <Text style={[styles.metricLabel, { color: COLORS.accent }]}>
                Floors
              </Text>
            </View>

            <View style={styles.metricCard}>
              <Ionicons name="heart" size={20} color={COLORS.secondary} />
              <Text style={[styles.metricValue, { color: COLORS.accent }]}>
                {Number(fitnessData.heartRate || 0)}
              </Text>
              <Text style={[styles.metricLabel, { color: COLORS.accent }]}>
                BPM
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Text style={[styles.sectionTitle, { color: COLORS.accent }]}>
            Quick Actions
          </Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleTrackMeal}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[COLORS.secondary, COLORS.primary]}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="restaurant" size={32} color={COLORS.accent} />
                <Text style={styles.actionTitle}>Track Meal</Text>
                <Text style={styles.actionSubtitle}>Log your nutrition</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleTrackWorkout}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[COLORS.secondary, COLORS.primary]}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="fitness" size={32} color={COLORS.accent} />
                <Text style={styles.actionTitle}>Track Workout</Text>
                <Text style={styles.actionSubtitle}>Record your exercise</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Spacer for floating button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating AI Assistant Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleAIAssistant}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[COLORS.secondary, COLORS.primary]}
          style={styles.floatingGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="sparkles" size={24} color={COLORS.accent} />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
  },
  timeText: {
    fontSize: 14,
    marginTop: 2,
  },
  dateText: {
    fontSize: 14,
    marginTop: 2,
  },
  profileButton: {
    padding: 5,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 18,
    marginBottom: 5,
  },
  userName: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 16,
    lineHeight: 22,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  progressCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: COLORS.secondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.inputBg,
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.secondary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  metricCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionCard: {
    width: (width - 50) / 2,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: COLORS.secondary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  actionGradient: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.accent,
    marginTop: 8,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    borderRadius: 30,
    shadowColor: COLORS.secondary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MainScreen;
