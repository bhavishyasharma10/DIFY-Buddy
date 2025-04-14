import { parseIntent } from "@/ai/flows/intent";
import { addEntry } from "@/lib/firestore/entries";
import { addHabitSuggestion } from "@/lib/firestore/habitSuggestions";
import { addJournal } from "@/lib/firestore/journal";
import { addReminder } from "@/lib/firestore/reminders";
import { addTodo } from "@/lib/firestore/todos";

export const handleNewEntry = async (input: string, userId: string) => {
  const parsedEntry = await parseIntent({entry: input});
  let actionMessages: string[] = [];

  /** Save the entry */
  const savedEntry = await addEntry(userId, { content: input});

  const hasHighlights = parsedEntry.highlights.length;
  const hasGratitudes = parsedEntry.gratitudes.length;
  const hasThoughts = parsedEntry.thoughts.length;
  const hasReflections = parsedEntry.reflections.length;
  const hasAffirmations = parsedEntry.affirmations.length;
  const hasJournalData = hasHighlights || hasGratitudes || hasThoughts || hasReflections || hasAffirmations;

  /** Add journal insights if present */
  if (hasJournalData) {
    await addJournal(userId, {
      entryId: savedEntry.id,
      highlights: parsedEntry.highlights,
      gratitudes: parsedEntry.gratitudes,
      thoughts: parsedEntry.thoughts,
      reflections: parsedEntry.reflections,
      affirmations: parsedEntry.affirmations,
      tone: parsedEntry.tone,
      mood: parsedEntry.mood,
      energy: parsedEntry.energy,
      topics: parsedEntry.topics,
      goals: parsedEntry.goals,
      struggles: parsedEntry.struggles,
    });

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
    await addTodo(userId, {...todo, entryId: savedEntry.id});
    actionMessages.push(`Todo: ${todo.text}`);
  }

  /** Add reminders */
  for (const reminder of parsedEntry.reminders) {
    await addReminder(userId, {...reminder, entryId: savedEntry.id});
    actionMessages.push(`Reminder: ${reminder.text}`);
  }

  /** Add habit suggestions */
  for (const suggestion of parsedEntry.habitSuggestions) {
    await addHabitSuggestion(userId, {...suggestion, entryId: savedEntry.id});
    actionMessages.push(`Habit suggestion: ${suggestion.habit}`);
  }

  return {parsedEntry, actionMessages};
};
