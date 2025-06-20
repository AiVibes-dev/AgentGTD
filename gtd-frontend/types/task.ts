export interface Task {
  id: number;
  goal_id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface CreateTaskRequest {
  goal_id: number;
  title: string;
}

export interface UpdateTaskRequest {
  title?: string;
  completed?: boolean;
} 