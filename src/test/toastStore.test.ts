import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useToastStore } from '@/stores/toastStore';

describe('toast store', () => {
  beforeEach(() => { vi.useFakeTimers(); useToastStore.setState({ toasts: [] }); });
  it('adds and auto removes a toast', () => { useToastStore.getState().addToast('Saved', 'success'); expect(useToastStore.getState().toasts[0].message).toBe('Saved'); vi.advanceTimersByTime(4000); expect(useToastStore.getState().toasts).toHaveLength(0); vi.useRealTimers(); });
});
