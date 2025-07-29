import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  timestamp: number;
}

interface ModalState {
  checkoutOpen: boolean;
  customerSelectOpen: boolean;
  settingsOpen: boolean;
  helpOpen: boolean;
}

interface UIState {
  // Notifications
  notifications: Notification[];
  
  // Modals
  modals: ModalState;
  
  // Theme
  darkMode: boolean;
  
  // Sidebar
  sidebarOpen: boolean;
  
  // Loading states
  globalLoading: boolean;
  
  // Current view
  currentView: 'dashboard' | 'order-entry' | 'history' | 'customers' | 'settings';
  
  // Search and filters
  searchQuery: string;
  selectedCategory: string;
  
  // Pagination
  currentPage: number;
  itemsPerPage: number;
}

const initialState: UIState = {
  // Notifications
  notifications: [],
  
  // Modals
  modals: {
    checkoutOpen: false,
    customerSelectOpen: false,
    settingsOpen: false,
    helpOpen: false,
  },
  
  // Theme
  darkMode: false,
  
  // Sidebar
  sidebarOpen: true,
  
  // Loading states
  globalLoading: false,
  
  // Current view
  currentView: 'dashboard',
  
  // Search and filters
  searchQuery: '',
  selectedCategory: 'all',
  
  // Pagination
  currentPage: 1,
  itemsPerPage: 20,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Notifications
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: `notification-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },

    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Modals
    openModal: (state, action: PayloadAction<keyof ModalState>) => {
      state.modals[action.payload] = true;
    },

    closeModal: (state, action: PayloadAction<keyof ModalState>) => {
      state.modals[action.payload] = false;
    },

    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key as keyof ModalState] = false;
      });
    },

    // Theme
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },

    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },

    // Sidebar
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },

    // Loading
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },

    // Navigation
    setCurrentView: (state, action: PayloadAction<UIState['currentView']>) => {
      state.currentView = action.payload;
    },

    // Search and filters
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },

    clearFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = 'all';
    },

    // Pagination
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },

    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1; // Reset to first page when changing items per page
    },

    // Reset UI state
    resetUI: (state) => {
      state.notifications = [];
      state.modals = initialState.modals;
      state.searchQuery = '';
      state.selectedCategory = 'all';
      state.currentPage = 1;
    },
  },
});

export const {
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
} = uiSlice.actions;

export default uiSlice.reducer;