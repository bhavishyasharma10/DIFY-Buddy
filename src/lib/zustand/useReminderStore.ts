import { create } from "zustand";
import { UIReminder } from "../types/reminder";
import { getReminders } from "../firestore/reminders";

type ReminderStore = {
    reminders: UIReminder[];
    fetchReminders: (userId: string) => Promise<void>;
    addReminderToStore: (reminder: UIReminder) => Promise<void>;
}

export const useReminderStore = create<ReminderStore>((set, get) => ({
    reminders: [],

    fetchReminders: async (userId) => {
        const reminders = await getReminders(userId);
        set({ reminders });
    },

    addReminderToStore: async (reminder) => {
        set((state) => ({ reminders: [...state.reminders, reminder] }));
    },
}));