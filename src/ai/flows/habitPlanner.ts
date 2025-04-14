'use server';
import { ai } from '@/ai/ai-instance';
import { z } from "zod";

export const ParseHabitPlanInputSchema = z.object({
  habitSuggestions: z.array(
    z.object({
      habit: z.string(),
      reason: z.string(),
    })
  ),
  journalEntries: z.array(z.string()),
  userPreferences: z.record(z.string(), z.any()),
  userGoals: z.array(z.string()),
  userStruggles: z.array(z.string()),
});

export const ParseHabitPlanOutputSchema = z.object({
  habitPlan: z.array(
    z.object({
      habit: z.string(),
      reason: z.string(),
      personalizedPlan: z.string(),
    })
  ),
});

const instructions = `You are a helpful AI assistant that creates personalized habit plans based on user data. 
          You will receive habit suggestions, journal entries, user preferences, user goals, and user struggles.
          Your task is to create a personalized habit plan that includes the habit, the reason for the habit, and a personalized plan to help the user incorporate the habit into their daily life.
          The personalized plan should take into account the user's journal entries, preferences, goals, and struggles to provide tailored advice.
          
          Here is the user data:
          Habit Suggestions: {{{habitSuggestions}}}
          Journal Entries: {{{journalEntries}}}
          User Preferences: {{{userPreferences}}}
          User Goals: {{{userGoals}}}
          User Struggles: {{{userStruggles}}}
          
          Please create a personalized habit plan.`;

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