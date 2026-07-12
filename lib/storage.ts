import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task, TaskList } from "./types";

const TASKS_KEY = "@taskflow/tasks";
const LISTS_KEY = "@taskflow/lists";

const todayISO = () => new Date().toISOString().slice(0, 10);
const addDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const DEFAULT_LISTS: TaskList[] = [
  { id: "personal", name: "Personale", color: "#2563EB", icon: "person" },
  { id: "work", name: "Lavoro", color: "#22C55E", icon: "briefcase" },
  { id: "shopping", name: "Spesa", color: "#F59E0B", icon: "cart" },
  { id: "health", name: "Salute", color: "#EF4444", icon: "fitness" },
];

const SEED_TASKS: Task[] = [
  {
    id: "seed-1",
    title: "Preparare la presentazione per il team",
    notes: "Rivedere gli slide e aggiungere i numeri del Q3",
    listId: "work",
    priority: "high",
    dueDate: todayISO(),
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-2",
    title: "Comprare frutta e verdura",
    listId: "shopping",
    priority: "low",
    dueDate: todayISO(),
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-3",
    title: "Allenamento mattutino",
    notes: "30 minuti di corsa",
    listId: "health",
    priority: "medium",
    dueDate: todayISO(),
    completed: true,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
  {
    id: "seed-4",
    title: "Chiamare il dentista",
    listId: "personal",
    priority: "medium",
    dueDate: addDays(1),
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-5",
    title: "Rispondere alle email arretrate",
    listId: "work",
    priority: "medium",
    dueDate: addDays(-1),
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-6",
    title: "Rinnovare l'abbonamento in palestra",
    listId: "health",
    priority: "low",
    dueDate: addDays(3),
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

export async function loadTasks(): Promise<Task[]> {
  try {
    const raw = await AsyncStorage.getItem(TASKS_KEY);
    if (!raw) {
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(SEED_TASKS));
      return SEED_TASKS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch {
    // ignore
  }
}

export async function loadLists(): Promise<TaskList[]> {
  try {
    const raw = await AsyncStorage.getItem(LISTS_KEY);
    if (!raw) {
      await AsyncStorage.setItem(LISTS_KEY, JSON.stringify(DEFAULT_LISTS));
      return DEFAULT_LISTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_LISTS;
    return parsed;
  } catch {
    return DEFAULT_LISTS;
  }
}

export async function saveLists(lists: TaskList[]): Promise<void> {
  try {
    await AsyncStorage.setItem(LISTS_KEY, JSON.stringify(lists));
  } catch {
    // ignore
  }
}
