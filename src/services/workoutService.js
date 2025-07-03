import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

export const workoutService = {
  // Add new workout
  addWorkout: async (userId, workoutData) => {
    try {
      const docRef = await addDoc(collection(db, 'workouts'), {
        userId: userId,
        ...workoutData,
        createdAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  // Get user's workouts
  getUserWorkouts: async (userId) => {
    try {
      const q = query(
        collection(db, 'workouts'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  },

  // Update workout
  updateWorkout: async (workoutId, updates) => {
    try {
      await updateDoc(doc(db, 'workouts', workoutId), updates);
    } catch (error) {
      throw error;
    }
  },

  // Delete workout
  deleteWorkout: async (workoutId) => {
    try {
      await deleteDoc(doc(db, 'workouts', workoutId));
    } catch (error) {
      throw error;
    }
  }
};
