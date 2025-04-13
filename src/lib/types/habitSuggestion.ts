import { ParseHabitSuggestion } from "@/ai/flows/intent";
import { Timestamp } from "firebase/firestore";

export type HabitSuggestion = ParseHabitSuggestion & {
    entryId: string;
};

export type FireStoreHabitSuggestion = HabitSuggestion & {
    id: string;
    createdAt: Timestamp;
    savedAsHabit: boolean;
};

export type UIHabitSuggestion = HabitSuggestion & {
    id: string;
    createdAt: Date;
    savedAsHabit: boolean;
};