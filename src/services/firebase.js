import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// Environment variables temporarily hardcoded for testing

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6cHrQqwkPohNUn0BR5XClCTyR4ZdniSg",
  authDomain: "smartfit-5025d.firebaseapp.com",
  projectId: "smartfit-5025d",
  storageBucket: "smartfit-5025d.firebasestorage.app",
  messagingSenderId: "1093896786089",
  appId: "1:1093896786089:web:bfeeb6bd1bebe863e219b8",
  measurementId: "G-GH8V2GBT9Z",
};

console.log("Firebase config:", firebaseConfig);

const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized successfully");

// ✅ THIS IS CRITICAL FOR REACT NATIVE:
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
console.log("Firebase auth initialized successfully");

export { auth };
export const db = getFirestore(app);
console.log("Firestore database initialized:", db);
export const storage = getStorage(app);
export default app;
