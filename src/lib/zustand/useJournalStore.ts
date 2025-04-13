import { getJournal } from "../firestore/journal";
import { UIJournal } from "../types/journal";
import { create } from 'zustand';

type JournalStore = {
    journals: UIJournal[];
    fetchJournals: (userId: string) => Promise<void>;
    addJournalToStore: (journal: UIJournal) => Promise<void>;
};

export const useJournalStore = create<JournalStore>((set, get) => ({
    journals: [],

    fetchJournals: async (userId) => {
        const journals = await getJournal(userId);
        set({ journals });
    },

    addJournalToStore: async (journal) => {
        set((state) => ({ journals: [...state.journals, journal] }));
    },
}));





