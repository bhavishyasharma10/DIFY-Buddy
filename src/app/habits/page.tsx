'use client';

import {useState, useEffect} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Checkbox} from '@/components/ui/checkbox';
import {Label} from '@/components/ui/label';
import {useToast} from '@/hooks/use-toast';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import {db} from '@/lib/firebase';
import {collection, getDocs, updateDoc, doc} from 'firebase/firestore';
import { Button } from '@/components/ui/button';

interface HabitData {
  id: string;
  habit: string;
  reason: string;
  plan: {
    goal: string;
    steps: string[];
  };
  checkIns: boolean[];
  trackingStarted: boolean;
  saved: boolean;
}

const HabitsPage = () => {
  const [habits, setHabits] = useState<HabitData[]>([]);
  const {toast} = useToast();

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const habitsCollection = collection(db, 'habits');
        const habitsSnapshot = await getDocs(habitsCollection);
        const habitsList = habitsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            habit: data.habit,
            reason: data.reason,
            plan: {
              goal: data.plan.goal,
              steps: data.plan.steps,
            },
            checkIns: data.checkIns,
            trackingStarted: data.trackingStarted,
            saved: data.saved,
          };
        });
        setHabits(habitsList);
      } catch (error) {
        console.error('Error fetching habits:', error);
        toast({
          title: 'Error',
          description: 'Failed to load habits. Please try again.',
          variant: 'destructive',
        });
      }
    };
    fetchHabits();
  }, [toast]);

  const handleStartTracking = async (id: string) => {
    try {
      const habitRef = doc(db, 'habits', id);
      await updateDoc(habitRef, {trackingStarted: true, checkIns: Array(habits.find(habit => habit.id === id)?.plan.steps.length).fill(false)});
      setHabits(prevHabits =>
        prevHabits.map(habit =>
          habit.id === id ? {...habit, trackingStarted: true, checkIns: Array(habit.plan.steps.length).fill(false)} : habit
        )
      );
      toast({
        title: 'Tracking Started',
        description: 'You have started tracking your habit.',
      });
    } catch (error) {
      console.error('Error starting tracking:', error);
      toast({
        title: 'Error',
        description: 'Failed to start tracking. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCheckIn = async (habitId: string, index: number) => {
    try {
      const habitRef = doc(db, 'habits', habitId);
      const habit = habits.find(habit => habit.id === habitId);
      const updatedCheckIns = [...habit.checkIns];
      updatedCheckIns[index] = !updatedCheckIns[index];

      await updateDoc(habitRef, {checkIns: updatedCheckIns});

      setHabits(prevHabits =>
        prevHabits.map(habit => {
          if (habit.id === habitId) {
            return {...habit, checkIns: updatedCheckIns};
          }
          return habit;
        })
      );
      toast({
        title: 'Check-in Updated',
        description: 'Your check-in has been updated.',
      });
    } catch (error) {
      console.error('Error updating check-in:', error);
      toast({
        title: 'Error',
        description: 'Failed to update check-in. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const calculateStreak = (checkIns: boolean[]) => {
    let currentStreak = 0;
    if (checkIns.length > 0) {
      for (let i = checkIns.length - 1; i >= 0; i--) {
        if (checkIns[i]) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
    return currentStreak;
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Habit Tracking</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {habits.map(habitData => (
            <Card key={habitData.id} className="mt-6">
              <CardHeader>
                <CardTitle>Habit: {habitData.habit}</CardTitle>
                <p className="text-sm text-gray-600">Reason: {habitData.reason}</p>
              </CardHeader>
              <CardContent>
                {!habitData.trackingStarted ? (
                  <Button onClick={() => handleStartTracking(habitData.id)}>Track Plan</Button>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="tracking">
                      <AccordionTrigger className="text-lg font-semibold">
                        Actionable Plan & Tracking
                      </AccordionTrigger>
                      <AccordionContent>
                        <h3 className="text-lg font-semibold mb-2">
                          Goal: {habitData.plan.goal}
                        </h3>
                        <div className="mb-4">
                          {habitData.plan.steps.map((step, index) => (
                            <div key={index} className="flex items-center justify-between py-2">
                              <div className="flex items-center">
                                <Checkbox
                                  id={`checkin-${index}`}
                                  checked={habitData.checkIns[index] || false}
                                  onCheckedChange={() => handleCheckIn(habitData.id, index)}
                                  disabled={!habitData.trackingStarted}
                                />
                                <Label htmlFor={`checkin-${index}`} className="ml-2">
                                  {step}
                                </Label>
                              </div>
                            </div>
                          ))}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Current Streak</h3>
                        <p className="text-gray-700">You have a streak of {calculateStreak(habitData.checkIns)} days!</p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitsPage;
