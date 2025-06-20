import { useState, useEffect, useCallback } from 'react';
import { tasksService, CreateTaskRequest, UpdateTaskRequest } from '../services/tasksService';
import { Task } from '../types/task';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  fetchTasks: (goalId: number) => Promise<void>;
  createTask: (data: CreateTaskRequest) => Promise<Task | null>;
  updateTask: (id: number, data: UpdateTaskRequest) => Promise<Task | null>;
  deleteTask: (id: number) => Promise<boolean>;
  toggleTaskCompletion: (id: number, completed: boolean) => Promise<boolean>;
  refreshTasks: (goalId: number) => Promise<void>;
  pendingCount: number;
  completedCount: number;
}

export const useTasks = (goalId?: number): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (targetGoalId: number) => {
    try {
      setError(null);
      const response = await tasksService.getTasksByGoal(targetGoalId);
      setTasks(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(errorMessage);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshTasks = useCallback(async (targetGoalId: number) => {
    setRefreshing(true);
    await fetchTasks(targetGoalId);
    setRefreshing(false);
  }, [fetchTasks]);

  const createTask = useCallback(async (data: CreateTaskRequest): Promise<Task | null> => {
    try {
      setError(null);
      const response = await tasksService.createTask(data);
      const newTask = response.data;
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      console.error('Error creating task:', err);
      return null;
    }
  }, []);

  const updateTask = useCallback(async (id: number, data: UpdateTaskRequest): Promise<Task | null> => {
    try {
      setError(null);
      const response = await tasksService.updateTask(id, data);
      const updatedTask = response.data;
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      console.error('Error updating task:', err);
      return null;
    }
  }, []);

  const deleteTask = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await tasksService.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      console.error('Error deleting task:', err);
      return false;
    }
  }, []);

  const toggleTaskCompletion = useCallback(async (id: number, completed: boolean): Promise<boolean> => {
    try {
      setError(null);
      const response = await tasksService.toggleTaskCompletion(id, completed);
      const updatedTask = response.data;
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      console.error('Error toggling task completion:', err);
      return false;
    }
  }, []);

  // Calculate counts
  const pendingCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.filter(task => task.completed).length;

  useEffect(() => {
    if (goalId) {
      setLoading(true);
      fetchTasks(goalId);
    }
  }, [goalId, fetchTasks]);

  return {
    tasks,
    loading,
    error,
    refreshing,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    refreshTasks,
    pendingCount,
    completedCount,
  };
}; 