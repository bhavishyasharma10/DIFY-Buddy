import { Timestamp } from "firebase/firestore";

export type Entry = {
    content: string;
}

export type FireStoreEntry = Entry & {
    id: string;
    createdAt: Timestamp;
}

export type UIEntry = Entry & {
    id: string;
    createdAt: Date;
}