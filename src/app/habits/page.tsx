'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {useToast} from '@/hooks/use-toast';
import { useHabitSuggestionStore } from '@/lib/zustand/useHabitSuggestionStore';
import { useJournalStore } from '@/lib/zustand/useJournalStore';
import { useUserStore } from '@/lib/zustand/useUserStore';
import { use } from 'react';
import { Button } from '@/components/ui/button';
import { parseHabitPlan } from '@/ai/flows/habitPlanner';
import {ParseHabitPlanOutput} from '@/ai/flows/habitPlanner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


const HabitsPage = () => {
  const { toast } = useToast();
  const habitSuggestions = useHabitSuggestionStore(state => state.habitSuggestions);
  const userPreferences = useUserStore(state => state.user?.preferences) || {};
  const userGoals = useUserStore(state => state.user?.goals) || [];
  const userStruggles = useUserStore(state => state.user?.struggles) || [];
  const journalEntries = useJournalStore(state => state.journals.map((journal) => journal.entry))
  const [habitPlan, setHabitPlan] = useState<ParseHabitPlanOutput | null>(null);


  useEffect(() => {
      console.log({ userPreferences, userGoals, userStruggles, journalEntries })
  }, [])

  const handleGeneratePlan = async () => {
    try {
      const input = {
        habitSuggestions: habitSuggestions.map(suggestion => ({ habit: suggestion.habit, reason: suggestion.reason })),
        journalEntries: journalEntries,
        userPreferences: userPreferences,
        userGoals: userGoals,
        userStruggles: userStruggles,
      };

      const plan = await parseHabitPlan(input);
      setHabitPlan(plan);
      console.log({ plan });
      toast({
        title: 'Habit Plan Generated',
        description: 'Your personalized habit plan has been created.',
      });
    } catch (error) {
      console.error('Error generating habit plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate habit plan. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Habit Suggestions</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {habitSuggestions.map((suggestion, index) => (
            <Card key={index} className="mb-4">
              <CardHeader className="p-4">
                <CardTitle>{suggestion.habit}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">{suggestion.reason}</p>
              </CardContent>
            </Card>
          ))}
          <div className="mt-6">
          <Button onClick={handleGeneratePlan}>Generate Habit Plan</Button>
          </div>
           {habitPlan && habitPlan.habitPlan.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">Your Personalized Habit Plan</h2>
              <Accordion type="multiple" collapsible className="w-full">
                {habitPlan.habitPlan.map((plan, index) => (
                  <AccordionItem key={index} value={`habit-plan-${index}`}>
                    <AccordionTrigger>{plan.habit}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-gray-600">Reason: {plan.reason}</p>
                      <p className="text-sm text-gray-600 mt-2">Personalized Plan: {plan.personalizedPlan}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitsPage;
