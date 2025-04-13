import { Timestamp } from "firebase/firestore";
import { ParseJournal } from "@/ai/flows/intent";

export type Journal = ParseJournal & {
    entryId: string;
}

export type FireStoreJournal = Journal & {
    id: string;
    createdAt: Timestamp;
}

export type UIJournal = Journal & {
    id: string;
    createdAt: Date;
}

