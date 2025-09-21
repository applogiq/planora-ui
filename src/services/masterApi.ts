import { authApiService } from './authApi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface Department {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface Industry {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DepartmentsResponse {
  items: Department[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export class MasterApiService {
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

  async getDepartments(): Promise<Department[]> {
    try {
      const response = await this.makeRequest<DepartmentsResponse>('/api/v1/masters/department');

      // Return just the items array, or empty array if response doesn't have expected structure
      if (response && Array.isArray(response.items)) {
        return response.items;
      } else if (Array.isArray(response)) {
        // Handle case where API returns array directly
        return response as unknown as Department[];
      } else {
        return [];
      }
    } catch (error) {
      // Return some default departments as fallback
      return [];
    }
  }

  async getIndustries(): Promise<Industry[]> {
    try {
      const response = await this.makeRequest<Industry[]>('/api/v1/masters/industry');

      // Handle direct array response
      if (Array.isArray(response)) {
        return response.filter(industry => industry.is_active).sort((a, b) => a.sort_order - b.sort_order);
      } else {
        return [];
      }
    } catch (error) {
      // Return empty array as fallback
      return [];
    }
  }
}

export const masterApiService = new MasterApiService();