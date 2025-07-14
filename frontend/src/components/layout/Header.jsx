import React, { useState } from 'react'
import { Menu, Sun, Moon, LogOut, User, Settings } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectUser, logout } from '../../store/slices/authSlice'
import { selectIsDarkMode, toggleTheme } from '../../store/slices/themeSlice'
import { useNavigate } from 'react-router-dom'

const Header = ({ onMenuClick }) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const isDarkMode = useAppSelector(selectIsDarkMode)
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleToggleTheme = () => {
    dispatch(toggleTheme())
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side - Mobile menu button */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          {/* Page title could go here */}
          <h1 className="ml-4 lg:ml-0 text-lg font-semibold text-gray-900 dark:text-white">
            Welcome back, {user?.username}!
          </h1>
        </div>

        {/* Right side - Theme toggle and user menu */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <button
            onClick={handleToggleTheme}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </button>

            {/* Dropdown menu */}
            {userMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                    <p className="text-xs text-primary-600 dark:text-primary-400">
                      {user?.role}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => {
                      navigate('/profile')
                      setUserMenuOpen(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <User className="mr-3 h-4 w-4" />
                    Profile
                  </button>
                  
                  <button
                    onClick={() => {
                      // Settings functionality
                      setUserMenuOpen(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    Settings
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header