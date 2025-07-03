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

export const mealService = {
  // Add new meal
  addMeal: async (userId, mealData) => {
    try {
      const docRef = await addDoc(collection(db, 'meals'), {
        userId: userId,
        ...mealData,
        createdAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  // Get user's meals
  getUserMeals: async (userId) => {
    try {
      const q = query(
        collection(db, 'meals'),
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

  // Update meal
  updateMeal: async (mealId, updates) => {
    try {
      await updateDoc(doc(db, 'meals', mealId), updates);
    } catch (error) {
      throw error;
    }
  },

  // Delete meal
  deleteMeal: async (mealId) => {
    try {
      await deleteDoc(doc(db, 'meals', mealId));
    } catch (error) {
      throw error;
    }
  }
};
