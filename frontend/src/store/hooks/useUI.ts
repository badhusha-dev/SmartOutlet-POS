import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../index';
import {
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
  toggleDarkMode,
  setDarkMode,
  toggleSidebar,
  setSidebarOpen,
  setGlobalLoading,
  setCurrentView,
  setSearchQuery,
  setSelectedCategory,
  clearFilters,
  setCurrentPage,
  setItemsPerPage,
  resetUI,
} from '../slices/uiSlice';

// UI State Selectors
export const useUIState = () => {
  return useAppSelector((state) => state.ui);
};

export const useNotifications = () => {
  return useAppSelector((state) => state.ui.notifications);
};

export const useModals = () => {
  return useAppSelector((state) => state.ui.modals);
};

export const useTheme = () => {
  return useAppSelector((state) => state.ui.darkMode);
};

export const useSidebar = () => {
  return useAppSelector((state) => state.ui.sidebarOpen);
};

export const useNavigation = () => {
  return useAppSelector((state) => ({
    currentView: state.ui.currentView,
    searchQuery: state.ui.searchQuery,
    selectedCategory: state.ui.selectedCategory,
    currentPage: state.ui.currentPage,
    itemsPerPage: state.ui.itemsPerPage,
  }));
};

export const useLoading = () => {
  return useAppSelector((state) => state.ui.globalLoading);
};

// UI Actions
export const useUIActions = () => {
  const dispatch = useAppDispatch();

  return {
    // Notifications
    addNotification: useCallback(
      (notification: { message: string; severity: 'success' | 'error' | 'info' | 'warning'; duration?: number }) =>
        dispatch(addNotification(notification)),
      [dispatch]
    ),

    removeNotification: useCallback(
      (id: string) => dispatch(removeNotification(id)),
      [dispatch]
    ),

    clearNotifications: useCallback(() => dispatch(clearNotifications()), [dispatch]),

    // Modals
    openModal: useCallback(
      (modal: 'checkoutOpen' | 'customerSelectOpen' | 'settingsOpen' | 'helpOpen') =>
        dispatch(openModal(modal)),
      [dispatch]
    ),

    closeModal: useCallback(
      (modal: 'checkoutOpen' | 'customerSelectOpen' | 'settingsOpen' | 'helpOpen') =>
        dispatch(closeModal(modal)),
      [dispatch]
    ),

    closeAllModals: useCallback(() => dispatch(closeAllModals()), [dispatch]),

    // Theme
    toggleDarkMode: useCallback(() => dispatch(toggleDarkMode()), [dispatch]),

    setDarkMode: useCallback(
      (darkMode: boolean) => dispatch(setDarkMode(darkMode)),
      [dispatch]
    ),

    // Sidebar
    toggleSidebar: useCallback(() => dispatch(toggleSidebar()), [dispatch]),

    setSidebarOpen: useCallback(
      (open: boolean) => dispatch(setSidebarOpen(open)),
      [dispatch]
    ),

    // Loading
    setGlobalLoading: useCallback(
      (loading: boolean) => dispatch(setGlobalLoading(loading)),
      [dispatch]
    ),

    // Navigation
    setCurrentView: useCallback(
      (view: 'dashboard' | 'order-entry' | 'history' | 'customers' | 'settings') =>
        dispatch(setCurrentView(view)),
      [dispatch]
    ),

    // Search and filters
    setSearchQuery: useCallback(
      (query: string) => dispatch(setSearchQuery(query)),
      [dispatch]
    ),

    setSelectedCategory: useCallback(
      (category: string) => dispatch(setSelectedCategory(category)),
      [dispatch]
    ),

    clearFilters: useCallback(() => dispatch(clearFilters()), [dispatch]),

    // Pagination
    setCurrentPage: useCallback(
      (page: number) => dispatch(setCurrentPage(page)),
      [dispatch]
    ),

    setItemsPerPage: useCallback(
      (itemsPerPage: number) => dispatch(setItemsPerPage(itemsPerPage)),
      [dispatch]
    ),

    // Reset
    resetUI: useCallback(() => dispatch(resetUI()), [dispatch]),
  };
};

// Combined hook for UI operations
export const useUI = () => {
  const state = useUIState();
  const actions = useUIActions();

  return {
    ...state,
    ...actions,
  };
};

// Specialized hooks for specific use cases
export const useNotificationSystem = () => {
  const notifications = useNotifications();
  const { addNotification, removeNotification, clearNotifications } = useUIActions();

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };
};

export const useModalSystem = () => {
  const modals = useModals();
  const { openModal, closeModal, closeAllModals } = useUIActions();

  return {
    modals,
    openModal,
    closeModal,
    closeAllModals,
  };
};

export const useThemeSystem = () => {
  const darkMode = useTheme();
  const { toggleDarkMode, setDarkMode } = useUIActions();

  return {
    darkMode,
    toggleDarkMode,
    setDarkMode,
  };
};

export const useNavigationSystem = () => {
  const navigation = useNavigation();
  const { setCurrentView, setSearchQuery, setSelectedCategory, clearFilters } = useUIActions();

  return {
    ...navigation,
    setCurrentView,
    setSearchQuery,
    setSelectedCategory,
    clearFilters,
  };
};

export const usePagination = () => {
  const { currentPage, itemsPerPage } = useNavigation();
  const { setCurrentPage, setItemsPerPage } = useUIActions();

  return {
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
  };
};

// Utility hook for showing notifications
export const useShowNotification = () => {
  const { addNotification } = useUIActions();

  return {
    showSuccess: useCallback(
      (message: string, duration = 4000) =>
        addNotification({ message, severity: 'success', duration }),
      [addNotification]
    ),

    showError: useCallback(
      (message: string, duration = 6000) =>
        addNotification({ message, severity: 'error', duration }),
      [addNotification]
    ),

    showInfo: useCallback(
      (message: string, duration = 4000) =>
        addNotification({ message, severity: 'info', duration }),
      [addNotification]
    ),

    showWarning: useCallback(
      (message: string, duration = 5000) =>
        addNotification({ message, severity: 'warning', duration }),
      [addNotification]
    ),
  };
};