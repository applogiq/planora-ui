import { useState, useEffect } from 'react';
import { taskApiService, Task, CreateTaskRequest, TasksResponse } from '../services/taskApi';

export interface UseTasksOptions {
  projectId?: string;
  autoFetch?: boolean;
}

export function useTasks(options: UseTasksOptions = {}) {
  const { projectId, autoFetch = true } = options;

  const [data, setData] = useState<TasksResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async (page: number = 1, perPage: number = 50) => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskApiService.getTasks(projectId, page, perPage);
      setData(response);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: CreateTaskRequest): Promise<Task> => {
    try {
      setError(null);
      const newTask = await taskApiService.createTask(taskData);

      // Update local data if we have it
      if (data) {
        setData(prev => ({
          ...prev!,
          items: [newTask, ...prev!.items],
          total: prev!.total + 1
        }));
      }

      return newTask;
    } catch (err) {
      console.error('Error creating task:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateTask = async (id: string, taskData: Partial<CreateTaskRequest>): Promise<Task> => {
    try {
      setError(null);
      const updatedTask = await taskApiService.updateTask(id, taskData);

      // Update local data if we have it
      if (data) {
        setData(prev => ({
          ...prev!,
          items: prev!.items.map(task => task.id === id ? updatedTask : task)
        }));
      }

      return updatedTask;
    } catch (err) {
      console.error('Error updating task:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteTask = async (id: string): Promise<void> => {
    try {
      setError(null);
      await taskApiService.deleteTask(id);

      // Update local data if we have it
      if (data) {
        setData(prev => ({
          ...prev!,
          items: prev!.items.filter(task => task.id !== id),
          total: prev!.total - 1
        }));
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateTaskStatus = async (id: string, status: string): Promise<Task> => {
    try {
      setError(null);
      const updatedTask = await taskApiService.updateTaskStatus(id, status);

      // Update local data if we have it
      if (data) {
        setData(prev => ({
          ...prev!,
          items: prev!.items.map(task => task.id === id ? updatedTask : task)
        }));
      }

      return updatedTask;
    } catch (err) {
      console.error('Error updating task status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task status';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchTasks();
    }
  }, [projectId, autoFetch]);

  return {
    data,
    tasks: data?.items || [],
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    refetch: () => fetchTasks(),
  };
}