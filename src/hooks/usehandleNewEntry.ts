import { parseIntent } from "@/ai/flows/intent";
import { addEntry } from "@/lib/firestore/entries";
import { addHabitSuggestion } from "@/lib/firestore/habitSuggestions";
import { addJournal } from "@/lib/firestore/journal";
import { addReminder } from "@/lib/firestore/reminders";
import { addTodo } from "@/lib/firestore/todos";
import { useEntryStore } from "@/lib/zustand/useEntryStore";
import { useHabitSuggestionStore } from "@/lib/zustand/useHabitSuggestionStore";
import { useJournalStore } from "@/lib/zustand/useJournalStore";
import { useReminderStore } from "@/lib/zustand/useReminderStore";
import { useTodoStore } from "@/lib/zustand/useTodoStore";

export const useHandleNewEntry = () => {
    const addEntryToStore = useEntryStore(state => state.addEntryToStore);
    const { addJournalToStore } = useJournalStore(state => state);
    const { addTodoToStore } = useTodoStore(state => state);
    const { addHabitSuggestionToStore } = useHabitSuggestionStore(state => state);
    const { addReminderToStore } = useReminderStore(state => state);
    const handleNewEntry = async (input: string, userId: string) => {
        const parsedEntry = await parseIntent({entry: input});
        let actionMessages: string[] = [];
    
        /** Save the entry */
        const savedEntry = await addEntry(userId, { content: input});
        await addEntryToStore(savedEntry);
    
        const hasHighlights = parsedEntry.highlights.length;
        const hasGratitudes = parsedEntry.gratitudes.length;
        const hasThoughts = parsedEntry.thoughts.length;
        const hasReflections = parsedEntry.reflections.length;
        const hasAffirmations = parsedEntry.affirmations.length;
        const hasJournalData = hasHighlights || hasGratitudes || hasThoughts || hasReflections || hasAffirmations;
    
        /** Add journal insights if present */
        if (hasJournalData) {
            const savedJournal = await addJournal(userId, {
                entryId: savedEntry.id,
                highlights: parsedEntry.highlights,
                gratitudes: parsedEntry.gratitudes,
                thoughts: parsedEntry.thoughts,
                reflections: parsedEntry.reflections,
                affirmations: parsedEntry.affirmations,
            });
            await addJournalToStore(savedJournal);
        
            if (hasHighlights) {
                actionMessages.push(`Highlights: ${parsedEntry.highlights.join(', ')}`);
            }
            if (hasGratitudes) {
                actionMessages.push(`Gratitudes: ${parsedEntry.gratitudes.join(', ')}`);
            }
            if (hasThoughts) {
                actionMessages.push(`Thoughts: ${parsedEntry.thoughts.join(', ')}`);
            }
            if (hasReflections) {
                actionMessages.push(`Reflections: ${parsedEntry.reflections.join(', ')}`);
            }
            if (hasAffirmations) {
                actionMessages.push(`Affirmations: ${parsedEntry.affirmations.join(', ')}`);
            }
        }
    
        /** Add todos */
        for (const todo of parsedEntry.todos) {
            const savedTodo = await addTodo(userId, {...todo, entryId: savedEntry.id});
            await addTodoToStore(savedTodo);
            
            actionMessages.push(`Todo: ${todo.text}`);
        }
    
        /** Add reminders */
        for (const reminder of parsedEntry.reminders) {
            const savedReminder = await addReminder(userId, {...reminder, entryId: savedEntry.id});
            await addReminderToStore(savedReminder);
            actionMessages.push(`Reminder: ${reminder.text}`);
        }
    
        /** Add habit suggestions */
        for (const suggestion of parsedEntry.habitSuggestions) {
            const savedHabitSuggestion = await addHabitSuggestion(userId, {...suggestion, entryId: savedEntry.id});
            await addHabitSuggestionToStore(savedHabitSuggestion);
            actionMessages.push(`Habit suggestion: ${suggestion.habit}`);
        }
    
        return {parsedEntry, actionMessages};
    };

    return {handleNewEntry};
}
    