import { useState, useEffect } from 'react';
import { projectApiService, ProjectMembersResponse } from '../services/projectApi';

export interface ProjectMembersState {
  data: ProjectMembersResponse | null;
  loading: boolean;
  error: string | null;
}

export const useProjectMembers = () => {
  const [state, setState] = useState<ProjectMembersState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchProjectMembers = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const data = await projectApiService.getProjectMembers();
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch project members',
        });
      }
    };

    fetchProjectMembers();
  }, []);

  const retry = () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    projectApiService.getProjectMembers()
      .then(data => setState({ data, loading: false, error: null }))
      .catch(error => setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch project members',
      }));
  };

  return {
    ...state,
    retry,
  };
};