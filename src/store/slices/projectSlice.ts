import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  projectApiService,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectsQueryParams,
  ProjectsResponse
} from '../../services/projectApi';
import { Project } from '../../mock-data/projects';

export interface ProjectState {
  projects: Project[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
  loading: boolean;
  error: string | null;
  selectedProject: Project | null;
  selectedProjectLoading: boolean;
  filters: {
    search: string;
    status: string;
    priority: string;
    methodology: string;
    projectType: string;
    customerId: string;
    teamLead: string;
  };
}

const initialState: ProjectState = {
  projects: [],
  total: 0,
  page: 1,
  per_page: 10,
  total_pages: 0,
  has_next: false,
  has_prev: false,
  loading: false,
  error: null,
  selectedProject: null,
  selectedProjectLoading: false,
  filters: {
    search: '',
    status: '',
    priority: '',
    methodology: '',
    projectType: '',
    customerId: '',
    teamLead: '',
  },
};

// Async thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (params: ProjectsQueryParams, { rejectWithValue }) => {
    try {
      const response = await projectApiService.getProjects(params);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch projects');
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await projectApiService.getProjectById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch project');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData: CreateProjectRequest, { rejectWithValue }) => {
    try {
      const response = await projectApiService.createProject(projectData);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create project');
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, projectData }: { id: string; projectData: UpdateProjectRequest }, { rejectWithValue }) => {
    try {
      const response = await projectApiService.updateProject(id, projectData);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update project');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id: string, { rejectWithValue }) => {
    try {
      await projectApiService.deleteProject(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete project');
    }
  }
);

export const updateProjectStatus = createAsyncThunk(
  'projects/updateProjectStatus',
  async ({ id, status }: { id: string; status: 'Active' | 'On Hold' | 'Completed' | 'Planning' }, { rejectWithValue }) => {
    try {
      const response = await projectApiService.updateProjectStatus(id, status);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update project status');
    }
  }
);

export const updateProjectProgress = createAsyncThunk(
  'projects/updateProjectProgress',
  async ({ id, progress }: { id: string; progress: number }, { rejectWithValue }) => {
    try {
      const response = await projectApiService.updateProjectProgress(id, progress);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update project progress');
    }
  }
);

export const fetchActiveProjects = createAsyncThunk(
  'projects/fetchActiveProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectApiService.getActiveProjects();
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch active projects');
    }
  }
);

export const fetchCompletedProjects = createAsyncThunk(
  'projects/fetchCompletedProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectApiService.getCompletedProjects();
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch completed projects');
    }
  }
);

export const fetchOnHoldProjects = createAsyncThunk(
  'projects/fetchOnHoldProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectApiService.getOnHoldProjects();
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch on hold projects');
    }
  }
);

export const fetchPlanningProjects = createAsyncThunk(
  'projects/fetchPlanningProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectApiService.getPlanningProjects();
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch planning projects');
    }
  }
);

export const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ProjectState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action: PayloadAction<{ page?: number; per_page?: number }>) => {
      if (action.payload.page !== undefined) {
        state.page = action.payload.page;
      }
      if (action.payload.per_page !== undefined) {
        state.per_page = action.payload.per_page;
        state.total_pages = Math.ceil(state.total / action.payload.per_page);
        state.has_next = state.page < state.total_pages;
        state.has_prev = state.page > 1;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetProjects: (state) => {
      state.projects = [];
      state.total = 0;
      state.page = 1;
      state.error = null;
    },
    clearSelectedProject: (state) => {
      state.selectedProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<ProjectsResponse>) => {
        state.loading = false;
        state.projects = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.per_page = action.payload.per_page;
        state.total_pages = action.payload.total_pages;
        state.has_next = action.payload.has_next;
        state.has_prev = action.payload.has_prev;
        state.error = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.selectedProjectLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action: PayloadAction<Project>) => {
        state.selectedProjectLoading = false;
        state.selectedProject = action.payload;
        state.error = null;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.selectedProjectLoading = false;
        state.error = action.payload as string;
      })

      // Create project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.loading = false;
        state.projects.unshift(action.payload);
        state.total += 1;
        state.error = null;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update project
      .addCase(updateProject.pending, (state) => {
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action: PayloadAction<Project>) => {
        const index = state.projects.findIndex(project => project.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.selectedProject?.id === action.payload.id) {
          state.selectedProject = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action: PayloadAction<string>) => {
        state.projects = state.projects.filter(project => project.id !== action.payload);
        state.total -= 1;
        if (state.selectedProject?.id === action.payload) {
          state.selectedProject = null;
        }
        state.error = null;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Update project status
      .addCase(updateProjectStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(updateProjectStatus.fulfilled, (state, action: PayloadAction<Project>) => {
        const index = state.projects.findIndex(project => project.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.selectedProject?.id === action.payload.id) {
          state.selectedProject = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProjectStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Update project progress
      .addCase(updateProjectProgress.pending, (state) => {
        state.error = null;
      })
      .addCase(updateProjectProgress.fulfilled, (state, action: PayloadAction<Project>) => {
        const index = state.projects.findIndex(project => project.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.selectedProject?.id === action.payload.id) {
          state.selectedProject = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProjectProgress.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilters,
  setPagination,
  clearError,
  resetProjects,
  clearSelectedProject
} = projectSlice.actions;