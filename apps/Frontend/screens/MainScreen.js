import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { apiService } from "../services/apiService";

const { width, height } = Dimensions.get("window");

const MainScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({
    name: "Alex",
    workoutProgress: 25,
    workoutGoal: 60,
    caloriesConsumed: 1200,
    caloriesGoal: 2000,
  });

  const [currentTime, setCurrentTime] = useState("");
  const [greetingData, setGreetingData] = useState({
    greeting: "Good morning",
    username: "User",
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check profile setup status and fetch greeting
    const checkProfileAndFetchGreeting = async () => {
      try {
        // First check if profile setup is completed
        const profileStatus = await apiService.getProfileSetupStatus();

        if (!profileStatus.profileSetupCompleted) {
          // Redirect to profile setup if not completed
          navigation.replace("ProfileSetup");
          return;
        }

        // Fetch greeting if profile is set up
        const greeting = await apiService.getUserGreeting();
        setGreetingData({
          greeting: greeting.greeting,
          username: greeting.username,
        });
      } catch (error) {
        console.error("Error checking profile or fetching greeting:", error);
        // Fallback to local greeting if backend fails
        const localGreeting = getGreeting();
        setGreetingData({
          greeting: `${localGreeting}, ${userData.name}!`,
          username: userData.name,
        });
      }
    };

    checkProfileAndFetchGreeting();
  }, [navigation]);

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

  const workoutProgressPercentage =
    (userData.workoutProgress / userData.workoutGoal) * 100;
  const calorieProgressPercentage =
    (userData.caloriesConsumed / userData.caloriesGoal) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>FitPal AI</Text>
            <Text style={styles.timeText}>{currentTime}</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate("ProfileSetup", { edit: true })}
          >
            <Ionicons name="person-circle" size={40} color="#6366f1" />
          </TouchableOpacity>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>{greetingData.greeting}</Text>
          <Text style={styles.welcomeSubtext}>
            Ready to crush your fitness goals today?
          </Text>
        </View>

        {/* Progress Summary */}
        <View style={styles.progressContainer}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>

          {/* Workout Progress */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Ionicons name="fitness" size={24} color="#6366f1" />
              <Text style={styles.progressTitle}>Workout</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(workoutProgressPercentage, 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {userData.workoutProgress}/{userData.workoutGoal} minutes
            </Text>
          </View>

          {/* Calorie Progress */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Ionicons name="restaurant" size={24} color="#10b981" />
              <Text style={styles.progressTitle}>Calories</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(calorieProgressPercentage, 100)}%`,
                    backgroundColor: "#10b981",
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {userData.caloriesConsumed}/{userData.caloriesGoal} kcal
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleTrackMeal}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#10b981", "#059669"]}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="restaurant" size={32} color="white" />
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
                colors={["#6366f1", "#4f46e5"]}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="fitness" size={32} color="white" />
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
          colors={["#f59e0b", "#d97706"]}
          style={styles.floatingGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="sparkles" size={24} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
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
    color: "#1e293b",
  },
  timeText: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
  profileButton: {
    padding: 5,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  greeting: {
    fontSize: 18,
    color: "#64748b",
    marginBottom: 5,
  },
  userName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: "#64748b",
    lineHeight: 22,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 15,
  },
  progressCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginLeft: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6366f1",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: "#64748b",
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
    shadowColor: "#000",
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
    color: "white",
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
    shadowColor: "#000",
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
