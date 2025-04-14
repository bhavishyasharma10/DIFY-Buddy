'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {useToast} from '@/hooks/use-toast';
import { useHabitSuggestionStore } from '@/lib/zustand/useHabitSuggestionStore';
import { useJournalStore } from '@/lib/zustand/useJournalStore';
import { Button } from '@/components/ui/button';
import { habitPlanner, ParseHabitPlanOutput } from '@/ai/flows/habitPlanner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


const HabitsPage = () => {
  const { toast } = useToast();
  const { habitSuggestions } = useHabitSuggestionStore(state => state);
  const { journals } = useJournalStore(state => state)
  const [habitPlan, setHabitPlan] = useState<ParseHabitPlanOutput | null>(null);

  const handleGeneratePlan = async (index: number) => {
    try {
      const input = {
        habitToPlan: [habitSuggestions[index]],
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
            <React.Fragment key={index}>
              <Card className="mb-4">
                <CardHeader className="p-4">
                  <CardTitle>{suggestion.habit}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600">{suggestion.reason}</p>
                </CardContent>
              </Card>
              <div className="mt-6">
                <Button onClick={() => handleGeneratePlan(index)}>Generate Habit Plan</Button>
              </div>
            </React.Fragment>
          ))}
           {habitPlan && habitPlan.habitPlan.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">Your Personalized Habit Plan</h2>
                {habitPlan.habitPlan.map((plan, index) => (
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem key={index} value={`habit-plan-${index}`}>
                      <AccordionTrigger>{plan.habit}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-gray-600">Reason: {plan.reason}</p>
                        <p className="text-sm text-gray-600 mt-2">Personalized Plan: {plan.personalizedPlan}</p>
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
