import { useState, useEffect } from 'react';
import { projectApiService, ProjectOwnersResponse } from '../services/projectApi';

export interface ProjectOwnersState {
  data: ProjectOwnersResponse | null;
  loading: boolean;
  error: string | null;
}

export const useProjectOwners = () => {
  const [state, setState] = useState<ProjectOwnersState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchProjectOwners = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const data = await projectApiService.getProjectOwners();
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch project owners',
        });
      }
    };

    fetchProjectOwners();
  }, []);

  const retry = () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    projectApiService.getProjectOwners()
      .then(data => setState({ data, loading: false, error: null }))
      .catch(error => setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch project owners',
      }));
  };

  return {
    ...state,
    retry,
  };
};