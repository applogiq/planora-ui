import { authApiService } from './authApi';
import { Project } from '../mock-data/projects';

export interface ProjectMasterItem {
  name: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  id: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectStatusItem extends ProjectMasterItem {
  color: string;
}

export interface ProjectPriorityItem extends ProjectMasterItem {
  color: string;
  level: number;
}

export interface ProjectMastersResponse {
  methodologies: ProjectMasterItem[];
  types: ProjectMasterItem[];
  statuses: ProjectStatusItem[];
  priorities: ProjectPriorityItem[];
}

export interface ProjectOwner {
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
  last_login: string | null;
  created_at: string;
  updated_at: string | null;
  role: {
    name: string;
    description: string;
    permissions: string[];
    is_active: boolean;
    id: string;
    created_at: string;
    updated_at: string | null;
  };
}

export interface ProjectOwnersResponse {
  items: ProjectOwner[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// Alias for project members since they have the same structure
export type ProjectMember = ProjectOwner;
export type ProjectMembersResponse = ProjectOwnersResponse;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface CreateProjectRequest {
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  budget: number;
  customer_id: string;
  customer: string;
  priority: string;
  team_lead_id: string;
  team_members: string[]; // Array of member IDs
  tags: string[];
  methodology: string;
  project_type: string;
  color?: string;
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {
  spent?: number;
  progress?: number;
  color?: string;
}

export interface ProjectsResponse {
  items: Project[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ProjectsQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  priority?: string;
  methodology?: string;
  projectType?: string;
  customerId?: string;
  teamLead?: string;
}

export class ProjectApiService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Get the access token for authorization
    const token = authApiService.getAccessToken();
    const tokenType = authApiService.getTokenType();

    if (!token) {
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
      // Handle unauthorized/forbidden errors
      if (response.status === 401 || response.status === 403) {
        try {
          await authApiService.refreshToken();
          // Retry the request with new token
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

          // If retry also fails, throw error
          const retryErrorData = await retryResponse.json().catch(() => ({}));
          throw new Error(retryErrorData.detail || `API Error after retry: ${retryResponse.status} ${retryResponse.statusText}`);
        } catch (refreshError) {
          // Refresh failed, user needs to login again
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

  async getProjects(params: ProjectsQueryParams = {}): Promise<ProjectsResponse> {
    const searchParams = new URLSearchParams();

    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.per_page !== undefined) searchParams.append('per_page', params.per_page.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);
    if (params.priority) searchParams.append('priority', params.priority);
    if (params.methodology) searchParams.append('methodology', params.methodology);
    if (params.projectType) searchParams.append('project_type', params.projectType);
    if (params.customerId) searchParams.append('customer_id', params.customerId);
    if (params.teamLead) searchParams.append('team_lead', params.teamLead);

    const queryString = searchParams.toString();
    const endpoint = `/api/v1/projects${queryString ? `?${queryString}` : ''}`;

    const response = await this.makeRequest<ProjectsResponse>(endpoint);

    if (response && Array.isArray(response.items)) {
      return response;
    } else {
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

  async getProjectById(id: string): Promise<Project> {
    return this.makeRequest<Project>(`/api/v1/projects/${id}`);
  }

  async createProject(projectData: CreateProjectRequest): Promise<Project> {
    return this.makeRequest<Project>('/api/v1/projects/', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id: string, projectData: UpdateProjectRequest): Promise<Project> {
    return this.makeRequest<Project>(`/api/v1/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(id: string): Promise<void> {
    return this.makeRequest<void>(`/api/v1/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async updateProjectStatus(id: string, status: string): Promise<Project> {
    return this.makeRequest<Project>(`/api/v1/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateProjectProgress(id: string, progress: number): Promise<Project> {
    return this.makeRequest<Project>(`/api/v1/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ progress }),
    });
  }

  async getProjectsByStatus(status: string): Promise<Project[]> {
    const response = await this.getProjects({ status });
    return response.items;
  }

  async getActiveProjects(): Promise<Project[]> {
    return this.getProjectsByStatus('Active');
  }

  async getCompletedProjects(): Promise<Project[]> {
    return this.getProjectsByStatus('Completed');
  }

  async getOnHoldProjects(): Promise<Project[]> {
    return this.getProjectsByStatus('On Hold');
  }

  async getPlanningProjects(): Promise<Project[]> {
    return this.getProjectsByStatus('Planning');
  }

  async getActiveProjectsList(): Promise<Project[]> {
    return this.makeRequest<Project[]>('/api/v1/projects/active/list');
  }

  async getProjectMasters(): Promise<ProjectMastersResponse> {
    return this.makeRequest<ProjectMastersResponse>('/api/v1/masters/project');
  }

  async getProjectOwners(): Promise<ProjectOwnersResponse> {
    return this.makeRequest<ProjectOwnersResponse>('/api/v1/users/project-owner/');
  }

  async getProjectMembers(): Promise<ProjectMembersResponse> {
    return this.makeRequest<ProjectMembersResponse>('/api/v1/users/team-members');
  }
}

export const projectApiService = new ProjectApiService();