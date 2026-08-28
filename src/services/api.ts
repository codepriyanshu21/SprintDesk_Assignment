import type { MockData, User } from '@/types';

const API_BASE = 'https://dummyjson.com';
let accessToken: string | null = null;

export function setAccessToken(token: string | null): void { accessToken = token; }
export function getAccessToken(): string | null { return accessToken; }

async function request<T>(url: string, options: RequestInit = {}, retry = true): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401 && retry && localStorage.getItem('sprintdesk_refresh_token')) {
    const refreshed = await refreshToken();
    if (refreshed) return request<T>(url, options, false);
  }
  if (!response.ok) throw new Error('Something went wrong. Please try again.');
  return response.json() as Promise<T>;
}

export async function login(username: string, password: string): Promise<{ token: string; refreshToken: string; user: User }> {
  const data = await request<{ accessToken?: string; token?: string; refreshToken?: string; id: number; username: string; firstName: string; lastName: string; email: string }>(`${API_BASE}/auth/login`, {
    method: 'POST', body: JSON.stringify({ username, password, expiresInMins: 30 }),
  }, false);
  const user: User = { id: data.id, name: `${data.firstName} ${data.lastName}`, email: data.email, role: 'Product team', avatar: `${data.firstName[0]}${data.lastName[0]}` };
  const token = data.accessToken ?? data.token ?? `demo-token-${Date.now()}`;
  return { token, refreshToken: data.refreshToken ?? token, user };
}

export async function refreshToken(): Promise<boolean> {
  const refresh = localStorage.getItem('sprintdesk_refresh_token');
  if (!refresh) return false;
  try {
    const data = await request<{ accessToken?: string; token?: string }>(`${API_BASE}/auth/refresh`, { method: 'POST', body: JSON.stringify({ refreshToken: refresh, expiresInMins: 30 }) }, false);
    setAccessToken(data.accessToken ?? data.token ?? refresh);
    return true;
  } catch { return false; }
}

export async function fetchMockData(): Promise<MockData> {
  const response = await fetch('/mock-data.json');
  if (!response.ok) throw new Error('Unable to load workspace data.');
  return response.json() as Promise<MockData>;
}

export async function fetchNotifications(): Promise<{ id: number; title: string; body: string }[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
  if (!response.ok) throw new Error('Unable to load notifications.');
  const posts = await response.json() as { id: number; title: string; body: string }[];
  return posts;
}
