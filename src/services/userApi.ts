export interface Role {
  name: string;
  description: string;
  permissions: string[];
  is_active: boolean;
  id: string;
  created_at: string;
  updated_at: string | null;
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
  last_login: string | null;
  created_at: string;
  updated_at: string | null;
  role: Role;
}

export interface UsersResponse {
  items: User[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface UsersQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  role_id?: string;
  is_active?: boolean;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role_id: string;
  avatar: string;
  avatar_file?: File;
  is_active: boolean;
  department: string;
  skills: string[];
  phone: string;
  timezone: string;
  password: string;
}

export interface RoleCount {
  role_name: string;
  count: number;
}

export interface UserSummary {
  total_users: number;
  active_users: number;
  inactive_users: number;
  total_roles: number;
  role_counts: RoleCount[];
}

import { authApiService } from './authApi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export class UserApiService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Get the access token for authorization
    const token = authApiService.getAccessToken();

    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
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
        // Token might be expired, try to refresh
        try {
          await authApiService.refreshToken();
          // Retry the request with new token
          const newToken = authApiService.getAccessToken();
          const retryResponse = await fetch(url, {
            ...options,
            headers: {
              ...defaultHeaders,
              ...(newToken && { Authorization: `Bearer ${newToken}` }),
              ...options?.headers,
            },
          });

          if (retryResponse.ok) {
            return retryResponse.json();
          }
        } catch (refreshError) {
          // Refresh failed, user needs to login again
          console.error('Token refresh failed:', refreshError);
          authApiService.clearTokens();
          authApiService.clearUserProfile();
          // Could dispatch a logout action here or redirect to login
          throw new Error('Authentication failed. Please login again.');
        }
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getUsers(params: UsersQueryParams = {}): Promise<UsersResponse> {
    const searchParams = new URLSearchParams();

    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.per_page !== undefined) searchParams.append('per_page', params.per_page.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.role_id) searchParams.append('role_id', params.role_id);
    if (params.is_active !== undefined) searchParams.append('is_active', params.is_active.toString());

    const queryString = searchParams.toString();
    const endpoint = `/api/v1/users${queryString ? `?${queryString}` : ''}`;

    const response = await this.makeRequest<UsersResponse>(endpoint);

    // Ensure the response has the expected structure
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

  async getUserById(id: string): Promise<User> {
    return this.makeRequest<User>(`/api/v1/users/${id}`);
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
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

  async getUserSummary(): Promise<UserSummary> {
    return this.makeRequest<UserSummary>('/api/v1/users/summary');
  }
}

export const userApiService = new UserApiService();