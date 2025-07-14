import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  User, 
  DollarSign, 
  ShoppingCart, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Edit, 
  Eye, 
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail
} from 'lucide-react'
import outletService from '../../services/outletService'
import { useAuth } from '../../contexts/AuthContext'

const OutletCard = ({ outlet, onEdit, onView, onDelete, onRefresh }) => {
  const [performance, setPerformance] = useState(null)
  const [loading, setLoading] = useState(false)
  const { isDevMode } = useAuth()

  useEffect(() => {
    loadPerformanceData()
  }, [outlet.id])

  const loadPerformanceData = async () => {
    try {
      setLoading(true)
      const response = await outletService.getOutletPerformance(outlet.id)
      setPerformance(response.data)
    } catch (error) {
      console.error('Failed to load performance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    return status === 'ACTIVE' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }

  const getWasteColor = (percentage) => {
    if (percentage <= 5) return 'text-green-600'
    if (percentage <= 10) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getProfitColor = (profit) => {
    return profit > 0 ? 'text-green-600' : 'text-red-600'
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${outlet.name}?`)) {
      try {
        await outletService.deleteOutlet(outlet.id)
        onDelete(outlet.id)
      } catch (error) {
        console.error('Failed to delete outlet:', error)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {outlet.name}
              </h3>
              {outlet.status === 'ACTIVE' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <MapPin className="h-4 w-4" />
              <span>{outlet.address}</span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{outlet.manager}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{outlet.openingHours}</span>
              </div>
            </div>
          </div>

          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(outlet.status)}`}>
            {outlet.status}
          </span>
        </div>

        {/* Contact Info */}
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Phone className="h-4 w-4" />
            <span>{outlet.phone}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Mail className="h-4 w-4" />
            <span>{outlet.email}</span>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="p-6">
        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : performance ? (
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Sales Today</span>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                ${performance.salesToday.toLocaleString()}
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Waste %</span>
              </div>
              <p className={`text-lg font-bold ${getWasteColor(performance.wastePercentage)}`}>
                {performance.wastePercentage}%
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Profit Today</span>
              </div>
              <p className={`text-lg font-bold ${getProfitColor(performance.profitToday)}`}>
                ${performance.profitToday.toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            Performance data unavailable
          </div>
        )}

        {/* Additional Stats */}
        {performance && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Orders Today</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {performance.ordersToday}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Avg Order</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ${performance.averageOrderValue}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{outlet.staffCount} staff</span>
            </div>
            <div className="flex items-center space-x-1">
              <ShoppingCart className="h-4 w-4" />
              <span>{outlet.orders} orders</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onView(outlet)}
              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => onEdit(outlet)}
              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title="Edit Outlet"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Delete Outlet"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Development Mode Indicator */}
      {isDevMode && (
        <div className="px-6 pb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            🔓 Dev Mode - Mock Data
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default OutletCard 