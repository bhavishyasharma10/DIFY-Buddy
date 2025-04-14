import { create } from "zustand";
import { UIHabitSuggestion } from "../types/habitSuggestion";
import { getHabitSuggestions } from "../firestore/habitSuggestions";
import { useUserStore } from "./useUserStore";

type HabitSuggestionStore = {
    habitSuggestions: UIHabitSuggestion[];
    fetchHabitSuggestions: () => Promise<void>;
    addHabitSuggestionToStore: (habitSuggestion: UIHabitSuggestion) => Promise<void>;
}

export const useHabitSuggestionStore = create<HabitSuggestionStore>((set, get) => ({
    habitSuggestions: [],

    fetchHabitSuggestions: async () => {
        const { user } = useUserStore.getState();

        if (!user?.id) {
            set({ habitSuggestions: [] });
            return;
        }

        const habitSuggestions = await getHabitSuggestions(user.id);
        set({ habitSuggestions });
    },

    addHabitSuggestionToStore: async (habitSuggestion) => {
        set((state) => ({ habitSuggestions: [...state.habitSuggestions, habitSuggestion] }));
    },
}));