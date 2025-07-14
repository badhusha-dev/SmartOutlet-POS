import { createSlice } from '@reduxjs/toolkit'

// Initial state
const initialState = {
  isDarkMode: false,
}

// Theme slice
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode
    },
    setTheme: (state, action) => {
      state.isDarkMode = action.payload
    },
    initializeTheme: (state) => {
      const savedTheme = localStorage.getItem('theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        state.isDarkMode = true
      }
    },
  },
})

// Export actions
export const { toggleTheme, setTheme, initializeTheme } = themeSlice.actions

// Export selectors
export const selectIsDarkMode = (state) => state.theme.isDarkMode

export default themeSlice.reducer 