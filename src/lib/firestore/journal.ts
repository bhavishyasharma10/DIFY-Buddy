import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { FireStoreJournal, Journal, UIJournal } from '../types/journal';
import { toUIJournal } from '../utils';

export const addJournal = async (userId: string, journal: Journal) => {
  const journalRef = await addDoc(collection(db, 'users', userId, 'journal'), {
    ...journal,
    createdAt: serverTimestamp(),
  });

  return {
    id: journalRef.id,
    ...journal,
    createdAt: new Date(),
  } as UIJournal;
};

export const getJournal = async (userId: string) => {
  const journalSnapshot = await getDocs(collection(db, 'users', userId, 'journal'));
  const journal = journalSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as FireStoreJournal[];

  return toUIJournal(journal);
};
