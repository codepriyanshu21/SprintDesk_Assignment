export type TaskStatus = 'backlog' | 'in-progress' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee: string;
  dueDate: string;
  labels: string[];
  comments: Comment[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface AuthUser extends User {
  token: string;
}

export interface Notification {
  id: number;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface MockData {
  users: User[];
  tasks: Task[];
}
