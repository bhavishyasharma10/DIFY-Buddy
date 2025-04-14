import { create } from 'zustand'
import { getEntries } from '../firestore/entries'
import { UIEntry } from '../types/entry'
import { useUserStore } from './useUserStore'

type EntryStore = {
  entries: UIEntry[],
  fetchEntries: () => Promise<void>,
  addEntryToStore: (entry: UIEntry) => Promise<void> 
}

export const useEntryStore = create<EntryStore>((set, get) => ({
  entries: [],

  fetchEntries: async () => {
    const { user } = useUserStore.getState();

    if (!user?.id) {
      set({ entries: [] });
      return;
    }

    const entries = await getEntries(user.id);
    const sortedEntries = entries.toSorted((a, b) => {
      const aTime = a.createdAt; 
      const bTime = b.createdAt;
      return aTime.getTime() - bTime.getTime();
    });
    set({ entries: sortedEntries });
  },

  addEntryToStore: async (entry) => {
    set((state) => ({ entries: [...state.entries, entry] }))
  },
}))
