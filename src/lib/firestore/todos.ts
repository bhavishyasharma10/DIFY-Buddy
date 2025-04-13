import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { FireStoreTodo, Todo, UITodo } from '../types/todo';
import { toUITodo } from '../utils';

export const addTodo = async (userId: string, todo: Todo) => {
  const todoRef = await addDoc(collection(db, 'users', userId, 'todos'), {
    ...todo,
    status: 'pending',
    createdAt: serverTimestamp(),
  });

  return {
    id: todoRef.id,
    ...todo,
    status: 'pending',
    createdAt: new Date(),
  } as UITodo;
};

export const getTodos = async (userId: string) => {
  const todosSnapshot = await getDocs(collection(db, 'users', userId, 'todos'));
  const todos = todosSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as FireStoreTodo[];

  return toUITodo(todos);
};
