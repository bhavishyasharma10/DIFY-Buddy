import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { FireStoreReminder, Reminder, UIReminder } from '../types/reminder';
import { toUIReminder } from '../utils';

export const addReminder = async (userId: string, reminder: Reminder) => {
  const reminderRef = await addDoc(collection(db, 'users', userId, 'reminders'), {
    ...reminder,
    createdAt: serverTimestamp(),
  });

  return {
    id: reminderRef.id,
    ...reminder,
    createdAt: new Date(),
  } as UIReminder;
};

export const getReminders = async (userId: string) => {
  const remindersSnapshot = await getDocs(collection(db, 'users', userId, 'reminders'));
  const reminders = remindersSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as FireStoreReminder[];

  const parsedReminders = toUIReminder(reminders);
  return parsedReminders;
};
