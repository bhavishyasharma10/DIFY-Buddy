'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useHabitSuggestionStore } from '@/lib/zustand/useHabitSuggestionStore';
import { useJournalStore } from '@/lib/zustand/useJournalStore';
import { Button } from '@/components/ui/button';
import { habitPlanner, ParseHabitPlanOutput } from '@/ai/flows/habitPlanner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const HabitsPage = () => {
  const { toast } = useToast();
  const { habitSuggestions, fetchHabitSuggestions } = useHabitSuggestionStore(state => state);
  const { journals, fetchJournals } = useJournalStore(state => state);
  const [habitPlan, setHabitPlan] = useState<ParseHabitPlanOutput | null>(null);

  useEffect(() => {
    fetchHabitSuggestions();
    fetchJournals();
  }, []);

  const handleGeneratePlan = async (habitSuggestion: any) => {
    try {
      const input = {
        habitToPlan: [habitSuggestion],
        journalEntries: journals.map(
          journal => ({
            highlights: journal.highlights,
            gratitudes: journal.gratitudes,
            thoughts: journal.thoughts,
            reflections: journal.reflections,
            affirmations: journal.affirmations,
            tone: journal.tone,
            mood: journal.mood,
            energy: journal.energy,
            topics: journal.topics,
            goals: journal.goals,
            struggles: journal.struggles,
          })
        ),
      };

      const plan = await habitPlanner(input);
      toast({
        title: 'Habit Plan Generated',
        description: 'Your personalized habit plan has been created.',
      });
      setHabitPlan(plan);
    } catch (error) {
      console.error('Error generating habit plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate habit plan. Please try again.',
        variant: 'destructive',
      });    }
  }; 

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card className="w-full max-w-3xl mx-auto rounded-lg shadow-md">
        <CardHeader className="space-y-1 p-4 md:p-6">
          <CardTitle className="text-2xl font-bold md:text-3xl">Habit Suggestions</CardTitle>
          <p className="text-sm text-muted-foreground md:text-base">
              Explore these habit suggestions and generate a personalized plan tailored to your needs.
            </p>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
        <div className="mb-6 md:mb-8">
          {habitSuggestions.map((suggestion) => (
            <Card key={suggestion.id} className="mb-4 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 md:p-4">
                <CardTitle className="text-lg font-semibold md:text-xl">{suggestion.habit}</CardTitle>

                <Button
                  onClick={() => handleGeneratePlan(suggestion)}
                  className="mt-2 md:mt-0 hover:scale-105 transition-transform duration-200"
                >
                  Generate Habit Plan
                </Button>
              </CardHeader>
              <CardContent className="p-3 md:p-4">
                <p className="text-sm text-gray-600 md:text-base">{suggestion.reason}</p>
              </CardContent>
            </Card>
          ))}</div>

            {habitPlan && habitPlan.habitPlan.length > 0 && (
            <div className="mt-6 md:mt-8">
              <h3 className="text-xl font-bold mb-4 md:text-2xl">Your Personalized Habit Plan</h3>
              {habitPlan.habitPlan.map((plan, index) => (
                <Accordion key={index} type="single" collapsible className="w-full">
                  <AccordionItem value={`habit-plan-${index}`}>
                    <AccordionTrigger className="hover:bg-gray-100 rounded-lg p-3 md:p-4">
                      <span className="font-medium md:text-lg">{plan.habit}</span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 p-3 md:p-4">
                      <p className="text-sm text-gray-600 md:text-base">Reason: {plan.reason}</p>
                      <p className="text-sm text-gray-600 mt-2 md:text-base">Personalized Plan: {plan.personalizedPlan}</p>

                      </AccordionContent>
                    </AccordionItem>
                </Accordion>
                ))}
              </div>
          )}
        </CardContent>
      </Card>      
    </div>
  );
};

export default HabitsPage;
