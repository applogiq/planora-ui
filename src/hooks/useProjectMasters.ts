import { useState, useEffect } from 'react';
import { projectApiService, ProjectMastersResponse } from '../services/projectApi';
import { authApiService } from '../services/authApi';

export interface ProjectMastersState {
  data: ProjectMastersResponse | null;
  loading: boolean;
  error: string | null;
}

export const useProjectMasters = () => {
  const [state, setState] = useState<ProjectMastersState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchProjectMasters = async () => {
      try {
        // Check if user is authenticated before making API call
        if (!authApiService.isAuthenticated()) {
          setState({
            data: null,
            loading: false,
            error: null, // Don't show error if not authenticated, just don't load
          });
          return;
        }

        setState(prev => ({ ...prev, loading: true, error: null }));
        const data = await projectApiService.getProjectMasters();
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch project masters',
        });
      }
    };

    fetchProjectMasters();
  }, []);

  const retry = () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    projectApiService.getProjectMasters()
      .then(data => setState({ data, loading: false, error: null }))
      .catch(error => setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch project masters',
      }));
  };

  return {
    ...state,
    retry,
  };
};