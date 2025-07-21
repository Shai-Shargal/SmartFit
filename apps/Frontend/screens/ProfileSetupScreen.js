import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { apiService } from "../services/apiService";
import { authService } from "../services/authService";

const { width, height } = Dimensions.get("window");

const ProfileSetupScreen = ({ navigation, route }) => {
  const isEditMode = route?.params?.edit;
  const [formData, setFormData] = useState({
    displayName: "",
    age: "",
    weight: "",
    height: "",
    exerciseFrequency: "",
    exerciseRoutine: "",
    eatingHabits: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (isEditMode) {
      (async () => {
        setIsLoading(true);
        try {
          const profile = await authService.getUserProfile();
          setFormData({
            displayName: profile.displayName?.toString() || "",
            age: profile.age?.toString() || "",
            weight: profile.weight?.toString() || "",
            height: profile.height?.toString() || "",
            exerciseFrequency: profile.exerciseFrequency?.toString() || "",
            exerciseRoutine: profile.exerciseRoutine || "",
            eatingHabits: profile.eatingHabits || "",
          });
        } catch (e) {
          Alert.alert("Error", "Failed to load profile data");
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [isEditMode]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const { displayName, age, weight, height, exerciseFrequency } = formData;

    if (!displayName.trim()) {
      Alert.alert("Error", "Please enter your display name");
      return false;
    }

    if (!age || isNaN(age) || age < 1 || age > 120) {
      Alert.alert("Error", "Please enter a valid age (1-120)");
      return false;
    }

    if (!weight || isNaN(weight) || weight < 20 || weight > 500) {
      Alert.alert("Error", "Please enter a valid weight (20-500 kg)");
      return false;
    }

    if (!height || isNaN(height) || height < 100 || height > 250) {
      Alert.alert("Error", "Please enter a valid height (100-250 cm)");
      return false;
    }

    if (
      !exerciseFrequency ||
      isNaN(exerciseFrequency) ||
      exerciseFrequency < 0 ||
      exerciseFrequency > 7
    ) {
      Alert.alert(
        "Error",
        "Please enter how many times you exercise per week (0-7)"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const profileData = {
        displayName: formData.displayName.trim(),
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseInt(formData.height),
        exerciseFrequency: parseInt(formData.exerciseFrequency),
        exerciseRoutine: formData.exerciseRoutine.trim() || null,
        eatingHabits: formData.eatingHabits.trim() || null,
      };
      if (isEditMode) {
        await authService.updateUserProfile(profileData);
        Alert.alert("Success", "Profile updated!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        await apiService.setupProfile(profileData);
        Alert.alert(
          "Success",
          "Profile setup completed! Welcome to SmartFit!",
          [{ text: "Continue", onPress: () => navigation.replace("Main") }]
        );
      }
    } catch (error) {
      console.error("Profile error:", error);
      Alert.alert(
        "Error",
        isEditMode
          ? "Failed to update profile. Please try again."
          : "Failed to setup profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <LinearGradient
          colors={["#6366f1", "#4f46e5", "#3730a3"]}
          style={styles.backgroundGradient}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Ionicons
                name={isEditMode ? "person" : "person-add"}
                size={40}
                color="white"
              />
              <Text style={styles.headerTitle}>
                {isEditMode ? "Edit Your Profile" : "Complete Your Profile"}
              </Text>
              <Text style={styles.headerSubtitle}>
                {isEditMode
                  ? "Update your personal information"
                  : "Help us personalize your fitness experience"}
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Required Fields Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Required Information</Text>

                {/* Display Name */}
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="person"
                    size={20}
                    color="#6366f1"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Display Name"
                    placeholderTextColor="#9ca3af"
                    value={formData.displayName}
                    onChangeText={(value) =>
                      handleInputChange("displayName", value)
                    }
                    autoCapitalize="words"
                  />
                </View>

                {/* Age */}
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="calendar"
                    size={20}
                    color="#6366f1"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Age"
                    placeholderTextColor="#9ca3af"
                    value={formData.age}
                    onChangeText={(value) => handleInputChange("age", value)}
                    keyboardType="numeric"
                  />
                </View>

                {/* Weight */}
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="scale"
                    size={20}
                    color="#6366f1"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Weight (kg)"
                    placeholderTextColor="#9ca3af"
                    value={formData.weight}
                    onChangeText={(value) => handleInputChange("weight", value)}
                    keyboardType="numeric"
                  />
                </View>

                {/* Height */}
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="resize"
                    size={20}
                    color="#6366f1"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Height (cm)"
                    placeholderTextColor="#9ca3af"
                    value={formData.height}
                    onChangeText={(value) => handleInputChange("height", value)}
                    keyboardType="numeric"
                  />
                </View>

                {/* Exercise Frequency */}
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="fitness"
                    size={20}
                    color="#6366f1"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Exercise frequency per week (0-7)"
                    placeholderTextColor="#9ca3af"
                    value={formData.exerciseFrequency}
                    onChangeText={(value) =>
                      handleInputChange("exerciseFrequency", value)
                    }
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Optional Fields Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Optional Information</Text>
                <Text style={styles.sectionSubtitle}>
                  Help us provide better recommendations
                </Text>

                {/* Exercise Routine */}
                <View style={styles.textAreaContainer}>
                  <Ionicons
                    name="list"
                    size={20}
                    color="#6366f1"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    placeholder="How do you usually exercise? (e.g., running, gym, yoga)"
                    placeholderTextColor="#9ca3af"
                    value={formData.exerciseRoutine}
                    onChangeText={(value) =>
                      handleInputChange("exerciseRoutine", value)
                    }
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                {/* Eating Habits */}
                <View style={styles.textAreaContainer}>
                  <Ionicons
                    name="restaurant"
                    size={20}
                    color="#6366f1"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    placeholder="How do you generally eat? (e.g., vegetarian, high protein, etc.)"
                    placeholderTextColor="#9ca3af"
                    value={formData.eatingHabits}
                    onChangeText={(value) =>
                      handleInputChange("eatingHabits", value)
                    }
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isLoading && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#10b981", "#059669"]}
                  style={styles.submitGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {isLoading ? (
                    <Text style={styles.submitButtonText}>
                      {isEditMode ? "Saving..." : "Setting Up..."}
                    </Text>
                  ) : (
                    <Text style={styles.submitButtonText}>
                      {isEditMode ? "Save Changes" : "Complete Setup"}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  keyboardView: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 5,
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 50,
    minHeight: height * 0.7,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  textAreaContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingTop: 15,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
    paddingVertical: 15,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 0,
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfileSetupScreen;
