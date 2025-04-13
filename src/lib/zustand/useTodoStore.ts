import { getTodos } from "../firestore/todos";
import { UITodo } from "../types/todo"
import { create } from "zustand";

type TodoStore = {
    todos: UITodo[],
    fetchTodos: (userId: string) => Promise<void>,
    addTodoToStore: (todo: UITodo) => Promise<void>,
    updateTodo: (todo: UITodo) => Promise<void>
}

export const useTodoStore = create<TodoStore>((set, get) => ({
    todos: [],

    fetchTodos: async (userId) => {
        const todos = await getTodos(userId);
        set({ todos });
    },

    addTodoToStore: async (todo) => {
        set((state) => ({ todos: [...state.todos, todo] }));
    },

    updateTodo: async (todo) => {
        set((state) => ({ todos: state.todos.map(t => t.id === todo.id ? todo : t) }));
    }
}))

