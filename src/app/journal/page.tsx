'use client';

import React, { useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useJournalStore } from '@/lib/zustand/useJournalStore';
import { useTodoStore } from '@/lib/zustand/useTodoStore';
import { ParseJournal } from '@/ai/flows/intent';

const JournalPage: React.FC = () => {
  const { journals, fetchJournals } = useJournalStore();
  const { todos, updateTodo, fetchTodos } = useTodoStore();

  const journalEntries = useMemo(() => {
    return journals.reduce((acc: ParseJournal, item) => {
      const keys: (keyof ParseJournal)[] = [
        'affirmations',
        'highlights',
        'gratitudes',
        'thoughts',
        'reflections',
      ];
      for (const key of keys) {
        acc[key] = (acc[key] || []).concat(item[key] || []);
      }
      return acc;
    }, {} as ParseJournal);
  }, [journals]);
  const toggleTodo = (index: number) => {
    const updatedTodos = [...todos];
    updatedTodos[index].status =
      updatedTodos[index].status === 'completed' ? 'pending' : 'completed';
    updateTodo(updatedTodos[index]);
  };
  useEffect(() => {
    fetchJournals();
    fetchTodos();
  }, []);
  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card className="w-full max-w-3xl mx-auto shadow-lg rounded-xl">
        <CardHeader className="p-4 md:p-6 border-b">
          <CardTitle className="text-2xl font-bold">My Journal</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* To-Do Section */}
            <Card className="shadow-md rounded-lg">
              <CardHeader>
                <CardTitle className="text-xl">To-Do</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="space-y-2">
                  {todos.map((todo, index) => (
                    <li
                      key={index} 
                      className="flex items-center justify-between p-3 rounded-md bg-gray-100"
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`todo-${index}`}
                          checked={todo.status === 'completed'}
                          onCheckedChange={() => toggleTodo(index)}
                        />
                        <label
                          htmlFor={`todo-${index}`}
                          className={
                            `text-sm font-medium leading-none ${
                              todo.status === 'completed'
                                ? 'text-gray-500 line-through'
                                : 'text-gray-800'
                            }`
                              : 'text-gray-800'
                          }`}>
                          {todo.text}
                        </label>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {todo.category}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>            

            {/* Journal Entries Section */}
            {Object.entries(journalEntries).map(([key, value]) => (
              <Card key={key}
                className="border rounded-md bg-white shadow-sm"
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-xl font-semibold">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>
                    {value.join('\n')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalPage;
