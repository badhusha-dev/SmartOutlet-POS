import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Plus, Search, Package, Edit, Trash2, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import apiClient, { API_ENDPOINTS } from '../api/client'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // Fetch products
  const { data: products, isLoading } = useQuery(
    'products',
    () => apiClient.get(API_ENDPOINTS.PRODUCTS),
    {
      select: (response) => response.data.data || [],
    }
  )

  // Mock data for demo
  const mockProducts = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      barcode: '123456789',
      price: 999.99,
      category: 'Electronics',
      stock: 25,
      lowStock: false,
      image: '/api/placeholder/100/100'
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24',
      barcode: '987654321',
      price: 899.99,
      category: 'Electronics',
      stock: 5,
      lowStock: true,
      image: '/api/placeholder/100/100'
    },
    {
      id: 3,
      name: 'MacBook Air M3',
      barcode: '456789123',
      price: 1299.99,
      category: 'Electronics',
      stock: 12,
      lowStock: false,
      image: '/api/placeholder/100/100'
    },
  ]

  const displayProducts = products || mockProducts

  const filteredProducts = displayProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.includes(searchTerm)
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(displayProducts.map(p => p.category))]

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Product Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your product inventory and stock levels.
          </p>
        </div>
        <button className="btn-primary px-4 py-2">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products by name or barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input sm:w-48"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
              <Package className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {displayProducts.length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {displayProducts.filter(p => p.lowStock).length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {categories.length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Stock</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {displayProducts.reduce((sum, p) => sum + p.stock, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              {product.lowStock && (
                <div className="absolute top-2 right-2 bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 px-2 py-1 rounded text-xs font-medium">
                  Low Stock
                </div>
              )}
              
              <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                <Package className="h-12 w-12 text-gray-400" />
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {product.barcode}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    ${product.price}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Stock: {product.stock}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {product.category}
                </p>
              </div>

              <div className="flex space-x-2 mt-4">
                <button className="flex-1 btn-secondary py-2 text-sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button className="flex-1 btn-danger py-2 text-sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No products found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  )
}

export default ProductManagement