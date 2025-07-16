import { USER_ROLES } from '../utils/constants'
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for user role management and permissions
 * @returns {object} User role utilities
 */
export function useUserRole() {
  const { user } = useAuth();

  const isAdmin = () => {
    if (isDevMode) return true
    return user?.role === USER_ROLES.ADMIN
  }

  const isStaff = () => {
    if (isDevMode) return true
    return user?.role === USER_ROLES.STAFF
  }

  const hasPermission = (requiredRole) => {
    if (isDevMode) return true
    if (!user) return false
    
    const roleHierarchy = {
      [USER_ROLES.ADMIN]: 2,
      [USER_ROLES.STAFF]: 1,
    }
    
    const userLevel = roleHierarchy[user.role] || 0
    const requiredLevel = roleHierarchy[requiredRole] || 0
    
    return userLevel >= requiredLevel
  }

  const canManageOutlets = () => {
    return hasPermission(USER_ROLES.ADMIN)
  }

  const canManageProducts = () => {
    return hasPermission(USER_ROLES.STAFF)
  }

  const canProcessSales = () => {
    return hasPermission(USER_ROLES.STAFF)
  }

  const canViewReports = () => {
    return hasPermission(USER_ROLES.STAFF)
  }

  const canManageExpenses = () => {
    return hasPermission(USER_ROLES.ADMIN)
  }

  const canManageStaff = () => {
    return hasPermission(USER_ROLES.ADMIN)
  }

  const getUserRole = () => {
    return user?.role || null
  }

  const getUserDisplayName = () => {
    if (!user) return ''
    return `${user.firstName} ${user.lastName}`.trim() || user.username
  }

  return {
    user,
    isAdmin,
    isStaff,
    hasPermission,
    canManageOutlets,
    canManageProducts,
    canProcessSales,
    canViewReports,
    canManageExpenses,
    canManageStaff,
    getUserRole,
    getUserDisplayName,
  }
} 