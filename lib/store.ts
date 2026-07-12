import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { Task, TaskList, Priority } from "./types";
import { loadTasks, saveTasks, loadLists, saveLists, DEFAULT_LISTS } from "./storage";

type NewTaskInput = {
  title: string;
  notes?: string;
  listId: string;
  priority: Priority;
  dueDate?: string;
};

type TaskStore = {
  tasks: Task[];
  lists: TaskList[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addTask: (input: NewTaskInput) => Promise<void>;
  updateTask: (id: string, patch: Partial<Task>) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  lists: DEFAULT_LISTS,
  hydrated: false,

  hydrate: async () => {
    const [tasks, lists] = await Promise.all([loadTasks(), loadLists()]);
    set({ tasks, lists, hydrated: true });
  },

  addTask: async (input) => {
    const task: Task = {
      id: uuidv4(),
      title: input.title.trim(),
      notes: input.notes?.trim() || undefined,
      listId: input.listId,
      priority: input.priority,
      dueDate: input.dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const next = [task, ...get().tasks];
    set({ tasks: next });
    await saveTasks(next);
  },

  updateTask: async (id, patch) => {
    const next = get().tasks.map((t) => (t.id === id ? { ...t, ...patch } : t));
    set({ tasks: next });
    await saveTasks(next);
  },

  toggleTask: async (id) => {
    const next = get().tasks.map((t) =>
      t.id === id
        ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined }
        : t,
    );
    set({ tasks: next });
    await saveTasks(next);
  },

  deleteTask: async (id) => {
    const next = get().tasks.filter((t) => t.id !== id);
    set({ tasks: next });
    await saveTasks(next);
  },
}));
