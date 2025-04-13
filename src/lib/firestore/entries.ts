import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { Entry, FireStoreEntry, UIEntry } from '../types/entry';
import { toUIEntry } from '../utils';

export const addEntry = async (userId: string, entry: Entry) => {
  const entryRef = await addDoc(collection(db, 'users', userId, 'entries'), {
    ...entry,
    createdAt: serverTimestamp(),
  });

  return {
    id: entryRef.id,
    ...entry,
    createdAt: new Date(),
  } as UIEntry
};

export const getEntries = async (userId: string) => {
  const entriesSnapshot = await getDocs(collection(db, 'users', userId, 'entries'));
  const entries = entriesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as FireStoreEntry[];

  const parsedEntries = toUIEntry(entries);
  
  return parsedEntries;
};
