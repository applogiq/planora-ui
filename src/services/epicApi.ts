import { authApiService } from './authApi';
import { getApiUrl } from '../config/api';

export interface Epic {
  title: string;
  description: string;
  priority: string;
  status: string;
  project_id: string;
  assignee_id: string;
  due_date: string;
  total_story_points: number;
  completed_story_points: number;
  total_tasks: number;
  completed_tasks: number;
  labels: string[];
  business_value: string;
  id: string;
  created_at: string;
  updated_at: string;
  project_name: string;
  assignee_name: string;
  completion_percentage: number;
  project: {
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
    team_lead: {
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
      role: {
        name: string;
        description: string;
        permissions: string[];
        is_active: boolean;
        id: string;
        created_at: string;
        updated_at: string;
      };
    };
  };
  assignee: {
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
    role: {
      name: string;
      description: string;
      permissions: string[];
      is_active: boolean;
      id: string;
      created_at: string;
      updated_at: string;
    };
  };
}

export interface EpicsResponse {
  items: Epic[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface CreateEpicRequest {
  title: string;
  description: string;
  priority: string;
  status: string;
  project_id: string;
  assignee_id: string | null;
  due_date: string;
  total_story_points: number;
  completed_story_points: number;
  total_tasks: number;
  completed_tasks: number;
  labels: string[];
  business_value: string;
}

export interface UpdateEpicRequest extends Partial<CreateEpicRequest> {
  id: string;
}


export class EpicApiService {
  private baseUrl = getApiUrl('/api/v1/epics');

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = authApiService.getAccessToken();
    const fullUrl = `${this.baseUrl}${endpoint}`;

    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Epic API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  }

  async getEpics(
    page: number = 1,
    per_page: number = 50,
    project_id?: string
  ): Promise<EpicsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
    });

    if (project_id) {
      params.append('project_id', project_id);
    }

    const url = `/?${params.toString()}`;

    return this.makeRequest<EpicsResponse>(url);
  }

  async getEpic(id: string): Promise<Epic> {
    return this.makeRequest<Epic>(`/${id}`);
  }

  async createEpic(epicData: CreateEpicRequest): Promise<Epic> {
    return this.makeRequest<Epic>('/', {
      method: 'POST',
      body: JSON.stringify(epicData),
    });
  }

  async updateEpic(id: string, epicData: Partial<CreateEpicRequest>): Promise<Epic> {
    return this.makeRequest<Epic>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(epicData),
    });
  }

  async deleteEpic(id: string): Promise<void> {
    return this.makeRequest<void>(`/${id}`, {
      method: 'DELETE',
    });
  }

  async getEpicsByProject(projectId: string): Promise<EpicsResponse> {
    return this.makeRequest<EpicsResponse>(`/project/${projectId}`);
  }
}

export const epicApiService = new EpicApiService();