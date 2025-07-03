import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "react-native";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import MainScreen from "./src/screens/MainScreen";
import MealTrackingScreen from "./src/screens/MealTrackingScreen";
import WorkoutTrackingScreen from "./src/screens/WorkoutTrackingScreen";
import AIAssistantScreen from "./src/screens/AIAssistantScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="MealTracking" component={MealTrackingScreen} />
        <Stack.Screen
          name="WorkoutTracking"
          component={WorkoutTrackingScreen}
        />
        <Stack.Screen name="AIAssistant" component={AIAssistantScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
