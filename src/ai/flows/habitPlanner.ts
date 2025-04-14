'use server';
import { ai } from '@/ai/ai-instance';
import { z } from "zod";


export type ParseHabitPlanInput = z.infer<typeof ParseHabitPlanInputSchema>;
export type ParseHabitPlanOutput = z.infer<typeof ParseHabitPlanOutputSchema>;

const ParseHabitPlanInputSchema = z.object({
  habitToPlan: z.array(z.object({
    habit: z.string(),
    reason: z.string(),
    plan: z.object({
      goal: z.string(), 
      steps: z.array(z.string()),
      frequency: z.string(),
      duration: z.string(),
      totalDays: z.number(),
    }),
  })).describe('Habit to plan for, including the reason for the habit.'),
  journalEntries: z.array(
    z.object({
        highlights: z.array(z.string()).optional().describe('Multiple highlights or memorable events from the day.'),
        gratitudes: z.array(z.string()).optional().describe('Things the user felt grateful for, as a list.'),
        thoughts: z.array(z.string()).optional().describe('The user\'s general thoughts.'),
        reflections: z.array(z.string()).optional().describe('Deeper reflections about self, progress, or life.'),
        affirmations: z.array(z.string()).optional().describe('Self-affirming or motivational statements.'),
        tone: z.enum(['positive', 'neutral', 'negative']).optional().describe('Overall tone of the entry.'),
        mood: z.enum(['happy', 'sad', 'angry', 'anxious', 'excited', 'calm', 'neutral']).optional().describe('User mood during the entry.'),
        energy: z.enum(['high', 'medium', 'low']).optional().describe('User energy level during the entry.'),
        topics: z.array(z.string()).optional().describe('Topics or themes discussed in the entry.'),
        goals: z.array(z.string()).optional().describe('Goals or objectives mentioned in the entry.'),
        struggles: z.array(z.string()).optional().describe('Challenges or difficulties the user faced.'),
    })
  ),
});

const ParseHabitPlanOutputSchema = z.object({
  habitPlan: z.array(
    z.object({
      habit: z.string(),
      reason: z.string(),
      personalizedPlan: z.string(),
    })
  ),
});

const instructions = `
You are a helpful AI assistant that creates personalized habit-building plans based on user input and recent journal entries.

You will be given:
- A list of habits the user wants to build, along with the reasons behind them.
- Recent journal entries containing their thoughts, goals, struggles, energy levels, and more.

Your task is to:
1. Generate a *personalized, actionable plan* for each habit in the list.
2. Tailor the plan using context from the journal entries, such as preferences (e.g. home workouts), struggles (e.g. procrastination), goals (e.g. lose fat), or energy levels.
3. *Never* suggest or introduce habits not listed in the input. Focus strictly on habits provided in the \`habitToPlan\` field.

For each habit, return:
- \`habit\`: The habit to be built (from input).
- \`reason\`: The user's original reason (from input), optionally enhanced with relevant context from journal entries.
- \`personalizedPlan\`: A step-by-step, practical strategy to build the habit based on user context.

Be specific and encouraging. The plan should be easy to follow and reflect the user’s preferences and current lifestyle.

Here is the user data:
Habit To Plan: {{{habitToPlan}}}
Journal Entries: {{{journalEntries}}}
Generate one personalized plan per habit in the list.
`;


const prompt = ai.definePrompt({
    name: "habitPlannerPrompt",
    input: {
        schema: ParseHabitPlanInputSchema,
    },
    output: {
        schema: ParseHabitPlanOutputSchema,
    },
    prompt: instructions,
});

export const habitPlanner = ai.defineFlow<
    typeof ParseHabitPlanInputSchema,
    typeof ParseHabitPlanOutputSchema
>({
    name: "habitPlannerFlow",
    inputSchema: ParseHabitPlanInputSchema,
    outputSchema: ParseHabitPlanOutputSchema,
}, async (input) => {
    const { output } = await prompt(input);
    return output!;
});