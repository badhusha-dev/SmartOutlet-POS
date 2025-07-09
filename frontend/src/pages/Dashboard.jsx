import React from 'react'
import { useQuery } from 'react-query'
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Store,
  Users,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
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
import { motion } from 'framer-motion'
import apiClient, { API_ENDPOINTS } from '../api/client'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const Dashboard = () => {
  // Fetch dashboard stats
  const { data: stats, isLoading } = useQuery(
    'dashboardStats',
    () => apiClient.get(API_ENDPOINTS.DASHBOARD_STATS),
    {
      select: (response) => response.data.data,
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  )

  // Mock data for demo purposes (replace with actual API data)
  const mockStats = {
    totalSales: 125420,
    totalOrders: 1247,
    totalProducts: 342,
    totalOutlets: 8,
    salesGrowth: 12.5,
    ordersGrowth: -2.3,
    productsGrowth: 8.7,
    outletsGrowth: 0,
  }

  const salesData = [
    { name: 'Jan', sales: 12000, orders: 45 },
    { name: 'Feb', sales: 19000, orders: 67 },
    { name: 'Mar', sales: 15000, orders: 52 },
    { name: 'Apr', sales: 25000, orders: 89 },
    { name: 'May', sales: 22000, orders: 78 },
    { name: 'Jun', sales: 30000, orders: 95 },
  ]

  const categoryData = [
    { name: 'Electronics', value: 35, color: '#3b82f6' },
    { name: 'Clothing', value: 25, color: '#10b981' },
    { name: 'Food & Beverage', value: 20, color: '#f59e0b' },
    { name: 'Books', value: 12, color: '#ef4444' },
    { name: 'Others', value: 8, color: '#8b5cf6' },
  ]

  const topProducts = [
    { name: 'iPhone 15 Pro', sales: 850, revenue: 850000 },
    { name: 'Samsung Galaxy S24', sales: 720, revenue: 720000 },
    { name: 'MacBook Air M3', sales: 450, revenue: 675000 },
    { name: 'AirPods Pro', sales: 1200, revenue: 300000 },
    { name: 'iPad Air', sales: 380, revenue: 228000 },
  ]

  const currentStats = stats || mockStats

  if (isLoading) {
    return <LoadingSpinner />
  }

  const StatCard = ({ title, value, icon: Icon, growth, color = 'primary' }) => {
    const isPositive = growth > 0
    const colorClasses = {
      primary: 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400',
      green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
      blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            <div className="flex items-center mt-1">
              {isPositive ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(growth)}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                vs last month
              </span>
            </div>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your business.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn-secondary px-4 py-2">
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value={`$${currentStats.totalSales.toLocaleString()}`}
          icon={DollarSign}
          growth={currentStats.salesGrowth}
          color="primary"
        />
        <StatCard
          title="Total Orders"
          value={currentStats.totalOrders}
          icon={ShoppingCart}
          growth={currentStats.ordersGrowth}
          color="green"
        />
        <StatCard
          title="Products"
          value={currentStats.totalProducts}
          icon={Package}
          growth={currentStats.productsGrowth}
          color="blue"
        />
        <StatCard
          title="Outlets"
          value={currentStats.totalOutlets}
          icon={Store}
          growth={currentStats.outletsGrowth}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sales Overview
            </h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary-500 rounded-full mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Sales</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Orders</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stackId="1" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Sales by Category
          </h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 card"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Top Selling Products
          </h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {product.sales} units sold
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${product.revenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Revenue
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  New order #1247
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  2 minutes ago
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Product added to inventory
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  15 minutes ago
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Low stock alert
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  1 hour ago
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  New user registered
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  3 hours ago
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard