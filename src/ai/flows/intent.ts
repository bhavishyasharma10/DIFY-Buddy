'use server';
/**
 * @fileOverview Intent Parser AI agent.
 *
 * - parseIntent - A function that parses entry intent into categories.
 * - ParseIntentInput - The input type for the parseIntent function.
 * - ParseIntentOutput - The return type for the parseIntent function.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

export type ParseIntentInput = z.infer<typeof ParseIntentInputSchema>;
export type ParseIntentOutput = z.infer<typeof ParseIntentOutputSchema>;

export type ParseHabitSuggestion = z.infer<typeof ParseIntentOutputSchema.shape.habitSuggestions.element>;
export type ParseTodo = z.infer<typeof ParseIntentOutputSchema.shape.todos.element>;
export type ParseReminder = z.infer<typeof ParseIntentOutputSchema.shape.reminders.element>;
export type ParseJournal = {
  highlights: ParseIntentOutput["highlights"];
  gratitudes: ParseIntentOutput["gratitudes"];
  thoughts: ParseIntentOutput["thoughts"];
  reflections: ParseIntentOutput["reflections"];
  affirmations: ParseIntentOutput["affirmations"];
};


const ParseIntentInputSchema = z.object({
  entry: z.string().describe('A raw journal entry.'),
});

const ParseIntentOutputSchema = z.object({
  intent: z.array(z.enum([
    'journal',
    'task',
    'reminder',
    'habitSuggestion',
    'unknown'
  ])).describe('Detected functional intents of the entry.'),

  // improvements: z.string().describe('What could have been done to make the day better.'),
  highlights: z.array(z.string()).describe('Multiple highlights or memorable events from the day.'),
  gratitudes: z.array(z.string()).describe('Things the user felt grateful for, as a list.'),
  thoughts: z.array(z.string()).describe('The user\'s general thoughts.'),
  reflections: z.array(z.string()).describe('Deeper reflections about self, progress, or life.'),
  affirmations: z.array(z.string()).describe('Self-affirming or motivational statements.'),

  todos: z.array(z.object({
    text: z.string(),
    category: z.enum(['work', 'personal']),
  })).describe('Extracted tasks or to-dos, if mentioned.'),
  
  reminders: z.array(z.object({
    text: z.string(),
    time: z.string(), // Optional natural or ISO time
  })).describe('Reminder-style phrases or scheduling cues.'),

  habitSuggestions: z.array(z.object({
    habit: z.string(),
    reason: z.string(),
    plan: z.object({
      goal: z.string(), // e.g., "Build a daily meditation practice"
      steps: z.array(z.string()), // e.g., ["Start with 2 mins", "Track on habit app", ...]
      frequency: z.string(), // "daily", "3 times a week"
      duration: z.string(), // "10 minutes"
      totalDays: z.number(), // e.g., 14
    }),
  })).describe('Habits the user should consider, with a personalized, actionable plan.'),
});

const instructions = `You are an AI that analyzes daily journal entries to extract meaningful information in structured categories.

    Analyze the following journal entry and extract the appropriate details into each of the following sections.

    Journal Entry: {{{entry}}}

    Instructions:
    - Identify the functional **intent(s)** of the entry. It can include: journal, task, reminder, habitSuggestion, or unknown.
    - For each category, extract relevant data based on the content. If a section doesn't apply, return an empty list or string.
    - Parse multiple **highlights**, **gratitude**, **reflections**, **thoughts** and **affirmations** as arrays.
    - Identify any **to-dos** and categorize them as either "work" or "personal".
    - Extract **reminders** with associated time if available (natural language time or ISO).
    - Detect any implied or explicit **habit suggestions**, and generate a structured, motivational **plan** with goal, steps, frequency, duration, and total days. 
      The plan has to be personalized with actionable steps that can be tracked, to help the user build this habit. Break the plan down into smaller, manageable steps according to the total days.
    - If no **habit suggestions** are detected, return an empty array for the **habit suggestions** section.

    Output your results in JSON format exactly matching the required schema.`


export async function parseIntent(input: ParseIntentInput): Promise<ParseIntentOutput> {
  return parseIntentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseIntentPrompt',
  input: {
    schema: ParseIntentInputSchema,
  },
  output: {
    schema: ParseIntentOutputSchema,
  },
  prompt: instructions,
});

const parseIntentFlow = ai.defineFlow<
  typeof ParseIntentInputSchema,
  typeof ParseIntentOutputSchema
>({
  name: 'parseIntentFlow',
  inputSchema: ParseIntentInputSchema,
  outputSchema: ParseIntentOutputSchema,
}, async input => {
  const { output } = await prompt(input);
  return output!;
});