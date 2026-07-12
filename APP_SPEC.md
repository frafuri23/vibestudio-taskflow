# TaskFlow

## Purpose
A to-do list app to manage personal, work, shopping and health tasks with priorities, due dates and lists.

## Screens & navigation
- HomeScreen (screens/HomeScreen.tsx) — stack root. Hero header with stats (pending / done today), filter tabs (Oggi/Tutte/Completate), task list, FAB to add task.
- ListsScreen (screens/ListsScreen.tsx) — pushed from Home (folder icon). Shows all lists with pending counts. Has back button.
- AddTaskScreen (screens/AddTaskScreen.tsx) — presented as modal from Home FAB or TaskDetail (edit). Form: title, notes, list picker, priority picker, due date option. Has close (X) button.
- TaskDetailScreen (screens/TaskDetailScreen.tsx) — pushed from a task row. Shows full task, toggle complete, edit (pencil -> AddTask with taskId), delete with inline confirm. Has back button.

Navigator: single native-stack in App.tsx (RootStackParamList: Home, Lists, AddTask{taskId?}, TaskDetail{taskId}).

## Data model
- Task { id, title, notes?, listId, priority: low|medium|high, dueDate?: yyyy-MM-dd, completed, createdAt, completedAt? }
- TaskList { id, name, color, icon (Ionicons name) }
- Default lists: personal, work, shopping, health (lib/storage.ts DEFAULT_LISTS)
- Persistence: AsyncStorage via lib/storage.ts (loadTasks/saveTasks/loadLists/saveLists), seeded with sample tasks on first run.
- State: zustand store in lib/store.ts (useTaskStore) — hydrate/addTask/updateTask/toggleTask/deleteTask.
- Task ids generated with `uuid` (v4) — NOT nanoid (nanoid/non-secure doesn't run in the web preview/published site).

## Features (status)
- Add/edit/delete tasks: done
- Toggle complete: done
- Filter by today/all/done: done
- Lists with color + icon: done
- Priority levels with color coding: done
- Due dates (none/today/tomorrow/+7d): done
- Local persistence (AsyncStorage): done
- Seeded sample data on first launch: done

## Decisions (dated)
- 2026-07-12: Built as local-only app (no backend/auth needed for a personal to-do list); AsyncStorage + zustand for state. No AI features requested, no keys wired.
- 2026-07-12: Theme accent changed from purple (#6C5CE7) to blue (#2563EB) in lib/theme.ts and the "Personale" list color, per user request.
- 2026-07-12: Replaced `nanoid/non-secure` (unsupported in web preview) with `uuid` v4 for task id generation in lib/store.ts; removed nanoid from package.json.

## User preferences
- Italian UI copy (user wrote in Italian).
