import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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
  sidebarOpen: boolean
  darkMode: boolean
  notifications: Notification[];
  modals: ModalState;
  globalLoading: boolean;
  currentView: 'dashboard' | 'order-entry' | 'history' | 'customers' | 'settings';
  searchQuery: string;
  selectedCategory: string;
  currentPage: number;
  itemsPerPage: number;
}

const initialState: UIState = {
  sidebarOpen: true,
  darkMode: false,
  notifications: [],
  modals: {
    checkoutOpen: false,
    customerSelectOpen: false,
    settingsOpen: false,
    helpOpen: false,
  },
  globalLoading: false,
  currentView: 'dashboard',
  searchQuery: '',
  selectedCategory: 'all',
  currentPage: 1,
  itemsPerPage: 20,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: `notification-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
      }
      state.notifications.push(notification)
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(notification => notification.id !== action.payload)
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
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
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },

    setCurrentView: (state, action: PayloadAction<UIState['currentView']>) => {
      state.currentView = action.payload;
    },

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

    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },

    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1; // Reset to first page when changing items per page
    },

    resetUI: (state) => {
      state.notifications = [];
      state.modals = initialState.modals;
      state.searchQuery = '';
      state.selectedCategory = 'all';
      state.currentPage = 1;
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleDarkMode,
  setDarkMode,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
  setGlobalLoading,
  setCurrentView,
  setSearchQuery,
  setSelectedCategory,
  clearFilters,
  setCurrentPage,
  setItemsPerPage,
  resetUI,
} = uiSlice.actions

export default uiSlice.reducer