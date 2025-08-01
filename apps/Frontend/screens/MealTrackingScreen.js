import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  Modal,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { mealService } from "../services/mealService";
import { authService } from "../services/authService";

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
  success: "#10b981",
};

const MealTrackingScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meals, setMeals] = useState([]);
  const [dailySummary, setDailySummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: "",
    mealType: "breakfast",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    notes: "",
  });
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    loadUserProfile();
    loadMeals();
  }, [selectedDate]);

  const loadUserProfile = async () => {
    try {
      const profile = await authService.getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const loadMeals = async () => {
    if (!userProfile?.id) return;

    try {
      setIsLoading(true);
      const response = await mealService.getMealsByDate(
        userProfile.id,
        selectedDate
      );
      setMeals(response.meals || []);
      setDailySummary(response.dailySummary);
    } catch (error) {
      console.error("Error loading meals:", error);
      Alert.alert("Error", "Failed to load meals");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMeal = async () => {
    if (!userProfile?.id) {
      Alert.alert("Error", "User profile not found");
      return;
    }

    if (!newMeal.name.trim()) {
      Alert.alert("Error", "Please enter a meal name");
      return;
    }

    try {
      setIsLoading(true);

      // Calculate estimated calories if not provided
      const estimatedCalories =
        newMeal.calories || mealService.calculateCalories(newMeal.name);

      const mealData = {
        name: newMeal.name.trim(),
        mealType: newMeal.mealType,
        date: selectedDate.toISOString().split("T")[0],
        calories: estimatedCalories,
        protein: newMeal.protein ? parseFloat(newMeal.protein) : null,
        carbs: newMeal.carbs ? parseFloat(newMeal.carbs) : null,
        fat: newMeal.fat ? parseFloat(newMeal.fat) : null,
        notes: newMeal.notes.trim() || null,
      };

      await mealService.addMeal(userProfile.id, mealData);

      // Reset form
      setNewMeal({
        name: "",
        mealType: "breakfast",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        notes: "",
      });

      setShowAddModal(false);
      loadMeals(); // Reload meals

      Alert.alert("Success", "Meal added successfully!");
    } catch (error) {
      console.error("Error adding meal:", error);
      Alert.alert("Error", "Failed to add meal");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    Alert.alert("Delete Meal", "Are you sure you want to delete this meal?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await mealService.deleteMeal(mealId);
            loadMeals(); // Reload meals
            Alert.alert("Success", "Meal deleted successfully!");
          } catch (error) {
            console.error("Error deleting meal:", error);
            Alert.alert("Error", "Failed to delete meal");
          }
        },
      },
    ]);
  };

  const changeDate = (direction) => {
    const newDate = new Date(selectedDate);
    if (direction === "next") {
      newDate.setDate(newDate.getDate() + 1);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setSelectedDate(newDate);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isFutureDate = (date) => {
    const today = new Date();
    return date > today;
  };

  const getMealTypeIcon = (mealType) => {
    switch (mealType) {
      case "breakfast":
        return "sunny";
      case "lunch":
        return "restaurant";
      case "dinner":
        return "moon";
      case "snack":
        return "cafe";
      default:
        return "nutrition";
    }
  };

  const getMealTypeColor = (mealType) => {
    switch (mealType) {
      case "breakfast":
        return "#fbbf24"; // Yellow
      case "lunch":
        return "#10b981"; // Green
      case "dinner":
        return "#8b5cf6"; // Purple
      case "snack":
        return "#f59e0b"; // Orange
      default:
        return COLORS.secondary;
    }
  };

  const renderMealItem = (meal) => (
    <View key={meal.id} style={styles.mealItem}>
      <View style={styles.mealHeader}>
        <View style={styles.mealTypeContainer}>
          <Ionicons
            name={getMealTypeIcon(meal.mealType)}
            size={20}
            color={getMealTypeColor(meal.mealType)}
          />
          <Text
            style={[
              styles.mealType,
              { color: getMealTypeColor(meal.mealType) },
            ]}
          >
            {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteMeal(meal.id)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash" size={20} color={COLORS.error} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.mealName, { color: COLORS.accent }]}>
        {meal.name}
      </Text>

      <View style={styles.mealNutrition}>
        <Text style={[styles.nutritionText, { color: COLORS.accent }]}>
          {meal.calories} cal
        </Text>
        {meal.protein && (
          <Text style={[styles.nutritionText, { color: COLORS.accent }]}>
            P: {meal.protein}g
          </Text>
        )}
        {meal.carbs && (
          <Text style={[styles.nutritionText, { color: COLORS.accent }]}>
            C: {meal.carbs}g
          </Text>
        )}
        {meal.fat && (
          <Text style={[styles.nutritionText, { color: COLORS.accent }]}>
            F: {meal.fat}g
          </Text>
        )}
      </View>

      {meal.notes && (
        <Text style={[styles.mealNotes, { color: COLORS.placeholder }]}>
          {meal.notes}
        </Text>
      )}
    </View>
  );

  const renderDailySummary = () => {
    if (!dailySummary) return null;

    return (
      <View style={styles.summaryCard}>
        <Text style={[styles.summaryTitle, { color: COLORS.accent }]}>
          Daily Summary
        </Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: COLORS.secondary }]}>
              {dailySummary.totalCalories || 0}
            </Text>
            <Text style={[styles.summaryLabel, { color: COLORS.accent }]}>
              Calories
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: COLORS.secondary }]}>
              {parseFloat(dailySummary.totalProtein || 0).toFixed(1)}g
            </Text>
            <Text style={[styles.summaryLabel, { color: COLORS.accent }]}>
              Protein
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: COLORS.secondary }]}>
              {parseFloat(dailySummary.totalCarbs || 0).toFixed(1)}g
            </Text>
            <Text style={[styles.summaryLabel, { color: COLORS.accent }]}>
              Carbs
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: COLORS.secondary }]}>
              {parseFloat(dailySummary.totalFat || 0).toFixed(1)}g
            </Text>
            <Text style={[styles.summaryLabel, { color: COLORS.accent }]}>
              Fat
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.accent} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: COLORS.accent }]}>
          Track Meals
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Date Selector */}
      <View style={styles.dateSelector}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => changeDate("prev")}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.accent} />
        </TouchableOpacity>

        <View style={styles.dateDisplay}>
          <Text style={[styles.dateText, { color: COLORS.accent }]}>
            {formatDate(selectedDate)}
          </Text>
          {isToday(selectedDate) && (
            <Text style={[styles.todayLabel, { color: COLORS.secondary }]}>
              Today
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => changeDate("next")}
          disabled={isFutureDate(selectedDate)}
        >
          <Ionicons
            name="chevron-forward"
            size={24}
            color={
              isFutureDate(selectedDate) ? COLORS.placeholder : COLORS.accent
            }
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Daily Summary */}
        {renderDailySummary()}

        {/* Meals List */}
        <View style={styles.mealsSection}>
          <Text style={[styles.sectionTitle, { color: COLORS.accent }]}>
            Meals ({meals.length})
          </Text>

          {meals.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="restaurant-outline"
                size={48}
                color={COLORS.placeholder}
              />
              <Text style={[styles.emptyText, { color: COLORS.placeholder }]}>
                No meals recorded for this date
              </Text>
              <Text
                style={[styles.emptySubtext, { color: COLORS.placeholder }]}
              >
                Tap the + button to add your first meal
              </Text>
            </View>
          ) : (
            meals.map(renderMealItem)
          )}
        </View>

        {/* Spacer for floating button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setShowAddModal(true)}
        disabled={isFutureDate(selectedDate)}
      >
        <LinearGradient
          colors={[COLORS.secondary, COLORS.primary]}
          style={styles.floatingGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="add" size={24} color={COLORS.accent} />
        </LinearGradient>
      </TouchableOpacity>

      {/* Add Meal Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: COLORS.accent }]}>
                Add Meal
              </Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={COLORS.accent} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Meal Name */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: COLORS.accent }]}>
                  Meal Name *
                </Text>
                <TextInput
                  style={[styles.textInput, { color: COLORS.accent }]}
                  placeholder="e.g., Grilled Chicken Salad"
                  placeholderTextColor={COLORS.placeholder}
                  value={newMeal.name}
                  onChangeText={(text) =>
                    setNewMeal({ ...newMeal, name: text })
                  }
                />
              </View>

              {/* Meal Type */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: COLORS.accent }]}>
                  Meal Type
                </Text>
                <View style={styles.mealTypeButtons}>
                  {mealService.getMealTypes().map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.mealTypeButton,
                        newMeal.mealType === type.value &&
                          styles.mealTypeButtonActive,
                      ]}
                      onPress={() =>
                        setNewMeal({ ...newMeal, mealType: type.value })
                      }
                    >
                      <Ionicons
                        name={type.icon}
                        size={16}
                        color={
                          newMeal.mealType === type.value
                            ? COLORS.accent
                            : COLORS.placeholder
                        }
                      />
                      <Text
                        style={[
                          styles.mealTypeButtonText,
                          {
                            color:
                              newMeal.mealType === type.value
                                ? COLORS.accent
                                : COLORS.placeholder,
                          },
                        ]}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Nutrition Info */}
              <View style={styles.nutritionSection}>
                <Text style={[styles.inputLabel, { color: COLORS.accent }]}>
                  Nutrition (optional)
                </Text>
                <View style={styles.nutritionInputs}>
                  <View style={styles.nutritionInput}>
                    <Text
                      style={[styles.nutritionLabel, { color: COLORS.accent }]}
                    >
                      Calories
                    </Text>
                    <TextInput
                      style={[
                        styles.nutritionTextInput,
                        { color: COLORS.accent },
                      ]}
                      placeholder="Auto"
                      placeholderTextColor={COLORS.placeholder}
                      value={newMeal.calories}
                      onChangeText={(text) =>
                        setNewMeal({ ...newMeal, calories: text })
                      }
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.nutritionInput}>
                    <Text
                      style={[styles.nutritionLabel, { color: COLORS.accent }]}
                    >
                      Protein (g)
                    </Text>
                    <TextInput
                      style={[
                        styles.nutritionTextInput,
                        { color: COLORS.accent },
                      ]}
                      placeholder="0"
                      placeholderTextColor={COLORS.placeholder}
                      value={newMeal.protein}
                      onChangeText={(text) =>
                        setNewMeal({ ...newMeal, protein: text })
                      }
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.nutritionInput}>
                    <Text
                      style={[styles.nutritionLabel, { color: COLORS.accent }]}
                    >
                      Carbs (g)
                    </Text>
                    <TextInput
                      style={[
                        styles.nutritionTextInput,
                        { color: COLORS.accent },
                      ]}
                      placeholder="0"
                      placeholderTextColor={COLORS.placeholder}
                      value={newMeal.carbs}
                      onChangeText={(text) =>
                        setNewMeal({ ...newMeal, carbs: text })
                      }
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.nutritionInput}>
                    <Text
                      style={[styles.nutritionLabel, { color: COLORS.accent }]}
                    >
                      Fat (g)
                    </Text>
                    <TextInput
                      style={[
                        styles.nutritionTextInput,
                        { color: COLORS.accent },
                      ]}
                      placeholder="0"
                      placeholderTextColor={COLORS.placeholder}
                      value={newMeal.fat}
                      onChangeText={(text) =>
                        setNewMeal({ ...newMeal, fat: text })
                      }
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>

              {/* Notes */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: COLORS.accent }]}>
                  Notes (optional)
                </Text>
                <TextInput
                  style={[styles.textArea, { color: COLORS.accent }]}
                  placeholder="Add any notes about this meal..."
                  placeholderTextColor={COLORS.placeholder}
                  value={newMeal.notes}
                  onChangeText={(text) =>
                    setNewMeal({ ...newMeal, notes: text })
                  }
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text
                  style={[styles.cancelButtonText, { color: COLORS.accent }]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.addButton,
                  isLoading && styles.addButtonDisabled,
                ]}
                onPress={handleAddMeal}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={[COLORS.secondary, COLORS.primary]}
                  style={styles.addButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text
                    style={[styles.addButtonText, { color: COLORS.accent }]}
                  >
                    {isLoading ? "Adding..." : "Add Meal"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerSpacer: {
    width: 34,
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dateButton: {
    padding: 10,
  },
  dateDisplay: {
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
  },
  todayLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summaryCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  summaryLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  mealsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  },
  mealItem: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  mealTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  mealType: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
  deleteButton: {
    padding: 5,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  mealNutrition: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 5,
  },
  nutritionText: {
    fontSize: 12,
    marginRight: 10,
  },
  mealNotes: {
    fontSize: 12,
    fontStyle: "italic",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.9,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mealTypeButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  mealTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.primary,
  },
  mealTypeButtonActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  mealTypeButtonText: {
    fontSize: 14,
    marginLeft: 5,
  },
  nutritionSection: {
    marginBottom: 20,
  },
  nutritionInputs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  nutritionInput: {
    flex: 1,
    minWidth: (width - 60) / 2,
  },
  nutritionLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  nutritionTextInput: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 80,
    textAlignVertical: "top",
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  addButton: {
    flex: 2,
    borderRadius: 8,
    overflow: "hidden",
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonGradient: {
    paddingVertical: 12,
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MealTrackingScreen;
