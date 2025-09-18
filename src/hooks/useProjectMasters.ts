import { useState, useEffect } from 'react';
import { projectApiService, ProjectMastersResponse } from '../services/projectApi';

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