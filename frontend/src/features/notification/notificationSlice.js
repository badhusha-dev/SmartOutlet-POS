import { createSlice } from '@reduxjs/toolkit'

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  settings: {
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    autoDismiss: true,
    dismissTimeout: 5000, // 5 seconds
  },
}

// Notification slice
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        read: false,
        ...action.payload,
      }
      state.notifications.unshift(notification)
      state.unreadCount += 1
    },
    
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification && !notification.read) {
        notification.read = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    },
    
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true
      })
      state.unreadCount = 0
    },
    
    removeNotification: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification && !notification.read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    
    clearAllNotifications: (state) => {
      state.notifications = []
      state.unreadCount = 0
    },
    
    clearReadNotifications: (state) => {
      state.notifications = state.notifications.filter(n => !n.read)
    },
    
    updateNotificationSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload }
    },
    
    // Auto-cleanup old notifications (older than 30 days)
    cleanupOldNotifications: (state) => {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const oldNotifications = state.notifications.filter(n => 
        new Date(n.timestamp) < thirtyDaysAgo
      )
      
      const unreadOldCount = oldNotifications.filter(n => !n.read).length
      state.unreadCount = Math.max(0, state.unreadCount - unreadOldCount)
      
      state.notifications = state.notifications.filter(n => 
        new Date(n.timestamp) >= thirtyDaysAgo
      )
    },
  },
})

// Export actions
export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  clearReadNotifications,
  updateNotificationSettings,
  cleanupOldNotifications,
} = notificationSlice.actions

// Export selectors
export const selectNotifications = (state) => state.notification.notifications
export const selectUnreadCount = (state) => state.notification.unreadCount
export const selectNotificationSettings = (state) => state.notification.settings

// Helper selectors
export const selectUnreadNotifications = (state) => {
  return state.notification.notifications.filter(n => !n.read)
}

export const selectReadNotifications = (state) => {
  return state.notification.notifications.filter(n => n.read)
}

export const selectNotificationsByType = (state, type) => {
  return state.notification.notifications.filter(n => n.type === type)
}

export const selectRecentNotifications = (state, count = 10) => {
  return state.notification.notifications.slice(0, count)
}

export default notificationSlice.reducer 