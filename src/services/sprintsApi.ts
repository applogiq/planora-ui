import { authApiService } from './authApi';
import { getApiUrl } from '../config/api';

export interface Sprint {
  id: string;
  name: string;
  status: string;
  start_date: string;
  end_date: string;
  goal: string;
  total_points: number;
  completed_points: number;
  total_tasks: number;
  completed_tasks: number;
  velocity: number;
  project_id: string;
  scrum_master_id: string;
  team_size: number;
  burndown_trend: string;
}

export interface CreateSprintRequest {
  name: string;
  status: string;
  start_date: string;
  end_date: string;
  goal: string;
  project_id: string;
  scrum_master_id?: string;
  burndown_trend?: string;
}

export interface UpdateSprintRequest extends Partial<CreateSprintRequest> {
  id: string;
}

export interface SprintsResponse {
  items: Sprint[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export class SprintsApiService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = getApiUrl(endpoint);

    const token = authApiService.getAccessToken();

    const defaultHeaders: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` })
    };

    // Don't set Content-Type for FormData - browser will set it automatically
    if (!(options?.body instanceof FormData)) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        try {
          await authApiService.refreshToken();
          const newToken = authApiService.getAccessToken();

          const retryHeaders: HeadersInit = {
            ...(newToken && { Authorization: `Bearer ${newToken}` })
          };

          if (!(options?.body instanceof FormData)) {
            retryHeaders['Content-Type'] = 'application/json';
          }

          const retryResponse = await fetch(url, {
            ...options,
            headers: {
              ...retryHeaders,
              ...options?.headers,
            },
          });

          if (retryResponse.ok) {
            return retryResponse.json();
          }
        } catch (refreshError) {
          authApiService.clearTokens();
          authApiService.clearUserProfile();
          throw new Error('Authentication failed. Please login again.');
        }
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getSprints(projectId?: string, page: number = 1, perPage: number = 50): Promise<SprintsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    if (projectId) {
      params.append('project_id', projectId);
    }

    const queryString = params.toString();
    const endpoint = `/api/v1/sprints${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<SprintsResponse>(endpoint);
  }

  async getSprint(id: string): Promise<Sprint> {
    return this.makeRequest<Sprint>(`/api/v1/sprints/${id}`);
  }

  async createSprint(sprintData: CreateSprintRequest): Promise<Sprint> {
    return this.makeRequest<Sprint>('/api/v1/sprints/', {
      method: 'POST',
      body: JSON.stringify(sprintData),
    });
  }

  async updateSprint(id: string, sprintData: Partial<CreateSprintRequest>): Promise<Sprint> {
    return this.makeRequest<Sprint>(`/api/v1/sprints/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sprintData),
    });
  }

  async deleteSprint(id: string): Promise<void> {
    return this.makeRequest<void>(`/api/v1/sprints/${id}`, {
      method: 'DELETE',
    });
  }

  async updateSprintStatus(id: string, status: string): Promise<Sprint> {
    return this.makeRequest<Sprint>(`/api/v1/sprints/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getSprintsByProject(projectId: string): Promise<Sprint[]> {
    const response = await this.getSprints(projectId);
    return response.items;
  }
}

export const sprintsApiService = new SprintsApiService();