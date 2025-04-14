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
  tone: ParseIntentOutput["tone"];
  mood: ParseIntentOutput["mood"];
  energy: ParseIntentOutput["energy"];
  topics: ParseIntentOutput["topics"];
  goals: ParseIntentOutput["goals"];
  struggles: ParseIntentOutput["struggles"];
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

  /** Journal information */
  highlights: z.array(z.string()).describe('Multiple highlights or memorable events from the day.'),
  gratitudes: z.array(z.string()).describe('Things the user felt grateful for, as a list.'),
  thoughts: z.array(z.string()).describe('The user\'s general thoughts.'),
  reflections: z.array(z.string()).describe('Deeper reflections about self, progress, or life.'),
  affirmations: z.array(z.string()).describe('Self-affirming or motivational statements.'),
  tone: z.enum(['positive', 'neutral', 'negative']).describe('Overall tone of the entry.'),
  mood: z.enum(['happy', 'sad', 'angry', 'anxious', 'excited', 'calm', 'neutral']).describe('User mood during the entry.'),
  energy: z.enum(['high', 'medium', 'low']).describe('User energy level during the entry.'),
  topics: z.array(z.string()).describe('Topics or themes discussed in the entry.'),
  goals: z.array(z.string()).describe('Goals or objectives mentioned in the entry.'),
  struggles: z.array(z.string()).describe('Challenges or difficulties the user faced.'),

  /** Task information */
  todos: z.array(z.object({
    text: z.string(),
    category: z.enum(['work', 'personal']),
  })).describe('Extracted tasks or to-dos, if mentioned.'),
  
  /** Reminder information */
  reminders: z.array(z.object({
    text: z.string(),
    time: z.string(),
  })).describe('Reminder-style phrases or scheduling cues.'),

  /** Habit suggestions */
  habitSuggestions: z.array(z.object({
    habit: z.string(),
    reason: z.string(),
  })).describe('Habits the user should consider adopting, with reasons.'),
});

const instructions = `You are an AI that analyzes daily journal entries to extract meaningful information in structured categories.

Journal Entry: {{{entry}}}

Instructions:

- Identify the functional **intent(s)** of the entry. It can include: **journal**, **task**, **reminder**, **habitSuggestion**, or **unknown**. An entry may express multiple intents.
- For each category below, extract relevant data based on the content. If a section doesn't apply, return an empty array or appropriate value (e.g., empty string for tone/mood if not inferable).
- Parse **highlights**, **gratitudes**, **thoughts**, **reflections**, and **affirmations** as arrays of meaningful phrases or sentences.
- Determine the **tone** of the entry: one of **positive**, **neutral**, or **negative**.
- Determine the user's **mood** from: **happy**, **sad**, **angry**, **anxious**, **excited**, **calm**, or **neutral**.
- Estimate the user's **energy** as **high**, **medium**, or **low**.
- Extract any recurring **topics** or themes mentioned in the entry.
- Extract any **goals** or objectives the user mentions they're working on or want to pursue.
- Identify any **struggles** or challenges they describe, emotionally or practically.
- Extract any **to-dos** or tasks from the entry, and categorize each as **work** or **personal**.
- Detect any **reminders**, including natural language or ISO-style time information.
- Identify any **habit suggestions** the user would benefit from, either explicit or implied.
  - For each suggested habit, provide a reason why it would be beneficial.

Output your results in JSON format exactly matching the required schema.`;

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