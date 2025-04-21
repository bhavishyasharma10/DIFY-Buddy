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
      <div className="container mx-auto p-4 md:p-6 space-y-8">
        {/* Journal Section */}
        <section className="w-full max-w-4xl mx-auto">
          <Card className="rounded-xl shadow-lg">
            <CardHeader className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-xl">
              <CardTitle className="text-3xl font-bold">D.I.F.Y Buddy</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <p className="text-gray-700 text-base">
              👋 Hey, I'm D.I.F.Y Buddy!
              I'll keep track of your tasks, habits, thoughts, and plans — I'll Do It For You Buddy!
              </p>
              <div className="h-[300px] md:h-[400px] overflow-y-auto rounded-lg bg-gray-50 p-4 border border-gray-200">
                <div className="space-y-4">
                  {entries.map((entry, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      <div className="text-xs text-gray-500 mb-2">
                        {format(entry.createdAt, "MMM dd, yyyy hh:mm a")}
                      </div>
                      <div className="text-gray-800">{entry.content}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 items-center">
                <Input
                  type="text"
                  placeholder="Enter your thoughts here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 border-gray-300 focus:ring focus:ring-blue-500"
                />
                <Button
                  onClick={sendMessage}
                  className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 px-6 py-3 rounded-lg"
                >
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Habit Suggestions Section */}
        {habitSuggestions.length > 0 && (
          <section className="w-full max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Habit Suggestions</h2>
            <Accordion
              type="single"
              collapsible
              className="space-y-4"
            >
              {habitSuggestions.map((habitData) => (
                <AccordionItem
                  key={habitData.id}
                  value={habitData.id}
                  className="border rounded-lg shadow-md"
                >
                  <AccordionTrigger className="py-4 px-6 flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                    <CardHeader className="flex-1 p-0">
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        {habitData.habit}
                      </CardTitle>
                    </CardHeader>
                  </AccordionTrigger>
                  <AccordionContent className="p-6 bg-gray-50 rounded-b-lg">
                    <CardContent className="space-y-4">
                      <p className="text-gray-700">
                        <strong>Reason:</strong> {habitData.reason}
                      </p>
                      <p className="text-gray-700">
                        <strong>Goal:</strong> {habitData.plan.goal}
                      </p>
                      <ul className="list-disc pl-5 space-y-2">
                        {habitData.plan.steps.map((step, index) => (
                          <li key={`${step}-${index}`} className="text-gray-600">
                            {step}
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 px-6 py-3 rounded-lg"
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
          </section>
        )}
      </div>
  );
}
