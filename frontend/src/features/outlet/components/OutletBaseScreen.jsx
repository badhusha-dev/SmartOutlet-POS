import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Store,
  Users,
  Bell,
  CheckSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Download,
  Upload,
  Settings,
  ChevronDown,
  Shield,
  User,
  LogOut
} from 'lucide-react'
import { useUserRole } from '../../../hooks/useUserRole'
import { useAppSelector, useAppDispatch } from '../../../store/hooks'
import { selectUser } from '../../../store/slices/authSlice'
import OutletManagerView from './OutletManagerView'
import OutletStaffView from './OutletStaffView'
import OutletViewerView from './OutletViewerView'
import OutletList from '../views/OutletList'
import AddOutletModal from './AddOutletModal'

const OutletBaseScreen = () => {
  const { user, isDevMode, logout } = useAppSelector(selectUser)
  const {
    userRole,
    assignedOutlet,
    loading,
    isAdmin,
    isOutletManager,
    isOutletStaff,
    isViewer,
    canManageOutlets
  } = useUserRole()

  const [showRoleSelector, setShowRoleSelector] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // Mock role options for development
  const mockRoles = [
    { id: 'dev-admin', name: 'Admin', description: 'Full system access', icon: Shield },
    { id: 'dev-manager', name: 'Outlet Manager', description: 'Manage assigned outlet', icon: User },
    { id: 'dev-staff', name: 'Outlet Staff', description: 'Staff access to outlet', icon: Users },
    { id: 'dev-viewer', name: 'Viewer', description: 'Read-only access', icon: Eye }
  ]

  useEffect(() => {
    if (isDevMode && !selectedRole) {
      setSelectedRole('dev-admin')
    }
  }, [isDevMode, selectedRole])

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId)
    setShowRoleSelector(false)
    
    // In a real app, this would update the user's role in the context
    // For now, we'll just update the local state
    console.log('Role changed to:', roleId)
  }

  const renderRoleBasedView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-600"></div>
        </div>
      )
    }

    // Development mode: Use selected role
    if (isDevMode) {
      switch (selectedRole) {
        case 'dev-admin':
          return <OutletList />
        case 'dev-manager':
          return <OutletManagerView assignedOutlet={assignedOutlet} />
        case 'dev-staff':
          return <OutletStaffView assignedOutlet={assignedOutlet} />
        case 'dev-viewer':
          return <OutletViewerView assignedOutlet={assignedOutlet} />
        default:
          return <OutletList />
      }
    }

    // Production mode: Use actual role from JWT
    if (isAdmin()) {
      return <OutletList />
    } else if (isOutletManager()) {
      return <OutletManagerView assignedOutlet={assignedOutlet} />
    } else if (isOutletStaff()) {
      return <OutletStaffView assignedOutlet={assignedOutlet} />
    } else if (isViewer()) {
      return <OutletViewerView assignedOutlet={assignedOutlet} />
    } else {
      return (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Access Denied
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            You don't have permission to access outlet management.
          </p>
        </div>
      )
    }
  }

  const getCurrentRoleInfo = () => {
    if (isDevMode) {
      const role = mockRoles.find(r => r.id === selectedRole)
      return role || mockRoles[0]
    }

    // Production mode
    if (isAdmin()) return { name: 'Admin', icon: Shield }
    if (isOutletManager()) return { name: 'Outlet Manager', icon: User }
    if (isOutletStaff()) return { name: 'Outlet Staff', icon: Users }
    if (isViewer()) return { name: 'Viewer', icon: Eye }
    return { name: 'Guest', icon: Shield }
  }

  const currentRole = getCurrentRoleInfo()
  const RoleIcon = currentRole.icon

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Outlet Management
              </h1>
              {assignedOutlet && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-coral-100 dark:bg-coral-900/20 rounded-full">
                  <span className="text-sm text-coral-600 dark:text-coral-400">
                    {assignedOutlet.name}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Role Selector (Development Mode) */}
              {isDevMode && (
                <div className="relative">
                  <button
                    onClick={() => setShowRoleSelector(!showRoleSelector)}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <RoleIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {currentRole.name}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>

                  {showRoleSelector && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                    >
                      <div className="p-2">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2">
                          Switch Role (Dev Mode)
                        </div>
                        {mockRoles.map((role) => {
                          const Icon = role.icon
                          return (
                            <button
                              key={role.id}
                              onClick={() => handleRoleChange(role.id)}
                              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                                selectedRole === role.id
                                  ? 'bg-coral-100 dark:bg-coral-900/20 text-coral-600 dark:text-coral-400'
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                              <div>
                                <div className="text-sm font-medium">{role.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {role.description}
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.firstName || user?.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {currentRole.name}
                  </p>
                </div>
                <div className="w-8 h-8 bg-coral-100 dark:bg-coral-900/20 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-coral-600 dark:text-coral-400" />
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderRoleBasedView()}
        </motion.div>
      </main>

      {/* Add Outlet Modal (Admin Only) */}
      {isAdmin() && showAddModal && (
        <AddOutletModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Development Mode Notice */}
      {isDevMode && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 shadow-lg">
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm text-yellow-800 dark:text-yellow-200">
              Development Mode • Role: {currentRole.name}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default OutletBaseScreen 