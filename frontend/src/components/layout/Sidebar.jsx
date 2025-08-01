import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Receipt, 
  User,
  X,
  Settings
} from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '../../contexts/AuthContext';

import { useUserRole } from '../../hooks/useUserRole'

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole()
  const location = useLocation()

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: LayoutDashboard,
      roles: ['ADMIN', 'STAFF'] 
    },
    { 
      name: 'Outlets', 
      href: '/outlets', 
      icon: Store,
      roles: ['ADMIN'] 
    },
    { 
      name: 'Products', 
      href: '/products', 
      icon: Package,
      roles: ['ADMIN', 'STAFF'] 
    },
    {
      name: 'Categories',
      href: '/categories',
      icon: Package,
      roles: ['ADMIN', 'STAFF']
    },
    { 
      name: 'POS Sales', 
      href: '/pos', 
      icon: ShoppingCart,
      roles: ['ADMIN', 'STAFF'] 
    },
    { 
      name: 'Sales Report', 
      href: '/sales', 
      icon: TrendingUp,
      roles: ['ADMIN', 'STAFF'] 
    },
    { 
      name: 'Expenses', 
      href: '/expenses', 
      icon: Receipt,
      roles: ['ADMIN'] 
    },
    {
      name: 'Expense Management',
      href: '/expenses-management',
      icon: Receipt,
      roles: ['ADMIN']
    },
    {
      name: 'Reporting Dashboard',
      href: '/reporting-dashboard',
      icon: TrendingUp,
      roles: ['ADMIN', 'STAFF']
    },
    {
      name: 'Error Logs',
      href: '/error-logs',
      icon: Settings,
      roles: ['ADMIN']
    },
  ]

  const hasAccess = (roles) => {
    return roles.includes(user?.role)
  }

  return (
    <>
      {/* Sidebar */}
      <div className={clsx(
        'fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                SmartOutlet
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">POS System</p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation
              .filter(item => hasAccess(item.roles))
              .map((item) => {
                const isActive = location.pathname === item.href
                const Icon = item.icon

                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={clsx(
                      'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    )}
                  >
                    <Icon 
                      className={clsx(
                        'mr-3 h-5 w-5 flex-shrink-0',
                        isActive 
                          ? 'text-primary-600 dark:text-primary-400' 
                          : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                      )} 
                    />
                    {item.name}
                  </NavLink>
                )
              })}
          </div>
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <NavLink
            to="/profile"
            onClick={onClose}
            className={clsx(
              'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors w-full',
              location.pathname === '/profile'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            )}
          >
            <User className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.username || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.role || 'Role'}
              </p>
            </div>
          </NavLink>
        </div>
      </div>
    </>
  )
}

export default Sidebar