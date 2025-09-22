import { authApiService } from './authApi';

export interface Story {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee_id: string | null;
  project_id: string;
  epic_id?: string | null;
  start_date?: string;
  due_date?: string;
  progress: number;
  tags: string[];
  story_points?: number;
  acceptance_criteria?: string;
  attachments?: StoryAttachment[];
  comments?: StoryComment[];
  created_at: string;
  updated_at: string;
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  image_url?: string;
}

export interface StoryAttachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  type: string;
  uploaded_at: string;
}

export interface StoryComment {
  id: string;
  user_id: string;
  user_name: string;
  text: string;
  created_at: string;
}

export interface CreateStoryRequest {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee_id: string | null;
  project_id: string;
  epic_id?: string | null;
  start_date?: string;
  due_date?: string;
  progress?: number;
  tags?: string[];
  story_points?: number;
  acceptance_criteria?: string;
}

export interface UpdateStoryRequest extends Partial<CreateStoryRequest> {
  id: string;
}

export interface StoriesResponse {
  items: Story[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export class StoriesApiService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

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

  async getStories(projectId?: string, page: number = 1, perPage: number = 50): Promise<StoriesResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    if (projectId) {
      params.append('project_id', projectId);
    }

    const queryString = params.toString();
    const endpoint = `/api/v1/stories${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<StoriesResponse>(endpoint);
  }

  async getStory(id: string): Promise<Story> {
    return this.makeRequest<Story>(`/api/v1/stories/${id}`);
  }

  async createStory(storyData: CreateStoryRequest, imageFile?: File): Promise<Story> {
    if (imageFile) {
      const formData = new FormData();

      // Add story fields
      formData.append('title', storyData.title);
      formData.append('description', storyData.description);
      formData.append('status', storyData.status);
      formData.append('priority', storyData.priority);
      formData.append('project_id', storyData.project_id);

      if (storyData.assignee_id) formData.append('assignee_id', storyData.assignee_id);
      if (storyData.epic_id) formData.append('epic_id', storyData.epic_id);
      if (storyData.start_date) formData.append('start_date', storyData.start_date);
      if (storyData.due_date) formData.append('due_date', storyData.due_date);
      if (storyData.progress !== undefined) formData.append('progress', storyData.progress.toString());
      if (storyData.story_points !== undefined) formData.append('story_points', storyData.story_points.toString());
      if (storyData.acceptance_criteria) formData.append('acceptance_criteria', storyData.acceptance_criteria);

      if (storyData.tags && storyData.tags.length > 0) {
        formData.append('tags', JSON.stringify(storyData.tags));
      }

      // Add image file
      formData.append('image', imageFile);

      return this.makeRequest<Story>('/api/v1/stories/', {
        method: 'POST',
        body: formData,
      });
    } else {
      return this.makeRequest<Story>('/api/v1/stories/', {
        method: 'POST',
        body: JSON.stringify(storyData),
      });
    }
  }

  async updateStory(id: string, storyData: Partial<CreateStoryRequest>, imageFile?: File): Promise<Story> {
    if (imageFile) {
      const formData = new FormData();

      // Add story fields that are being updated
      Object.entries(storyData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'tags' && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // Add image file
      formData.append('image', imageFile);

      return this.makeRequest<Story>(`/api/v1/stories/${id}`, {
        method: 'PUT',
        body: formData,
      });
    } else {
      return this.makeRequest<Story>(`/api/v1/stories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(storyData),
      });
    }
  }

  async deleteStory(id: string): Promise<void> {
    return this.makeRequest<void>(`/api/v1/stories/${id}`, {
      method: 'DELETE',
    });
  }

  async updateStoryStatus(id: string, status: string): Promise<Story> {
    return this.makeRequest<Story>(`/api/v1/stories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateStoryProgress(id: string, progress: number): Promise<Story> {
    return this.makeRequest<Story>(`/api/v1/stories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ progress }),
    });
  }
}

export const storiesApiService = new StoriesApiService();