import { create } from 'zustand'
import { getEntries } from '../firestore/entries'
import { UIEntry } from '../types/entry'

type EntryStore = {
  entries: UIEntry[],
  fetchEntries: (userId: string) => Promise<void>,
  addEntryToStore: (entry: UIEntry) => Promise<void> 
}

export const useEntryStore = create<EntryStore>((set, get) => ({
  entries: [],

  fetchEntries: async (userId) => {
    const entries = await getEntries(userId);
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
