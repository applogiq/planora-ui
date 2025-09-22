export interface Customer {
  id: string;
  name: string;
  industry: string;
  contact: {
    name: string;
    email: string;
    phone: string;
    title: string;
  };
  website: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  status: string;
  join_date: string;
  last_activity: string;
  total_revenue: number;
  project_ids: string[];
  priority: string;
  notes: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerListResponse {
  customers: Customer[];
  total: number;
  page: number;
  size: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface CustomerListParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  industry?: string;
  priority?: string;
}

export interface CreateCustomerRequest {
  name: string;
  industry: string;
  contact: {
    name: string;
    email: string;
    phone: string;
    title: string;
  };
  website: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  status: string;
  total_revenue: number;
  project_ids: string[];
  priority: string;
  notes: string;
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {}

import { authApiService } from './authApi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export class CustomerApiService {
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

  async createCustomer(customerData: CreateCustomerRequest): Promise<Customer> {
    return this.makeRequest<Customer>('/api/v1/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  }

  async updateCustomer(id: string, customerData: UpdateCustomerRequest): Promise<Customer> {
    return this.makeRequest<Customer>(`/api/v1/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  }

  async getCustomerById(id: string): Promise<Customer> {
    return this.makeRequest<Customer>(`/api/v1/customers/${id}`);
  }

  async deleteCustomer(id: string): Promise<void> {
    return this.makeRequest<void>(`/api/v1/customers/${id}`, {
      method: 'DELETE',
    });
  }

  async getCustomers(params?: CustomerListParams): Promise<CustomerListResponse> {
    const searchParams = new URLSearchParams();

    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status && params.status !== 'All') searchParams.append('status', params.status);
    if (params?.industry && params.industry !== 'All') searchParams.append('industry', params.industry);
    if (params?.priority && params.priority !== 'All') searchParams.append('priority', params.priority);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/api/v1/customers/?${queryString}` : '/api/v1/customers/';

    return this.makeRequest<CustomerListResponse>(endpoint);
  }

  // Legacy method for backward compatibility
  async getAllCustomers(): Promise<Customer[]> {
    const response = await this.getCustomers({ size: 1000 }); // Get a large number to simulate "all"
    return response.customers;
  }
}

export const customerApiService = new CustomerApiService();