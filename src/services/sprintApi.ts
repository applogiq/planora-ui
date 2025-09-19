import { authApiService } from './authApi';

export interface UserRole {
  name: string;
  description: string;
  permissions: string[];
  is_active: boolean;
  id: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  email: string;
  name: string;
  role_id: string;
  avatar: string;
  is_active: boolean;
  department: string;
  skills: string[];
  phone: string;
  timezone: string;
  id: string;
  last_login: string;
  created_at: string;
  updated_at: string;
  role: UserRole;
}

export interface SprintProject {
  name: string;
  description: string;
  status: string;
  progress: number;
  start_date: string;
  end_date: string;
  budget: number;
  spent: number;
  customer: string;
  customer_id: string;
  priority: string;
  team_lead_id: string;
  team_members: string[];
  tags: string[];
  color: string;
  methodology: string;
  project_type: string;
  id: string;
  created_at: string;
  updated_at: string;
  team_lead: User;
}

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
  created_at: string;
  updated_at: string;
  project_name: string;
  scrum_master_name: string;
  project: SprintProject;
  scrum_master: User;
}

export interface CreateSprintRequest {
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
  burndown_trend: 'On Track' | 'Behind' | 'Ahead';
}

export interface UpdateSprintRequest extends Partial<CreateSprintRequest> {}

export interface SprintsResponse {
  items: Sprint[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface SprintsQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  project_id?: string;
  scrum_master_id?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export class SprintApiService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const token = authApiService.getAccessToken();
    const tokenType = authApiService.getTokenType();

    if (!token) {
      console.warn('No access token available for API request');
      throw new Error('Authentication required. Please login again.');
    }

    const defaultHeaders = {
      'Content-Type': 'application/json',
      Authorization: `${tokenType} ${token}`
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        console.log('Authentication error, attempting to refresh token...');
        try {
          await authApiService.refreshToken();
          const newToken = authApiService.getAccessToken();
          const newTokenType = authApiService.getTokenType();

          if (!newToken) {
            throw new Error('Failed to get new token after refresh');
          }

          const retryResponse = await fetch(url, {
            ...options,
            headers: {
              ...defaultHeaders,
              Authorization: `${newTokenType} ${newToken}`,
              ...options?.headers,
            },
          });

          if (retryResponse.ok) {
            return retryResponse.json();
          }

          const retryErrorData = await retryResponse.json().catch(() => ({}));
          throw new Error(retryErrorData.detail || `API Error after retry: ${retryResponse.status} ${retryResponse.statusText}`);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
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

  async getSprints(params: SprintsQueryParams = {}): Promise<SprintsResponse> {
    const searchParams = new URLSearchParams();

    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.per_page !== undefined) searchParams.append('per_page', params.per_page.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);
    if (params.project_id) searchParams.append('project_id', params.project_id);
    if (params.scrum_master_id) searchParams.append('scrum_master_id', params.scrum_master_id);

    const queryString = searchParams.toString();
    const endpoint = `/api/v1/sprints${queryString ? `?${queryString}` : ''}`;

    const response = await this.makeRequest<SprintsResponse>(endpoint);

    if (response && Array.isArray(response.items)) {
      return response;
    } else {
      console.error('Unexpected API response format:', response);
      return {
        items: [],
        total: 0,
        page: params.page || 1,
        per_page: params.per_page || 10,
        total_pages: 0,
        has_next: false,
        has_prev: false,
      };
    }
  }

  async getSprintById(id: string): Promise<Sprint> {
    return this.makeRequest<Sprint>(`/api/v1/sprints/${id}`);
  }

  async createSprint(sprintData: CreateSprintRequest): Promise<Sprint> {
    return this.makeRequest<Sprint>('/api/v1/sprints/', {
      method: 'POST',
      body: JSON.stringify(sprintData),
    });
  }

  async updateSprint(id: string, sprintData: UpdateSprintRequest): Promise<Sprint> {
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
    const response = await this.getSprints({ project_id: projectId });
    return response.items;
  }

  async getActiveSprintsByProject(projectId: string): Promise<Sprint[]> {
    const response = await this.getSprints({ project_id: projectId, status: 'Active' });
    return response.items;
  }

  async getSprintsByStatus(status: string): Promise<Sprint[]> {
    const response = await this.getSprints({ status });
    return response.items;
  }
}

export const sprintApiService = new SprintApiService();