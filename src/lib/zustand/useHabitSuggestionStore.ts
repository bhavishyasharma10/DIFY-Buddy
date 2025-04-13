import { create } from "zustand";
import { UIHabitSuggestion } from "../types/habitSuggestion";
import { getHabitSuggestions } from "../firestore/habitSuggestions";

type HabitSuggestionStore = {
    habitSuggestions: UIHabitSuggestion[];
    fetchHabitSuggestions: (userId: string) => Promise<void>;
    addHabitSuggestionToStore: (habitSuggestion: UIHabitSuggestion) => Promise<void>;
}

export const useHabitSuggestionStore = create<HabitSuggestionStore>((set, get) => ({
    habitSuggestions: [],

    fetchHabitSuggestions: async (userId) => {
        const habitSuggestions = await getHabitSuggestions(userId);
        set({ habitSuggestions });
    },

    addHabitSuggestionToStore: async (habitSuggestion) => {
        set((state) => ({ habitSuggestions: [...state.habitSuggestions, habitSuggestion] }));
    },
}));