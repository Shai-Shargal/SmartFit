import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const authService = {
  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  // Register new user
  register: async (email, password, username) => {
    try {
      console.log("Starting registration for:", email);
      console.log("Auth object:", auth);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User credential created:", userCredential);
      const user = userCredential.user;
      console.log("User object:", user);
      console.log("User UID:", user.uid);

      // Create user profile
      console.log("Attempting to create user profile in Firestore...");
      try {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          username: username,
          displayName: username,
          createdAt: new Date(),
          lastLogin: new Date(),
          profile: {
            fitnessLevel: "beginner",
            goals: [],
            preferences: {
              units: "metric",
              notifications: true,
              privacy: "private",
            },
          },
          stats: {
            totalWorkouts: 0,
            totalCaloriesBurned: 0,
            currentStreak: 0,
            longestStreak: 0,
          },
        });
        console.log("User profile created successfully in Firestore");
      } catch (firestoreError) {
        console.error("Firestore error:", firestoreError);
        // Don't throw the error - the user was created successfully
        // Just log it for debugging
      }

      return user;
    } catch (error) {
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  },

  // Get user profile from Firestore
  getUserProfile: async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (uid, updates) => {
    try {
      await updateDoc(doc(db, "users", uid), updates);
    } catch (error) {
      throw error;
    }
  },
};
