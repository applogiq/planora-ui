import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userApiService, User, UsersQueryParams, UsersResponse, UserSummary } from '../../services/userApi';

export interface UserState {
  users: User[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
  loading: boolean;
  error: string | null;
  summary: UserSummary | null;
  summaryLoading: boolean;
  filters: {
    search: string;
    role_id: string;
    is_active: boolean | null;
  };
}

const initialState: UserState = {
  users: [],
  total: 0,
  page: 1,
  per_page: 10,
  total_pages: 0,
  has_next: false,
  has_prev: false,
  loading: false,
  error: null,
  summary: null,
  summaryLoading: false,
  filters: {
    search: '',
    role_id: '',
    is_active: null,
  },
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params: UsersQueryParams, { rejectWithValue }) => {
    try {
      const response = await userApiService.getUsers(params);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch users');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: Omit<User, 'id' | 'created_at' | 'updated_at' | 'last_login'>, { rejectWithValue }) => {
    try {
      const response = await userApiService.createUser(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }: { id: string; userData: Partial<User> }, { rejectWithValue }) => {
    try {
      const response = await userApiService.updateUser(id, userData);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      await userApiService.deleteUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete user');
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  'users/toggleUserStatus',
  async ({ id, is_active }: { id: string; is_active: boolean }, { rejectWithValue }) => {
    try {
      const response = await userApiService.toggleUserStatus(id, is_active);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to toggle user status');
    }
  }
);

export const fetchUserSummary = createAsyncThunk(
  'users/fetchUserSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApiService.getUserSummary();
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user summary');
    }
  }
);

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<UserState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action: PayloadAction<{ page?: number; per_page?: number }>) => {
      if (action.payload.page !== undefined) {
        state.page = action.payload.page;
      }
      if (action.payload.per_page !== undefined) {
        state.per_page = action.payload.per_page;
        // Reset calculated values when per_page changes
        state.total_pages = Math.ceil(state.total / action.payload.per_page);
        state.has_next = state.page < state.total_pages;
        state.has_prev = state.page > 1;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetUsers: (state) => {
      state.users = [];
      state.total = 0;
      state.page = 1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<UsersResponse>) => {
        state.loading = false;
        state.users = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.per_page = action.payload.per_page;
        state.total_pages = action.payload.total_pages;
        state.has_next = action.payload.has_next;
        state.has_prev = action.payload.has_prev;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users.unshift(action.payload);
        state.total += 1;
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update user
      .addCase(updateUser.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.users = state.users.filter(user => user.id !== action.payload);
        state.total -= 1;
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Toggle user status
      .addCase(toggleUserStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Fetch user summary
      .addCase(fetchUserSummary.pending, (state) => {
        state.summaryLoading = true;
      })
      .addCase(fetchUserSummary.fulfilled, (state, action: PayloadAction<UserSummary>) => {
        state.summaryLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchUserSummary.rejected, (state, action) => {
        state.summaryLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, setPagination, clearError, resetUsers } = userSlice.actions;