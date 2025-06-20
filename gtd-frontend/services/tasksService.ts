import { apiService, ApiResponse } from './api';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/task';

interface TasksResponse {
  tasks: Task[];
}

interface TaskResponse {
  task: Task;
}

class TasksService {
  private readonly endpoint = 'tasks';

  async getTasksByGoal(goalId: number): Promise<ApiResponse<Task[]>> {
    const response = await apiService.get<TasksResponse>(`${this.endpoint}?goal_id=${goalId}`);
    return {
      ...response,
      data: response.data.tasks, // Extract tasks array from the response
    };
  }

  async getTask(id: number): Promise<ApiResponse<Task>> {
    const response = await apiService.get<TaskResponse>(`${this.endpoint}/${id}`);
    return {
      ...response,
      data: response.data.task, // Extract task from the response
    };
  }

  async createTask(data: CreateTaskRequest): Promise<ApiResponse<Task>> {
    // Create task returns the task object directly, not wrapped
    return apiService.post<Task>(this.endpoint, data);
  }

  async updateTask(id: number, data: UpdateTaskRequest): Promise<ApiResponse<Task>> {
    const response = await apiService.put<TaskResponse>(`${this.endpoint}/${id}`, data);
    return {
      ...response,
      data: response.data.task, // Extract task from the response
    };
  }

  async deleteTask(id: number): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  async toggleTaskCompletion(id: number, completed: boolean): Promise<ApiResponse<Task>> {
    return this.updateTask(id, { completed });
  }
}

export const tasksService = new TasksService();
export type { CreateTaskRequest, UpdateTaskRequest }; 