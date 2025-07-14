import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Eye, 
  DollarSign, 
  AlertTriangle,
  MapPin,
  Clock,
  Phone,
  Mail,
  User,
  Lock
} from 'lucide-react'
import outletService from '../outletService'
import { useAppSelector } from '../../../store/hooks'
import { selectUser, selectIsDevMode } from '../../../store/slices/authSlice'

const OutletViewerView = ({ assignedOutlet }) => {
  const [outlet, setOutlet] = useState(null)
  const [performance, setPerformance] = useState(null)
  const [loading, setLoading] = useState(true)
  const user = useAppSelector(selectUser)
  const isDevMode = useAppSelector(selectIsDevMode)

  useEffect(() => {
    if (assignedOutlet?.id) {
      loadOutletData()
    }
  }, [assignedOutlet])

  const loadOutletData = async () => {
    try {
      setLoading(true)
      
      // Load outlet details
      const outletResponse = await outletService.getOutletById(assignedOutlet.id)
      setOutlet(outletResponse.data)
      
      // Load performance data
      const performanceResponse = await outletService.getOutletPerformance(assignedOutlet.id)
      setPerformance(performanceResponse.data)
      
    } catch (error) {
      console.error('Failed to load outlet data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-600"></div>
      </div>
    )
  }

  if (!outlet) {
    return (
      <div className="text-center py-12">
        <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Access Restricted
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          You don't have permission to view outlet information.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {outlet.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Read-Only Access • Viewer Role
            </p>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
            <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">View Only</span>
          </div>
        </div>

        {/* Outlet Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{outlet.address}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{outlet.openingHours}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4" />
            <span>{outlet.phone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>{outlet.email}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards - Limited Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Today's Sales
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total revenue for today
                </p>
              </div>
            </div>
          </div>
          
          {performance ? (
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ${performance.salesToday.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {performance.ordersToday} orders today
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400">Data unavailable</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Waste Percentage
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Today's waste rate
                </p>
              </div>
            </div>
          </div>
          
          {performance ? (
            <div className="text-center">
              <p className={`text-3xl font-bold ${
                performance.wastePercentage <= 5 ? 'text-green-600' :
                performance.wastePercentage <= 10 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {performance.wastePercentage}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {performance.wastePercentage <= 5 ? 'Excellent' :
                 performance.wastePercentage <= 10 ? 'Good' : 'Needs attention'}
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400">Data unavailable</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Additional Info - Read Only */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-coral-600" />
          Outlet Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {outlet.staffCount}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Staff</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {outlet.orders}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {outlet.status}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Manager
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {outlet.manager}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Created
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(outlet.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Access Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4"
      >
        <div className="flex items-start space-x-3">
          <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Limited Access
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              You have read-only access to this outlet. Contact your manager for additional permissions.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Development Mode Indicator */}
      {isDevMode && (
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              🔓 Dev Mode - Viewer Role • {user?.username}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default OutletViewerView 