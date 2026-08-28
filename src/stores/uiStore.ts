import { create } from 'zustand';
import type { Notification } from '@/types';

interface UiState {
  theme: 'light' | 'dark';
  notifications: Notification[];
  setTheme: (theme: 'light' | 'dark') => void;
  addNotifications: (items: Notification[]) => void;
  markRead: (id: number) => void;
  markAllRead: () => void;
}
const storedNotifications = (): Notification[] => { try { return JSON.parse(localStorage.getItem('sprintdesk_notifications') ?? '[]') as Notification[]; } catch { return []; } };
const storedTheme = (localStorage.getItem('sprintdesk_theme') as 'light' | 'dark' | null) ?? 'light';
export const useUiStore = create<UiState>((set) => ({
  theme: storedTheme, notifications: storedNotifications(),
  setTheme: (theme) => { localStorage.setItem('sprintdesk_theme', theme); document.documentElement.classList.toggle('dark', theme === 'dark'); set({ theme }); },
  addNotifications: (items) => set((state) => { const existing = new Set(state.notifications.map((item) => item.id)); const next = [...items.filter((item) => !existing.has(item.id)), ...state.notifications].slice(0, 40); localStorage.setItem('sprintdesk_notifications', JSON.stringify(next)); return { notifications: next }; }),
  markRead: (id) => set((state) => { const next = state.notifications.map((item) => item.id === id ? { ...item, read: true } : item); localStorage.setItem('sprintdesk_notifications', JSON.stringify(next)); return { notifications: next }; }),
  markAllRead: () => set((state) => { const next = state.notifications.map((item) => ({ ...item, read: true })); localStorage.setItem('sprintdesk_notifications', JSON.stringify(next)); return { notifications: next }; }),
}));
