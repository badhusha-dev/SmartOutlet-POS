import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../index';
import {
  login,
  logout,
  fetchCurrentUser,
  refreshToken,
  setUser,
  setToken,
  clearAuth,
  setError,
  clearError,
  updateUser,
} from '../slices/authSlice';

// Auth State Selectors
export const useAuthState = () => {
  return useAppSelector((state) => state.auth);
};

export const useUser = () => {
  return useAppSelector((state) => state.auth.user);
};

export const useIsAuthenticated = () => {
  return useAppSelector((state) => state.auth.isAuthenticated);
};

export const useAuthToken = () => {
  return useAppSelector((state) => state.auth.token);
};

export const useAuthLoading = () => {
  return useAppSelector((state) => state.auth.loading);
};

export const useAuthError = () => {
  return useAppSelector((state) => state.auth.error);
};

export const useUserRole = () => {
  return useAppSelector((state) => state.auth.user?.role);
};

export const useUserPermissions = () => {
  return useAppSelector((state) => state.auth.user?.permissions || []);
};

export const useOutletId = () => {
  return useAppSelector((state) => state.auth.user?.outletId);
};

// Auth Actions
export const useAuthActions = () => {
  const dispatch = useAppDispatch();

  return {
    // Authentication
    login: useCallback(
      (credentials: { email: string; password: string }) => dispatch(login(credentials)),
      [dispatch]
    ),

    logout: useCallback(() => dispatch(logout()), [dispatch]),

    fetchCurrentUser: useCallback(() => dispatch(fetchCurrentUser()), [dispatch]),

    refreshToken: useCallback(() => dispatch(refreshToken()), [dispatch]),

    // Manual state management
    setUser: useCallback(
      (user: any) => dispatch(setUser(user)),
      [dispatch]
    ),

    setToken: useCallback(
      (token: string) => dispatch(setToken(token)),
      [dispatch]
    ),

    clearAuth: useCallback(() => dispatch(clearAuth()), [dispatch]),

    updateUser: useCallback(
      (userData: Partial<any>) => dispatch(updateUser(userData)),
      [dispatch]
    ),

    // Error handling
    setError: useCallback(
      (error: string | null) => dispatch(setError(error)),
      [dispatch]
    ),

    clearError: useCallback(() => dispatch(clearError()), [dispatch]),
  };
};

// Combined hook for auth operations
export const useAuth = () => {
  const state = useAuthState();
  const actions = useAuthActions();

  return {
    ...state,
    ...actions,
  };
};

// Permission checking hook
export const usePermissions = () => {
  const permissions = useUserPermissions();
  const userRole = useUserRole();

  return {
    permissions,
    userRole,
    hasPermission: useCallback(
      (permission: string) => permissions.includes(permission),
      [permissions]
    ),
    hasAnyPermission: useCallback(
      (requiredPermissions: string[]) => requiredPermissions.some(p => permissions.includes(p)),
      [permissions]
    ),
    hasAllPermissions: useCallback(
      (requiredPermissions: string[]) => requiredPermissions.every(p => permissions.includes(p)),
      [permissions]
    ),
    isAdmin: userRole === 'admin',
    isManager: userRole === 'manager',
    isCashier: userRole === 'cashier',
    isKitchen: userRole === 'kitchen',
  };
};

// Authentication status hook
export const useAuthStatus = () => {
  const isAuthenticated = useIsAuthenticated();
  const loading = useAuthLoading();
  const error = useAuthError();
  const user = useUser();

  return {
    isAuthenticated,
    loading,
    error,
    user,
    isLoggedIn: isAuthenticated && !!user,
    isLoggingIn: loading && !isAuthenticated,
    isLoggingOut: loading && isAuthenticated,
  };
};

// Auto-login hook
export const useAutoLogin = () => {
  const { fetchCurrentUser, login } = useAuthActions();
  const { isAuthenticated, loading, token } = useAuthState();

  const attemptAutoLogin = useCallback(async () => {
    if (token && !isAuthenticated && !loading) {
      try {
        await fetchCurrentUser();
      } catch (error) {
        // Token is invalid, clear it
        console.log('Auto-login failed, clearing token');
      }
    }
  }, [token, isAuthenticated, loading, fetchCurrentUser]);

  return {
    attemptAutoLogin,
    shouldAttemptAutoLogin: !!token && !isAuthenticated && !loading,
  };
};

// Protected route hook
export const useProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuthState();
  const { fetchCurrentUser } = useAuthActions();

  const checkAuth = useCallback(async () => {
    if (!isAuthenticated && !loading) {
      await fetchCurrentUser();
    }
  }, [isAuthenticated, loading, fetchCurrentUser]);

  return {
    isAuthenticated,
    loading,
    checkAuth,
    requiresAuth: !isAuthenticated && !loading,
  };
};