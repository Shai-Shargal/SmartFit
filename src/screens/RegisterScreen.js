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
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { authService } from "../services/authService";

const { width, height } = Dimensions.get("window");

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      await authService.register(email, password, username);
      Alert.alert(
        "Success",
        "Account created successfully! Welcome to SmartFit!",
        [
          {
            text: "OK",
            onPress: () => navigation.replace("Main"),
          },
        ]
      );
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "Registration failed. Please try again.";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "An account with this email already exists.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/weak-password":
          errorMessage =
            "Password is too weak. Please choose a stronger password.";
          break;
      }

      Alert.alert("Registration Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header with Back Button */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackToLogin}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Logo and Title */}
            <View style={styles.logoSection}>
              <View style={styles.logoContainer}>
                <Ionicons name="fitness" size={60} color="white" />
              </View>
              <Text style={styles.appTitle}>FitPal AI</Text>
              <Text style={styles.appSubtitle}>
                Join the fitness revolution
              </Text>
            </View>

            {/* Registration Form */}
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Create Account</Text>
              <Text style={styles.formSubtitle}>
                Start your fitness journey today
              </Text>

              {/* Username Input */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person"
                  size={20}
                  color="#6366f1"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Username"
                  placeholderTextColor="#9ca3af"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail"
                  size={20}
                  color="#6366f1"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Email"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed"
                  size={20}
                  color="#6366f1"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.textInput, styles.passwordInput]}
                  placeholder="Password"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={togglePasswordVisibility}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#6366f1"
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed"
                  size={20}
                  color="#6366f1"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.textInput, styles.passwordInput]}
                  placeholder="Confirm Password"
                  placeholderTextColor="#9ca3af"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={toggleConfirmPasswordVisibility}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#6366f1"
                  />
                </TouchableOpacity>
              </View>

              {/* Terms and Conditions */}
              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  By creating an account, you agree to our{" "}
                  <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                style={[
                  styles.registerButton,
                  isLoading && styles.registerButtonDisabled,
                ]}
                onPress={handleRegister}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#10b981", "#059669"]}
                  style={styles.registerGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {isLoading ? (
                    <Text style={styles.registerButtonText}>
                      Creating Account...
                    </Text>
                  ) : (
                    <Text style={styles.registerButtonText}>
                      Create Account
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginLinkContainer}>
                <Text style={styles.loginLinkText}>
                  Already have an account?{" "}
                </Text>
                <TouchableOpacity onPress={handleBackToLogin}>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Join thousands of users achieving their fitness goals
              </Text>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
    textAlign: "center",
  },
  formSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 32,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#1f2937",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    padding: 8,
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 18,
    textAlign: "center",
  },
  termsLink: {
    color: "#6366f1",
    fontWeight: "500",
  },
  registerButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginLinkText: {
    fontSize: 14,
    color: "#6b7280",
  },
  loginLink: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "bold",
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: 18,
  },
});

export default RegisterScreen;
