import React, { useState, useEffect, useCallback } from 'react';
import { epicApiService, EpicsResponse, Epic, CreateEpicRequest } from '../services/epicApi';

export interface EpicsState {
  data: EpicsResponse | null;
  loading: boolean;
  error: string | null;
}

export const useEpics = (projectId?: string) => {
  const [state, setState] = useState<EpicsState>({
    data: null,
    loading: true,
    error: null,
  });

  // Create a memoized version of fetchEpics to avoid infinite loops
  const fetchEpics = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const data = await epicApiService.getEpics(1, 50, projectId);
      setState({ data, loading: false, error: null });
    } catch (error) {

      // For development, provide mock data if API fails
      if (import.meta.env.DEV) {
        const mockData: EpicsResponse = {
          items: [
            {
              id: 'mock-epic-1',
              title: 'Mock Epic 1',
              description: 'This is a mock epic for development',
              priority: 'High',
              status: 'In Progress',
              project_id: projectId || 'mock-project',
              assignee_id: 'mock-user',
              due_date: '2025-12-31T17:00:00Z',
              total_story_points: 89,
              completed_story_points: 45,
              total_tasks: 24,
              completed_tasks: 12,
              labels: ['Mock', 'Development'],
              business_value: 'High - Foundation for all user interactions',
              created_at: '2025-01-01T09:00:00Z',
              updated_at: '2025-01-20T14:30:00Z',
              project_name: 'Mock Project',
              assignee_name: 'Mock User',
              completion_percentage: 50.6,
              project: {} as any,
              assignee: {} as any
            }
          ],
          total: 1,
          page: 1,
          per_page: 50,
          total_pages: 1,
          has_next: false,
          has_prev: false
        };
        setState({ data: mockData, loading: false, error: null });
      } else {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch epics',
        });
      }
    }
  }, [projectId]);

  useEffect(() => {
    fetchEpics();
  }, [fetchEpics]);

  const createEpic = async (epicData: CreateEpicRequest): Promise<Epic> => {
    try {
      const newEpic = await epicApiService.createEpic(epicData);
      // Refresh the list after creating
      await fetchEpics();
      return newEpic;
    } catch (error) {
      throw error;
    }
  };

  const updateEpic = async (id: string, epicData: Partial<CreateEpicRequest>): Promise<Epic> => {
    try {
      const updatedEpic = await epicApiService.updateEpic(id, epicData);
      // Refresh the list after updating
      await fetchEpics();
      return updatedEpic;
    } catch (error) {
      throw error;
    }
  };

  const deleteEpic = async (id: string): Promise<void> => {
    try {
      await epicApiService.deleteEpic(id);
      // Refresh the list after deleting
      await fetchEpics();
    } catch (error) {
      throw error;
    }
  };

  const retry = () => {
    fetchEpics();
  };

  return {
    ...state,
    createEpic,
    updateEpic,
    deleteEpic,
    retry,
    refetch: fetchEpics,
  };
};