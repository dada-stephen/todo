import { saveStorage, loadStorage } from "../utils/index.js";

const STORAGE_KEY = {
  TODOS: "todos"
};

const defaultTodos = [
  { id: 1, text: "Learn JavaScript", completed: false },
  { id: 2, text: "Build Todo App", completed: true }
];

const persist = (todos) => saveStorage(STORAGE_KEY.TODOS, todos);

export const createTodoService = () => {
  let todos = loadStorage(STORAGE_KEY.TODOS);

  if (!Array.isArray(todos) || todos.length === 0) {
    todos = defaultTodos;
    persist(todos);
  }

  return {
    getAll: () => todos,

    getCompleted: () => todos.filter((todo) => todo.completed),

    add: (text) => {
      const trimmed = text.trim();
      if (!trimmed) return false;
      todos = [...todos, { id: Date.now(), text: trimmed, completed: false }];
      persist(todos);
      return true;
    },

    update: (id, text) => {
      const trimmed = text.trim();
      if (!trimmed) return false;
      todos = todos.map((todo) =>
        todo.id === id ? { ...todo, text: trimmed } : todo
      );
      persist(todos);
      return true;
    },

    setCompleted: (id, completed) => {
      todos = todos.map((todo) =>
        todo.id === id ? { ...todo, completed } : todo
      );
      persist(todos);
      return true;
    },

    delete: (id) => {
      todos = todos.filter((todo) => todo.id !== id);
      persist(todos);
      return true;
    }
  };
};
