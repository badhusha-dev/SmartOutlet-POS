import React, { useState, useEffect } from 'react'
import { 
  X, 
  MapPin, 
  User, 
  Clock, 
  Phone, 
  Mail,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  BarChart3,
  Download
} from 'lucide-react'
import { motion } from 'framer-motion'
import outletService from '../../services/outletService'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import toast from 'react-hot-toast'

const OutletDetailView = ({ outlet, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('performance')
  const [performance, setPerformance] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && outlet) {
      loadOutletData()
    }
  }, [isOpen, outlet])

  const loadOutletData = async () => {
    try {
      setLoading(true)
      const [performanceRes, expensesRes, inventoryRes] = await Promise.all([
        outletService.getOutletPerformance(outlet.id),
        outletService.getOutletExpenses(outlet.id),
        outletService.getOutletInventory(outlet.id)
      ])
      
      setPerformance(performanceRes.data)
      setExpenses(expensesRes.data)
      setInventory(inventoryRes.data)
    } catch (error) {
      toast.error('Failed to load outlet data')
      console.error('Failed to load outlet data:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'expenses', label: 'Expenses', icon: DollarSign }
  ]

  const getStatusColor = (status) => {
    return status === 'ACTIVE' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }

  const getStockStatus = (item) => {
    if (item.stockQuantity <= item.minStockLevel) {
      return { status: 'LOW', color: 'text-red-600', bgColor: 'bg-red-50 dark:bg-red-900/20' }
    } else if (item.stockQuantity >= item.maxStockLevel * 0.8) {
      return { status: 'HIGH', color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-900/20' }
    } else {
      return { status: 'NORMAL', color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' }
    }
  }

  const performanceData = [
    { name: 'Mon', sales: 1200, orders: 15 },
    { name: 'Tue', sales: 1800, orders: 22 },
    { name: 'Wed', sales: 1500, orders: 18 },
    { name: 'Thu', sales: 2200, orders: 28 },
    { name: 'Fri', sales: 2800, orders: 35 },
    { name: 'Sat', sales: 3200, orders: 42 },
    { name: 'Sun', sales: 2400, orders: 30 }
  ]

  const categoryData = [
    { name: 'Electronics', value: 45, color: '#3b82f6' },
    { name: 'Clothing', value: 30, color: '#10b981' },
    { name: 'Food', value: 15, color: '#f59e0b' },
    { name: 'Others', value: 10, color: '#8b5cf6' }
  ]

  if (!isOpen || !outlet) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-coral-100 dark:bg-coral-900/20 rounded-lg">
              <MapPin className="h-6 w-6 text-coral-600 dark:text-coral-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {outlet.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {outlet.address}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(outlet.status)}`}>
              {outlet.status === 'ACTIVE' ? <CheckCircle className="h-4 w-4 mr-1" /> : <XCircle className="h-4 w-4 mr-1" />}
              {outlet.status}
            </span>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-coral-500 text-coral-600 dark:text-coral-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-600"></div>
            </div>
          ) : (
            <div>
              {/* Performance Tab */}
              {activeTab === 'performance' && performance && (
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="card">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Sales Today
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            ${performance.salesToday.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                    </div>

                    <div className="card">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Orders Today
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {performance.ordersToday}
                          </p>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </div>

                    <div className="card">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Profit Today
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            ${performance.profitToday.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                      </div>
                    </div>

                    <div className="card">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Waste %
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {performance.wastePercentage}%
                          </p>
                        </div>
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Weekly Sales Trend
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip 
                            formatter={(value, name) => [
                              name === 'sales' ? `$${value.toLocaleString()}` : value,
                              name === 'sales' ? 'Sales' : 'Orders'
                            ]}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="sales" 
                            stroke="#ff6b6b" 
                            strokeWidth={2}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="orders" 
                            stroke="#4ecdc4" 
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="card">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Sales by Category
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, 'Market Share']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Staff Tab */}
              {activeTab === 'staff' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Assigned Staff
                    </h3>
                    <button className="btn-primary px-4 py-2">
                      <User className="h-4 w-4 mr-2" />
                      Assign Staff
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: outlet.staffCount }, (_, i) => (
                      <div key={i} className="card">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-coral-100 dark:bg-coral-900/20 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-coral-600 dark:text-coral-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Staff Member {i + 1}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {i === 0 ? 'Manager' : 'Staff'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inventory Tab */}
              {activeTab === 'inventory' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Inventory Summary
                    </h3>
                    <button className="btn-secondary px-4 py-2">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                        Stock Overview
                      </h4>
                      <div className="space-y-3">
                        {inventory.map((item) => {
                          const stockStatus = getStockStatus(item)
                          return (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{item.category}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {item.stockQuantity}
                                </p>
                                <span className={`text-xs px-2 py-1 rounded-full ${stockStatus.bgColor} ${stockStatus.color}`}>
                                  {stockStatus.status}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="card">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                        Low Stock Alerts
                      </h4>
                      <div className="space-y-3">
                        {inventory.filter(item => item.stockQuantity <= item.minStockLevel).map((item) => (
                          <div key={item.id} className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                              <p className="text-sm text-red-600">
                                Stock: {item.stockQuantity} (Min: {item.minStockLevel})
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Expenses Tab */}
              {activeTab === 'expenses' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Expense Summary
                    </h3>
                    <button className="btn-primary px-4 py-2">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Add Expense
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                        Recent Expenses
                      </h4>
                      <div className="space-y-3">
                        {expenses.map((expense) => (
                          <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{expense.title}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{expense.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900 dark:text-white">
                                ${expense.amount.toLocaleString()}
                              </p>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                expense.status === 'PAID' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }`}>
                                {expense.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                        Expense Categories
                      </h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={[
                          { category: 'Rent', amount: 2500 },
                          { category: 'Utilities', amount: 450 },
                          { category: 'Inventory', amount: 1200 },
                          { category: 'Marketing', amount: 300 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="category" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                          <Bar dataKey="amount" fill="#ff6b6b" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OutletDetailView 