import { z } from "zod";
import { createFlow } from "@botshot/flow";
import { promptTemplate } from "@botshot/flow/prompt";

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

const definePrompt = promptTemplate(
  ParseHabitPlanInputSchema,
  ParseHabitPlanOutputSchema,
  (input) => {
    return {
      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant that creates personalized habit plans based on user data. 
          You will receive habit suggestions, journal entries, user preferences, user goals, and user struggles.
          Your task is to create a personalized habit plan that includes the habit, the reason for the habit, and a personalized plan to help the user incorporate the habit into their daily life.
          The personalized plan should take into account the user's journal entries, preferences, goals, and struggles to provide tailored advice.`,
        },
        {
          role: "user",
          content: `Here is the user data:
          Habit Suggestions: ${JSON.stringify(input.habitSuggestions)}
          Journal Entries: ${JSON.stringify(input.journalEntries)}
          User Preferences: ${JSON.stringify(input.userPreferences)}
          User Goals: ${JSON.stringify(input.userGoals)}
          User Struggles: ${JSON.stringify(input.userStruggles)}
          
          Please create a personalized habit plan.`,
        },
      ],
    };
  }
);

export const habitPlanner = createFlow({
  name: "habitPlanner",
  nodes: {
    prompt: definePrompt,
  },
  edges: [],
  outputs: {
    habitPlan: {
      from: "prompt",
      selector: (output) => output.habitPlan,
    },
  },
});