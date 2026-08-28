import { beforeEach, describe, expect, it } from 'vitest';
import { useBoardStore } from '@/stores/boardStore';
import type { Task } from '@/types';

const task = (id: string, status: Task['status'] = 'backlog'): Task => ({ id, title: id, description: '', status, priority: 'medium', assignee: 'Alex Morgan', dueDate: '2024-06-20', labels: [], comments: [] });

describe('board store', () => {
  beforeEach(() => { localStorage.clear(); useBoardStore.setState({ tasks: [], initialized: false }); });
  it('adds a task', () => { useBoardStore.getState().addTask({ title: 'new', description: '', status: 'backlog', priority: 'medium', assignee: 'Alex Morgan', dueDate: '2024-06-20' }); expect(useBoardStore.getState().tasks).toHaveLength(1); });
  it('moves a task between columns', () => { useBoardStore.getState().setTasks([task('one')]); useBoardStore.getState().moveTask('one', 'done'); expect(useBoardStore.getState().tasks[0].status).toBe('done'); });
  it('deletes a task', () => { useBoardStore.getState().setTasks([task('one')]); useBoardStore.getState().deleteTask('one'); expect(useBoardStore.getState().tasks).toHaveLength(0); });
});
