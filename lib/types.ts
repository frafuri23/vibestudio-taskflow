export type Priority = "low" | "medium" | "high";

export type TaskList = {
  id: string;
  name: string;
  color: string;
  icon: string; // Ionicons name
};

export type Task = {
  id: string;
  title: string;
  notes?: string;
  listId: string;
  priority: Priority;
  dueDate?: string; // ISO date string (yyyy-mm-dd)
  completed: boolean;
  createdAt: string;
  completedAt?: string;
};
