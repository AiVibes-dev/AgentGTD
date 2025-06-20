import { useState, useEffect, useCallback } from 'react';
import { goalsService, CreateGoalRequest, UpdateGoalRequest } from '../services/goalsService';
import { Goal } from '../types/goal';
import { ApiError } from '../services/api';

interface UseGoalsReturn {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  fetchGoals: () => Promise<void>;
  createGoal: (data: CreateGoalRequest) => Promise<Goal | null>;
  updateGoal: (id: number, data: UpdateGoalRequest) => Promise<Goal | null>;
  deleteGoal: (id: number) => Promise<boolean>;
  refreshGoals: () => Promise<void>;
}

export const useGoals = (): UseGoalsReturn => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    try {
      setError(null);
      const response = await goalsService.getGoals();
      setGoals(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch goals';
      setError(errorMessage);
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshGoals = useCallback(async () => {
    setRefreshing(true);
    await fetchGoals();
    setRefreshing(false);
  }, [fetchGoals]);

  const createGoal = useCallback(async (data: CreateGoalRequest): Promise<Goal | null> => {
    try {
      setError(null);
      const response = await goalsService.createGoal(data);
      const newGoal = response.data;
      setGoals(prev => [...prev, newGoal]);
      return newGoal;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create goal';
      setError(errorMessage);
      console.error('Error creating goal:', err);
      return null;
    }
  }, []);

  const updateGoal = useCallback(async (id: number, data: UpdateGoalRequest): Promise<Goal | null> => {
    try {
      setError(null);
      const response = await goalsService.updateGoal(id, data);
      const updatedGoal = response.data;
      setGoals(prev => prev.map(goal => goal.id === id ? updatedGoal : goal));
      return updatedGoal;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update goal';
      setError(errorMessage);
      console.error('Error updating goal:', err);
      return null;
    }
  }, []);

  const deleteGoal = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await goalsService.deleteGoal(id);
      setGoals(prev => prev.filter(goal => goal.id !== id));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete goal';
      setError(errorMessage);
      console.error('Error deleting goal:', err);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return {
    goals,
    loading,
    error,
    refreshing,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    refreshGoals,
  };
}; 