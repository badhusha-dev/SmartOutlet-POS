import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { 
  selectIsDarkMode, 
  initializeTheme, 
  setTheme 
} from '../../store/slices/themeSlice'
import { 
  selectUser, 
  selectIsAuthenticated, 
  checkAuthStatus 
} from '../../store/slices/authSlice'

export const ReduxProvider = ({ children }) => {
  const dispatch = useAppDispatch()
  const isDarkMode = useAppSelector(selectIsDarkMode)
  const user = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  // Initialize theme on app load
  useEffect(() => {
    dispatch(initializeTheme())
  }, [dispatch])

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Check auth status on app load
  useEffect(() => {
    dispatch(checkAuthStatus())
  }, [dispatch])

  // Update CSS custom properties for toast styling when theme changes
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--toast-bg',
      isDarkMode ? '#1f2937' : '#ffffff'
    )
    document.documentElement.style.setProperty(
      '--toast-color',
      isDarkMode ? '#f9fafb' : '#111827'
    )
  }, [isDarkMode])

  return <>{children}</>
} 