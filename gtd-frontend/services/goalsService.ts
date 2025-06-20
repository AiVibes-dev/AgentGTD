import { apiService, ApiResponse } from './api';
import { Goal } from '../types/goal';

export interface CreateGoalRequest {
  title: string;
  description?: string;
}

export interface UpdateGoalRequest {
  title?: string;
  description?: string;
}

interface GoalsResponse {
  goals: Goal[];
}

interface GoalResponse {
  goal: Goal;
}

class GoalsService {
  private readonly endpoint = 'goals';

  async getGoals(): Promise<ApiResponse<Goal[]>> {
    const response = await apiService.get<GoalsResponse>(this.endpoint);
    return {
      ...response,
      data: response.data.goals,
    };
  }

  async getGoal(id: number): Promise<ApiResponse<Goal>> {
    const response = await apiService.get<GoalResponse>(`${this.endpoint}/${id}`);
    return {
      ...response,
      data: response.data.goal,
    };
  }

  async createGoal(data: CreateGoalRequest): Promise<ApiResponse<Goal>> {
    return apiService.post<Goal>(this.endpoint, data);
  }

  async updateGoal(id: number, data: UpdateGoalRequest): Promise<ApiResponse<Goal>> {
    const response = await apiService.put<GoalResponse>(`${this.endpoint}/${id}`, data);
    return {
      ...response,
      data: response.data.goal,
    };
  }

  async deleteGoal(id: number): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}

export const goalsService = new GoalsService(); 