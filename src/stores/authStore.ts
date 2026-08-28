import { create } from 'zustand';
import type { AuthUser } from '@/types';
import { login as loginRequest, refreshToken, setAccessToken } from '@/services/api';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null, isLoading: true, error: null,
  initialize: async () => {
    const saved = localStorage.getItem('sprintdesk_user');
    if (saved && await refreshToken()) {
      const parsed = JSON.parse(saved) as AuthUser;
      set({ user: parsed, isLoading: false });
    } else {
      localStorage.removeItem('sprintdesk_user');
      localStorage.removeItem('sprintdesk_refresh_token');
      setAccessToken(null);
      set({ user: null, isLoading: false });
    }
  },
  login: async (username, password) => {
    set({ error: null, isLoading: true });
    try {
      const result = await loginRequest(username, password);
      setAccessToken(result.token);
      localStorage.setItem('sprintdesk_refresh_token', result.refreshToken);
      const user = { ...result.user, token: result.token };
      localStorage.setItem('sprintdesk_user', JSON.stringify(user));
      set({ user, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unable to sign in.', isLoading: false });
      return false;
    }
  },
  logout: () => {
    setAccessToken(null);
    localStorage.removeItem('sprintdesk_user');
    localStorage.removeItem('sprintdesk_refresh_token');
    set({ user: null, error: null });
  },
}));
