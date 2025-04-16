'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useJournalStore } from '@/lib/zustand/useJournalStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { useTodoStore } from '@/lib/zustand/useTodoStore';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ListChecks, BookOpen } from 'lucide-react';
const JournalPage = () => {

  const { journals, fetchJournals } = useJournalStore();
  const { todos, updateTodo, fetchTodos } = useTodoStore();
  const [newTodoText, setNewTodoText] = useState('');
  const journalEntries = useMemo(() => {
    return journals.reduce((acc: { [key: string]: { content: string, createdAt: Date }[] }, item) => {
      const entries: { [key: string]: string[] } = {
        affirmations: item.affirmations,
        highlights: item.highlights,
        gratitudes: item.gratitudes,
        thoughts: item.thoughts,
        reflections: item.reflections,
      };

      for (const [key, value] of Object.entries(entries)) {
        if (value?.length > 0) {
          if (!acc[key]) {
            acc[key] = [];
          }
          value.forEach(content => {
            acc[key].push({ content, createdAt: item.createdAt });
          });
        };
      }
      return acc;
    }, {} as { [key: string]: { content: string, createdAt: Date }[] });

  }, [journals]);

  const toggleTodo = (index: number) => {
    const updatedTodos = [...todos];
    updatedTodos[index].status = updatedTodos[index].status === 'completed' ? 'pending' : 'completed';
    updateTodo(updatedTodos[index]);
  };

  const [activeTab, setActiveTab] = useState<'entries' | 'todos'>('entries');

  const toggleTab = (tab: 'entries' | 'todos') => setActiveTab(tab)

  const [open, setOpen] = useState(false);
  const handleAddTodo = () => {

  };

  useEffect(() => {
    fetchJournals();
    fetchTodos();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {/* Tabbed Interface */}
      <div className="w-full max-w-3xl mx-auto">
          <div className="flex md:block md:border-b-2">
            <div className="md:flex md:border-b-2 hidden w-full max-w-3xl mx-auto">
              <Button variant="ghost" className={cn('w-1/2 rounded-none', activeTab === 'entries' && 'border-b-2 border-primary')} onClick={() => toggleTab('entries')}>
                <BookOpen className="h-6 w-6" />
              </Button>
              <Button variant="ghost" className={cn('w-1/2 rounded-none', activeTab === 'todos' && 'border-b-2 border-primary')} onClick={() => toggleTab('todos')}>
                <ListChecks className="h-6 w-6" />
              </Button>
            </div>
          </div>
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-secondary border-t z-50 flex justify-around">
          <Button variant="ghost" className={cn('w-1/2 rounded-none', activeTab === 'entries' && 'border-t-2 border-primary')} onClick={() => toggleTab('entries')}>
            <BookOpen className="h-6 w-6" />
          </Button>
          <Button variant="ghost" className={cn('w-1/2 rounded-none', activeTab === 'todos' && 'border-t-2 border-primary')} onClick={() => toggleTab('todos')}>
            <ListChecks className="h-6 w-6" />
          </Button>
        </div>
        <Card className="w-full max-w-3xl mx-auto shadow-lg rounded-xl">
          {activeTab === 'entries' && (
            <CardContent className="p-4 md:p-6 space-y-4">
              {Object.entries(journalEntries).map(([category, entries]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold capitalize">{category}</h3>
                  <ul className="space-y-2">
                    {entries.map((entry, index) => (
                      <li key={index} className="p-3 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors duration-200">

                        <p className="text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>
                          {entry.content}
                        </p>
                        <div className="text-xs text-gray-500">{format(entry.createdAt, 'MMM dd, yyyy')}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          )}
          {activeTab === 'todos' && (
            <CardContent className="p-4 md:p-6">
              <CardHeader className="flex justify-between">
                <CardTitle className="text-2xl font-bold">To-Dos</CardTitle>
                <Dialog open={open} onOpenChange={setOpen}>
                  {/* <DialogTrigger asChild>
                    <Button onClick={() => setOpen(true)} className="bg-primary text-white hover:bg-primary/90">Add To-Do</Button>
                  </DialogTrigger> */}
                  <DialogContent className="sm:max-w-[425px] bg-background">
                    <DialogHeader />
                    <div className="grid gap-4 py-4">
                      <Label htmlFor="text" className="text-right">
                        Text
                      </Label>
                      <Input
                        id="text"
                        value={newTodoText}
                        onChange={(e) => setNewTodoText(e.target.value)}
                      />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="submit" onClick={handleAddTodo} className="w-full">Save</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              {/* Todo List */}
              <ul className="space-y-2">
                {todos.map((todo, index) => (
                  <li key={index} className="flex items-center justify-between p-3 rounded-md bg-gray-100">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`todo-checkbox-${index}`}
                        checked={todo.status === 'completed'}
                        onCheckedChange={() => toggleTodo(index)}
                      />
                      <label
                        htmlFor={`todo-${index}`}
                        className={cn(
                          'text-sm font-medium leading-none',
                          todo.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-800'
                        )}
                      >
                        <div
                          style={{ whiteSpace: 'pre-wrap' }}
                        >
                          {todo.text}
                        </div>
                      </label>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {todo.category}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default JournalPage;
