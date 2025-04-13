import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { FireStoreEntry, UIEntry } from "./types/entry"
import { FireStoreJournal, UIJournal } from "./types/journal"
import { FireStoreTodo, UITodo } from "./types/todo"
import { FireStoreReminder, UIReminder } from "./types/reminder"
import { FireStoreHabitSuggestion, UIHabitSuggestion } from "./types/habitSuggestion"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const toUIEntry = (entry: FireStoreEntry[]): UIEntry[] => 
  entry.map((entry) => ({
      ...entry,
      createdAt: entry.createdAt.toDate(),
    }))

export const toUIJournal = (journal: FireStoreJournal[]): UIJournal[] =>
  journal.map((entry) => ({
      ...entry,
      createdAt: entry.createdAt.toDate(),
    }))

export const toUITodo = (todo: FireStoreTodo[]): UITodo[] =>
  todo.map((todo) => ({
      ...todo,
      createdAt: todo.createdAt.toDate(),
    }))

export const toUIReminder = (reminder: FireStoreReminder[]): UIReminder[] =>
  reminder.map((reminder) => ({
      ...reminder,
      createdAt: reminder.createdAt.toDate(),
    }))

export const toUIHabitSuggestion = (habitSuggestion: FireStoreHabitSuggestion[]): UIHabitSuggestion[] =>
  habitSuggestion.map((habitSuggestion) => ({
      ...habitSuggestion,
      createdAt: habitSuggestion.createdAt.toDate(),
    }))