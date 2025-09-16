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
}

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export interface UsersQueryParams {
  skip?: number;
  limit?: number;
  search?: string;
  role_id?: string;
  is_active?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export class UserApiService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getUsers(params: UsersQueryParams = {}): Promise<UsersResponse> {
    const searchParams = new URLSearchParams();

    if (params.skip !== undefined) searchParams.append('skip', params.skip.toString());
    if (params.limit !== undefined) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.role_id) searchParams.append('role_id', params.role_id);
    if (params.is_active !== undefined) searchParams.append('is_active', params.is_active.toString());

    const queryString = searchParams.toString();
    const endpoint = `/api/v1/users/${queryString ? `?${queryString}` : ''}`;

    const users = await this.makeRequest<User[]>(endpoint);

    // Since the API returns an array, we need to calculate pagination info
    // In a real implementation, the API should return pagination metadata
    return {
      users,
      total: users.length, // This should come from the API response
      skip: params.skip || 0,
      limit: params.limit || 10,
    };
  }

  async getUserById(id: string): Promise<User> {
    return this.makeRequest<User>(`/api/v1/users/${id}`);
  }

  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at' | 'last_login'>): Promise<User> {
    return this.makeRequest<User>('/api/v1/users/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    return this.makeRequest<User>(`/api/v1/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<void> {
    return this.makeRequest<void>(`/api/v1/users/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleUserStatus(id: string, is_active: boolean): Promise<User> {
    return this.makeRequest<User>(`/api/v1/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active }),
    });
  }
}

export const userApiService = new UserApiService();