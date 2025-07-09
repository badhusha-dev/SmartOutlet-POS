import React, { useState } from 'react'
import { Plus, Receipt, Calendar, DollarSign, Tag, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import Modal from '../components/ui/Modal'
import { useForm } from 'react-hook-form'

const ExpenseTracker = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-06-30'
  })

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  // Mock data
  const expenses = [
    {
      id: 1,
      description: 'Office Rent',
      amount: 2500.00,
      category: 'Rent',
      date: '2024-01-01',
      outlet: 'Downtown Store',
      receiptUrl: null
    },
    {
      id: 2,
      description: 'Marketing Campaign',
      amount: 1200.00,
      category: 'Marketing',
      date: '2024-01-15',
      outlet: 'All Outlets',
      receiptUrl: null
    },
    {
      id: 3,
      description: 'Inventory Purchase',
      amount: 5000.00,
      category: 'Inventory',
      date: '2024-01-20',
      outlet: 'Mall Branch',
      receiptUrl: null
    },
    {
      id: 4,
      description: 'Utilities',
      amount: 450.00,
      category: 'Utilities',
      date: '2024-01-25',
      outlet: 'Downtown Store',
      receiptUrl: null
    },
  ]

  const categories = ['Rent', 'Marketing', 'Inventory', 'Utilities', 'Salaries', 'Maintenance', 'Other']

  const categoryData = categories.map(category => {
    const categoryExpenses = expenses.filter(expense => expense.category === category)
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    return {
      name: category,
      value: total,
      color: getColorForCategory(category)
    }
  }).filter(item => item.value > 0)

  function getColorForCategory(category) {
    const colors = {
      'Rent': '#3b82f6',
      'Marketing': '#10b981',
      'Inventory': '#f59e0b',
      'Utilities': '#ef4444',
      'Salaries': '#8b5cf6',
      'Maintenance': '#06b6d4',
      'Other': '#6b7280'
    }
    return colors[category] || '#6b7280'
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const monthlyAvg = totalExpenses / 6 // Assuming 6 months of data

  const filteredExpenses = expenses.filter(expense => {
    const matchesCategory = !selectedCategory || expense.category === selectedCategory
    return matchesCategory
  })

  const onSubmit = (data) => {
    console.log('New expense:', data)
    setIsModalOpen(false)
    reset()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Expense Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage your business expenses.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary px-4 py-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <DollarSign className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalExpenses.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Average</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${monthlyAvg.toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Tag className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {categoryData.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense List */}
        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Recent Expenses
          </h3>
          <div className="space-y-4">
            {filteredExpenses.map((expense) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                    <Receipt className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {expense.description}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{expense.category}</span>
                      <span>{expense.date}</span>
                      <span>{expense.outlet}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">
                    -${expense.amount.toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Expense by Category
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: $${value}`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          reset()
        }}
        title="Add New Expense"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <input
              {...register('description', { required: 'Description is required' })}
              type="text"
              className="input"
              placeholder="Enter expense description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount
            </label>
            <input
              {...register('amount', { 
                required: 'Amount is required',
                min: { value: 0.01, message: 'Amount must be greater than 0' }
              })}
              type="number"
              step="0.01"
              className="input"
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="input"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <input
              {...register('date', { required: 'Date is required' })}
              type="date"
              className="input"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.date.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Outlet
            </label>
            <select
              {...register('outlet', { required: 'Outlet is required' })}
              className="input"
            >
              <option value="">Select an outlet</option>
              <option value="Downtown Store">Downtown Store</option>
              <option value="Mall Branch">Mall Branch</option>
              <option value="Airport Shop">Airport Shop</option>
              <option value="All Outlets">All Outlets</option>
            </select>
            {errors.outlet && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.outlet.message}
              </p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false)
                reset()
              }}
              className="flex-1 btn-secondary py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary py-2"
            >
              Add Expense
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ExpenseTracker