import { beforeEach, describe, expect, it, vi } from 'vitest';
import { refreshToken, setAccessToken } from '@/services/api';

describe('auth refresh', () => {
  beforeEach(() => { localStorage.clear(); setAccessToken(null); });
  it('refreshes the access token when a refresh token exists', async () => {
    localStorage.setItem('sprintdesk_refresh_token', 'refresh-token');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ accessToken: 'new-token' }) }));
    expect(await refreshToken()).toBe(true);
    expect(fetch).toHaveBeenCalledWith('https://dummyjson.com/auth/refresh', expect.objectContaining({ method: 'POST' }));
    vi.unstubAllGlobals();
  });
});
