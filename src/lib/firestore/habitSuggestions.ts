
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { FireStoreHabitSuggestion, HabitSuggestion, UIHabitSuggestion } from '../types/habitSuggestion';
import { toUIHabitSuggestion } from '../utils';

export const addHabitSuggestion = async (userId: string, habitSuggestion: HabitSuggestion) => {
  const habitSuggestionRef = await addDoc(collection(db, 'users', userId, 'habitSuggestions'), {
    ...habitSuggestion,
    savedAsHabit: false,
    createdAt: serverTimestamp(),
  });

  return {
    id: habitSuggestionRef.id,
    ...habitSuggestion,
    savedAsHabit: false,
    createdAt: new Date(),
  } as UIHabitSuggestion;
};

export const getHabitSuggestions = async (userId: string) => {
  const habitSuggestionsSnapshot = await getDocs(collection(db, 'users', userId, 'habitSuggestions'));
  const habitSuggestions = habitSuggestionsSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
  return toUIHabitSuggestion(habitSuggestions as FireStoreHabitSuggestion[]);
};
