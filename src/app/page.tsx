'use client';

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useUserStore } from '@/lib/zustand/useUserStore';
import LoginPage from './login';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {format} from 'date-fns';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import { useHandleNewEntry } from '@/hooks/usehandleNewEntry'
import { useEntryStore } from '@/lib/zustand/useEntryStore'
import { useHabitSuggestionStore } from '@/lib/zustand/useHabitSuggestionStore'

export default function Home() {
  const { user, setUser } = useUserStore();
  const [input, setInput] = useState('');  
  const { handleNewEntry } = useHandleNewEntry();
  const { entries, fetchEntries, addEntryToStore } = useEntryStore(state => state)
  const { habitSuggestions, fetchHabitSuggestions } = useHabitSuggestionStore(state => state)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          id: user.uid,
          email: user.email,
          name: user.displayName,
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchEntries(user.id);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchHabitSuggestions(user.id);
    }
  }, []);

  const sendMessage = async () => {
    if (input.trim() !== '' && user) {
      try {
        const { actionMessages } = await handleNewEntry(input, user.id);
        addEntryToStore({
          id: '',
          content: actionMessages.length > 0 ? `Here's what I understood: \n ${actionMessages.join('\n')}` : 'No actions taken.',
          createdAt: new Date()
        });
      } catch (error) {
        console.error('Error parsing parsedEntry:', error);
      }
      setInput('');
    }
  };

  const handleSaveHabit = (habit: string, plan: {goal: string; steps: string[]}) => {
    // Implement logic to save habit
  };

  if (!user) {
    return <LoginPage />;
  }

  return (<div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>My Journal</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="mb-4">
            <p className="text-muted-foreground">
              Use this chat interface to create journal entries. Your entries
              will be parsed and habits will be suggested.
            </p>
          </div>
          <div
            className="h-[400px] mb-4 overflow-y-auto rounded-md bg-secondary p-2"
          >
            <div>
              {entries.map((entry, index) => (
                <div
                  key={index}
                  className="mb-2 p-3 rounded-md bg-muted"
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  <div className="text-sm text-gray-500">
                    {format(entry.createdAt, 'MMM dd, yyyy hh:mm a')}
                  </div>
                  {entry.content}
                </div>
              ))}
            </div>
          </div>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Type your journal entry..."
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </CardContent>
      </Card>

      {habitSuggestions.length > 0 && (
        <Accordion type="single" collapsible className="mt-4 max-w-2xl mx-auto">
          {habitSuggestions.map(habitData => (
            <AccordionItem key={habitData.id} value={habitData.id} className="mt-2 border rounded-lg shadow-lg">
              <AccordionTrigger className="flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 rounded-t-lg">
                <CardHeader className="flex-1">
                  <CardTitle className="text-lg font-semibold text-blue-600">Proposed Plan for: {habitData.habit}</CardTitle>
                </CardHeader>
                <span className="text-blue-600">➤</span>
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-white rounded-b-lg">
                <CardContent>
                  <p className="mb-2 text-gray-700"><strong>Reason:</strong> {habitData.reason}</p>
                  <p className="mb-2 text-gray-700"><strong>Goal:</strong> {habitData.plan.goal}</p>
                  <ul className="list-disc pl-5 mb-4">
                    {habitData.plan.steps.map((step, index) => (
                      <li key={`${step}-${index}`} className="text-gray-600">{step}</li>
                    ))}
                  </ul>
                  <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={() => handleSaveHabit(habitData.habit, habitData.plan)}>
                    <span className="mr-2">💾</span> Personalize it
                  </Button>
                </CardContent>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>)}
    </div>);
  }

