import { create } from 'zustand';
import type { Priority, Task, TaskStatus } from '@/types';

interface BoardState {
  tasks: Task[];
  initialized: boolean;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, 'id' | 'comments' | 'labels'> & { labels?: string[] }) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: TaskStatus, index?: number) => void;
  addComment: (id: string, text: string, author: string) => void;
}

const readTasks = (): Task[] => {
  try { return JSON.parse(localStorage.getItem('sprintdesk_tasks') ?? '[]') as Task[]; } catch { return []; }
};
const persist = (tasks: Task[]) => localStorage.setItem('sprintdesk_tasks', JSON.stringify(tasks));

export const useBoardStore = create<BoardState>((set) => ({
  tasks: readTasks(), initialized: readTasks().length > 0,
  setTasks: (tasks) => { persist(tasks); set({ tasks, initialized: true }); },
  addTask: (task) => set((state) => { const next: Task[] = [...state.tasks, { ...task, id: `SD-${Math.floor(100 + Math.random() * 899)}`, comments: [], labels: task.labels ?? [] }]; persist(next); return { tasks: next }; }),
  updateTask: (id, updates) => set((state) => { const next = state.tasks.map((task) => task.id === id ? { ...task, ...updates } : task); persist(next); return { tasks: next }; }),
  deleteTask: (id) => set((state) => { const next = state.tasks.filter((task) => task.id !== id); persist(next); return { tasks: next }; }),
  moveTask: (id, status, index) => set((state) => { const moving = state.tasks.find((task) => task.id === id); if (!moving) return state; const without = state.tasks.filter((task) => task.id !== id); const updated = { ...moving, status }; const inColumn = without.filter((task) => task.status === status); const insertAt = index === undefined ? inColumn.length : Math.min(index, inColumn.length); const targetId = inColumn[insertAt]?.id; const targetIndex = targetId ? without.findIndex((task) => task.id === targetId) : without.length; without.splice(targetIndex, 0, updated); persist(without); return { tasks: without }; }),
  addComment: (id, text, author) => set((state) => { const next = state.tasks.map((task) => task.id === id ? { ...task, comments: [...task.comments, { id: crypto.randomUUID(), text, author, createdAt: new Date().toISOString() }] } : task); persist(next); return { tasks: next }; }),
}));

export const priorityLabel: Record<Priority, string> = { low: 'Low', medium: 'Medium', high: 'High' };
