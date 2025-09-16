import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Base selectors
export const selectUserState = (state: RootState) => state.users;

export const selectUsers = createSelector(
  [selectUserState],
  (userState) => userState.users
);

export const selectUsersLoading = createSelector(
  [selectUserState],
  (userState) => userState.loading
);

export const selectUsersError = createSelector(
  [selectUserState],
  (userState) => userState.error
);

export const selectUsersTotal = createSelector(
  [selectUserState],
  (userState) => userState.total
);

export const selectUsersPagination = createSelector(
  [selectUserState],
  (userState) => ({
    page: userState.page,
    per_page: userState.per_page,
    total: userState.total,
    total_pages: userState.total_pages,
    has_next: userState.has_next,
    has_prev: userState.has_prev,
  })
);

export const selectUsersFilters = createSelector(
  [selectUserState],
  (userState) => userState.filters
);

// Computed selectors
export const selectFilteredUsers = createSelector(
  [selectUsers, selectUsersFilters],
  (users, filters) => {
    if (!users || !Array.isArray(users)) {
      return [];
    }
    return users.filter(user => {
      const matchesSearch = !filters.search ||
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase());

      const matchesRole = !filters.role_id || user.role_id === filters.role_id;

      const matchesStatus = filters.is_active === null || user.is_active === filters.is_active;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }
);

export const selectActiveUsers = createSelector(
  [selectUsers],
  (users) => Array.isArray(users) ? users.filter(user => user.is_active) : []
);

export const selectInactiveUsers = createSelector(
  [selectUsers],
  (users) => Array.isArray(users) ? users.filter(user => !user.is_active) : []
);

export const selectUsersByRole = createSelector(
  [selectUsers],
  (users) => {
    if (!Array.isArray(users)) {
      return {};
    }
    return users.reduce((acc, user) => {
      const role = user.role_id;
      if (!acc[role]) {
        acc[role] = [];
      }
      acc[role].push(user);
      return acc;
    }, {} as Record<string, typeof users>);
  }
);

export const selectUserById = createSelector(
  [selectUsers, (state: RootState, userId: string) => userId],
  (users, userId) => Array.isArray(users) ? users.find(user => user.id === userId) : undefined
);

export const selectUsersStats = createSelector(
  [selectUsers],
  (users) => {
    if (!Array.isArray(users)) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        roleStats: {},
      };
    }

    const total = users.length;
    const active = users.filter(user => user.is_active).length;
    const inactive = total - active;

    const roleStats = users.reduce((acc, user) => {
      const role = user.role_id;
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      active,
      inactive,
      roleStats,
    };
  }
);

export const selectPaginationInfo = createSelector(
  [selectUsersPagination],
  (pagination) => {
    return {
      currentPage: pagination.page,
      totalPages: pagination.total_pages,
      hasNextPage: pagination.has_next,
      hasPrevPage: pagination.has_prev,
      itemsPerPage: pagination.per_page,
      totalItems: pagination.total,
      startItem: ((pagination.page - 1) * pagination.per_page) + 1,
      endItem: Math.min(pagination.page * pagination.per_page, pagination.total),
    };
  }
);