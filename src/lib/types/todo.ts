import { Timestamp } from "firebase/firestore";
import { ParseTodo } from "@/ai/flows/intent";

export type Todo = ParseTodo & {
    entryId: string;
};

export type FireStoreTodo = Todo & {
    id: string;
    status: string;
    createdAt: Timestamp;
};

export type UITodo = Todo & {
    id: string;
    status: string;
    createdAt: Date;
};

