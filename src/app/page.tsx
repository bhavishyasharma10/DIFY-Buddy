"use client";

import React, { useState, useEffect } from "react";
import { useUserStore } from "@/lib/zustand/useUserStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useHandleNewEntry } from "@/hooks/usehandleNewEntry";
import { useEntryStore } from "@/lib/zustand/useEntryStore";
import { useHabitSuggestionStore } from "@/lib/zustand/useHabitSuggestionStore";

export default function Home() {
  const { user } = useUserStore();
  const [input, setInput] = useState("");
  const { handleNewEntry } = useHandleNewEntry();
  const { entries, fetchEntries, addEntryToStore } = useEntryStore(
    (state) => state
  );
  const { habitSuggestions, fetchHabitSuggestions } = useHabitSuggestionStore(
    (state) => state
  );

  useEffect(() => {
    if (user?.id) {
      fetchEntries();
      fetchHabitSuggestions();
    }
  }, [user?.id]);

  const sendMessage = async () => {
    if (input.trim() !== "" && user) {
      try {
        const { actionMessages } = await handleNewEntry(input, user.id);
        addEntryToStore({
          id: "",
          content:
            actionMessages.length > 0
              ? `Here's what I understood: \n ${actionMessages.join("\n")}`
              : "No actions taken.",
          createdAt: new Date(),
        });
      } catch (error) {
        console.error("Error parsing parsedEntry:", error);
      }
      setInput("");
    }
  };

  const handleSaveHabit = (
    habit: string,
    plan: { goal: string; steps: string[] }
  ) => {
    // Implement logic to save habit
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Journal Card */}
      <Card className="w-full max-w-3xl mx-auto rounded-xl shadow-lg md:rounded-2xl">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-2xl font-bold">My Journal</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 space-y-4">
          <div className="text-sm md:text-base text-muted-foreground">
            <p>
              Use this chat interface to create journal entries. Your entries
              will be parsed and habits will be suggested.
            </p>
          </div>
          <div
            className="h-[300px] md:h-[400px] overflow-y-auto rounded-lg bg-gray-100 p-3"
          >
            <div className="space-y-2">
              {entries.map((entry, index) => (                
                <div
                  key={index}
                  className="p-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors duration-200 md:p-4"
                  style={{ whiteSpace: "pre-wrap" }}                  
                >
                  <div className="text-xs text-gray-500">
                    {format(entry.createdAt, "MMM dd, yyyy hh:mm a")}
                  </div>
                  {entry.content}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 items-center">
            <Input
              type="text"
              placeholder="Enter your thoughts here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"              
            />          
            <Button onClick={sendMessage} className="hover:scale-105 transition-transform duration-200">
              Send
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Habit Suggestions */}
      {habitSuggestions.length > 0 && (
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-xl font-bold md:text-2xl">Habit Suggestions</h2>
          <Accordion type="single" collapsible className="space-y-2 md:space-y-3">
            {habitSuggestions.map((habitData) => (
              <AccordionItem
                key={habitData.id}
                value={habitData.id}
                className="border rounded-lg shadow-md md:rounded-xl md:shadow-lg"
              >
                <AccordionTrigger className="py-3 px-4 flex items-center justify-between hover:bg-gray-100 transition-colors duration-200 md:py-4 md:px-6">
                  <CardHeader className="flex-1 p-0 ">
                    <CardTitle className="text-lg md:text-xl font-semibold text-primary">
                      {habitData.habit}
                    </CardTitle>
                  </CardHeader>
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-gray-50 rounded-b-lg md:p-6">
                  <CardContent className="space-y-2 md:space-y-3">
                    <p className="text-gray-700 md:text-lg">
                      <strong>Reason:</strong> {habitData.reason}
                    </p>
                    <p className="text-gray-700 md:text-lg">
                      <strong>Goal:</strong> {habitData.plan.goal}
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      {habitData.plan.steps.map((step, index) => (
                        <li
                          key={`${step}-${index}`}
                          className="text-gray-600"
                        >
                          {step}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="bg-primary text-white hover:bg-primary/90 hover:scale-105 transition-transform duration-200 md:px-6 md:py-3"
                      onClick={() =>
                        handleSaveHabit(habitData.habit, habitData.plan)
                      }
                    >
                      <span className="mr-2">💾</span> Personalize it
                    </Button>
                  </CardContent>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
