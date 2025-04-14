import { create } from "zustand";
import { UIReminder } from "../types/reminder";
import { getReminders } from "../firestore/reminders";
import { useUserStore } from "./useUserStore";
    
type ReminderStore = {
    reminders: UIReminder[];
    fetchReminders: () => Promise<void>;
    addReminderToStore: (reminder: UIReminder) => Promise<void>;
}

export const useReminderStore = create<ReminderStore>((set, get) => ({
    reminders: [],

    fetchReminders: async () => {
        const { user } = useUserStore.getState();
        if (!user?.id) {
          set({ reminders: [] });
          return;
        }
        const reminders = await getReminders(user.id);
        set({ reminders });
      },

    addReminderToStore: async (reminder) => {
        set((state) => ({ reminders: [...state.reminders, reminder] }));
    },
}));