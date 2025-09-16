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
    skip: userState.skip,
    limit: userState.limit,
    total: userState.total,
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
  (users) => users.filter(user => user.is_active)
);

export const selectInactiveUsers = createSelector(
  [selectUsers],
  (users) => users.filter(user => !user.is_active)
);

export const selectUsersByRole = createSelector(
  [selectUsers],
  (users) => {
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
  (users, userId) => users.find(user => user.id === userId)
);

export const selectUsersStats = createSelector(
  [selectUsers],
  (users) => {
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
    const currentPage = Math.floor(pagination.skip / pagination.limit) + 1;
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    const hasNextPage = pagination.skip + pagination.limit < pagination.total;
    const hasPrevPage = pagination.skip > 0;

    return {
      currentPage,
      totalPages,
      hasNextPage,
      hasPrevPage,
      itemsPerPage: pagination.limit,
      totalItems: pagination.total,
      startItem: pagination.skip + 1,
      endItem: Math.min(pagination.skip + pagination.limit, pagination.total),
    };
  }
);