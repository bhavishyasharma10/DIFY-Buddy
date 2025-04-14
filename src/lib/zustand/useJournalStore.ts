import { getJournal } from "../firestore/journal";
import { UIJournal } from "../types/journal";
import { create } from 'zustand';
import { useUserStore } from './useUserStore';
    
type JournalStore = {
    journals: UIJournal[];
    fetchJournals: () => Promise<void>;
    addJournalToStore: (journal: UIJournal) => Promise<void>;
};

export const useJournalStore = create<JournalStore>((set, get) => ({
    journals: [],

    fetchJournals: async () => {
        const { user } = useUserStore.getState();
        if (!user?.id) {
          set({ journals: [] });
          return;
        }
        const journals = await getJournal(user.id);
        set({ journals });
      },

    addJournalToStore: async (journal) => {
        set((state) => ({ journals: [...state.journals, journal] }));
    },
}));





