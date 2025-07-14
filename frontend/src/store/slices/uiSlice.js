import { createSlice } from '@reduxjs/toolkit'

// Initial state
const initialState = {
  sidebar: {
    isOpen: false,
    isCollapsed: false,
  },
  modals: {
    outletModal: {
      isOpen: false,
      mode: 'create', // 'create' or 'edit'
      data: null,
    },
    productModal: {
      isOpen: false,
      mode: 'create',
      data: null,
    },
    expenseModal: {
      isOpen: false,
      mode: 'create',
      data: null,
    },
    reportModal: {
      isOpen: false,
      data: null,
    },
    confirmModal: {
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null,
      onCancel: null,
    },
  },
  notifications: {
    isOpen: false,
    notifications: [],
  },
  loading: {
    global: false,
    outlets: false,
    products: false,
    sales: false,
    expenses: false,
  },
  breadcrumbs: [],
  activeTab: 'dashboard',
}

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen
    },
    openSidebar: (state) => {
      state.sidebar.isOpen = true
    },
    closeSidebar: (state) => {
      state.sidebar.isOpen = false
    },
    toggleSidebarCollapse: (state) => {
      state.sidebar.isCollapsed = !state.sidebar.isCollapsed
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebar.isCollapsed = action.payload
    },

    // Modal actions
    openOutletModal: (state, action) => {
      state.modals.outletModal = {
        isOpen: true,
        mode: action.payload?.mode || 'create',
        data: action.payload?.data || null,
      }
    },
    closeOutletModal: (state) => {
      state.modals.outletModal = {
        isOpen: false,
        mode: 'create',
        data: null,
      }
    },
    openProductModal: (state, action) => {
      state.modals.productModal = {
        isOpen: true,
        mode: action.payload?.mode || 'create',
        data: action.payload?.data || null,
      }
    },
    closeProductModal: (state) => {
      state.modals.productModal = {
        isOpen: false,
        mode: 'create',
        data: null,
      }
    },
    openExpenseModal: (state, action) => {
      state.modals.expenseModal = {
        isOpen: true,
        mode: action.payload?.mode || 'create',
        data: action.payload?.data || null,
      }
    },
    closeExpenseModal: (state) => {
      state.modals.expenseModal = {
        isOpen: false,
        mode: 'create',
        data: null,
      }
    },
    openReportModal: (state, action) => {
      state.modals.reportModal = {
        isOpen: true,
        data: action.payload?.data || null,
      }
    },
    closeReportModal: (state) => {
      state.modals.reportModal = {
        isOpen: false,
        data: null,
      }
    },
    openConfirmModal: (state, action) => {
      state.modals.confirmModal = {
        isOpen: true,
        title: action.payload.title,
        message: action.payload.message,
        onConfirm: action.payload.onConfirm,
        onCancel: action.payload.onCancel,
      }
    },
    closeConfirmModal: (state) => {
      state.modals.confirmModal = {
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        onCancel: null,
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        if (state.modals[key].isOpen !== undefined) {
          state.modals[key].isOpen = false
        }
      })
    },

    // Notification actions
    toggleNotifications: (state) => {
      state.notifications.isOpen = !state.notifications.isOpen
    },
    openNotifications: (state) => {
      state.notifications.isOpen = true
    },
    closeNotifications: (state) => {
      state.notifications.isOpen = false
    },
    addNotification: (state, action) => {
      state.notifications.notifications.unshift(action.payload)
    },
    removeNotification: (state, action) => {
      state.notifications.notifications = state.notifications.notifications.filter(
        notification => notification.id !== action.payload
      )
    },
    clearNotifications: (state) => {
      state.notifications.notifications = []
    },

    // Loading actions
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload
    },
    setOutletsLoading: (state, action) => {
      state.loading.outlets = action.payload
    },
    setProductsLoading: (state, action) => {
      state.loading.products = action.payload
    },
    setSalesLoading: (state, action) => {
      state.loading.sales = action.payload
    },
    setExpensesLoading: (state, action) => {
      state.loading.expenses = action.payload
    },

    // Breadcrumb actions
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload
    },
    addBreadcrumb: (state, action) => {
      state.breadcrumbs.push(action.payload)
    },
    removeBreadcrumb: (state, action) => {
      state.breadcrumbs = state.breadcrumbs.filter(
        breadcrumb => breadcrumb.id !== action.payload
      )
    },
    clearBreadcrumbs: (state) => {
      state.breadcrumbs = []
    },

    // Active tab actions
    setActiveTab: (state, action) => {
      state.activeTab = action.payload
    },

    // Reset UI state
    resetUI: (state) => {
      state.sidebar.isOpen = false
      state.modals = initialState.modals
      state.notifications.isOpen = false
      state.loading = initialState.loading
      state.breadcrumbs = []
    },
  },
})

// Export actions
export const {
  // Sidebar
  toggleSidebar,
  openSidebar,
  closeSidebar,
  toggleSidebarCollapse,
  setSidebarCollapsed,
  
  // Modals
  openOutletModal,
  closeOutletModal,
  openProductModal,
  closeProductModal,
  openExpenseModal,
  closeExpenseModal,
  openReportModal,
  closeReportModal,
  openConfirmModal,
  closeConfirmModal,
  closeAllModals,
  
  // Notifications
  toggleNotifications,
  openNotifications,
  closeNotifications,
  addNotification,
  removeNotification,
  clearNotifications,
  
  // Loading
  setGlobalLoading,
  setOutletsLoading,
  setProductsLoading,
  setSalesLoading,
  setExpensesLoading,
  
  // Breadcrumbs
  setBreadcrumbs,
  addBreadcrumb,
  removeBreadcrumb,
  clearBreadcrumbs,
  
  // Active tab
  setActiveTab,
  
  // Reset
  resetUI,
} = uiSlice.actions

// Export selectors
export const selectSidebar = (state) => state.ui.sidebar
export const selectModals = (state) => state.ui.modals
export const selectNotifications = (state) => state.ui.notifications
export const selectLoading = (state) => state.ui.loading
export const selectBreadcrumbs = (state) => state.ui.breadcrumbs
export const selectActiveTab = (state) => state.ui.activeTab

// Helper selectors
export const selectIsAnyModalOpen = (state) => {
  return Object.values(state.ui.modals).some(modal => modal.isOpen)
}

export const selectIsLoading = (state) => {
  return Object.values(state.ui.loading).some(loading => loading)
}

export default uiSlice.reducer 