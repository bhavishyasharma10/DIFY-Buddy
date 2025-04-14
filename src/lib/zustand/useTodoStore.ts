import { getTodos } from "../firestore/todos";
import { UITodo } from "../types/todo"
import { create } from "zustand";
import { useUserStore } from "./useUserStore";

type TodoStore = {
    todos: UITodo[],
    fetchTodos: () => Promise<void>,
    addTodoToStore: (todo: UITodo) => Promise<void>,
    updateTodo: (todo: UITodo) => Promise<void>
}

export const useTodoStore = create<TodoStore>((set, get) => ({
    todos: [],

    fetchTodos: async () => {
        const { user } = useUserStore.getState();
        if (!user?.id) {
          set({ todos: [] });
          return;
        }
        const todos = await getTodos(user.id);
        set({ todos });
    },

    addTodoToStore: async (todo) => {
        set((state) => ({ todos: [...state.todos, todo] }));
    },

    updateTodo: async (todo) => {
        set((state) => ({ todos: state.todos.map(t => t.id === todo.id ? todo : t) }));
    }
}))

