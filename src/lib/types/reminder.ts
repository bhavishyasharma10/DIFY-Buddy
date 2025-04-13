import { Timestamp } from "firebase/firestore";
import { ParseReminder } from "@/ai/flows/intent";

export type Reminder = ParseReminder & {
    entryId: string;
};

export type FireStoreReminder = Reminder & {
    id: string;
    createdAt: Timestamp;
};

export type UIReminder = Reminder & {
    id: string;
    createdAt: Date;
};