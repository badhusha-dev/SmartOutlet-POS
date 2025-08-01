
import React, { useState, useEffect } from 'react'
import { Plus, Minus, X, Receipt, Search, Grid, List, Filter } from 'lucide-react'
import { toast } from 'react-hot-toast'

const POSSales = () => {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [viewMode, setViewMode] = useState('grid')
  const [loading, setLoading] = useState(true)

  // Sample products data with categories
  const sampleProducts = [
    {
      id: 1,
      name: 'Green Tea Matcha Latte',
      price: 8.60,
      category: 'BEVERAGES',
      image: '/api/placeholder/150/150',
      description: 'Vanilla flavored matcha latte',
      inStock: true
    },
    {
      id: 2,
      name: 'Chocolate Chip Muffin',
      price: 6.42,
      category: 'DESSERTS',
      image: '/api/placeholder/150/150',
      description: 'Fresh baked muffin with chocolate chips',
      inStock: true
    },
    {
      id: 3,
      name: 'Ice Cream Strawberry',
      price: 12.00,
      category: 'DESSERTS',
      image: '/api/placeholder/150/150',
      description: 'Creamy strawberry ice cream with sprinkles',
      inStock: true
    },
    {
      id: 4,
      name: 'Fruit Smoothie',
      price: 17.97,
      category: 'SMOOTHIES',
      image: '/api/placeholder/150/150',
      description: 'Mixed fruit smoothie',
      inStock: true
    },
    {
      id: 5,
      name: 'Chicken Wrap',
      price: 9.99,
      category: 'SANDWICHES',
      image: '/api/placeholder/150/150',
      description: 'Grilled chicken wrap with vegetables',
      inStock: true
    },
    {
      id: 6,
      name: 'Jalapeño Cheddar',
      price: 5.00,
      category: 'SANDWICHES',
      image: '/api/placeholder/150/150',
      description: 'Spicy jalapeño cheddar sandwich',
      inStock: true
    },
    {
      id: 7,
      name: 'Latte',
      price: 4.50,
      category: 'BEVERAGES',
      image: '/api/placeholder/150/150',
      description: 'Classic coffee latte',
      inStock: true
    },
    {
      id: 8,
      name: 'Donuts',
      price: 3.25,
      category: 'DESSERTS',
      image: '/api/placeholder/150/150',
      description: 'Glazed donuts',
      inStock: true
    },
    {
      id: 9,
      name: 'Macarons',
      price: 8.75,
      category: 'DESSERTS',
      image: '/api/placeholder/150/150',
      description: 'French macarons assorted flavors',
      inStock: true
    },
    {
      id: 10,
      name: 'Burger',
      price: 12.50,
      category: 'SANDWICHES',
      image: '/api/placeholder/150/150',
      description: 'Classic beef burger',
      inStock: true
    },
    {
      id: 11,
      name: 'Pancakes with Berries',
      price: 9.25,
      category: 'DESSERTS',
      image: '/api/placeholder/150/150',
      description: 'Fluffy pancakes with fresh berries',
      inStock: true
    },
    {
      id: 12,
      name: 'Strawberry Smoothie',
      price: 6.75,
      category: 'SMOOTHIES',
      image: '/api/placeholder/150/150',
      description: 'Fresh strawberry smoothie',
      inStock: true
    }
  ]

  const categories = ['ALL', 'BEVERAGES', 'DESSERTS', 'SANDWICHES', 'SMOOTHIES', 'SALADS']

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(sampleProducts)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory
    return matchesSearch && matchesCategory && product.inStock
  })

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
    toast.success(`${product.name} added to cart`)
  }

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ))
  }

  const removeFromCart = (id) => {
    const item = cart.find(item => item.id === id)
    setCart(cart.filter(item => item.id !== id))
    if (item) {
      toast.success(`${item.name} removed from cart`)
    }
  }

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const getDiscounts = () => {
    return getSubtotal() * 0.05 // 5% discount
  }

  const getTax = () => {
    return (getSubtotal() - getDiscounts()) * 0.08 // 8% tax
  }

  const getTotal = () => {
    return getSubtotal() - getDiscounts() + getTax()
  }

  const processSale = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty!')
      return
    }

    // Mock API call
    setTimeout(() => {
      toast.success('Sale processed successfully!')
      setCart([])
    }, 1000)
  }

  const saveDraft = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty!')
      return
    }
    toast.success('Order saved as draft!')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen">
        {/* Main Content - Products Grid */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Point of Sale
              </h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            {/* Category Filters */}
            <div className="flex space-x-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 p-4 overflow-auto">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
                    <div className="bg-gray-300 dark:bg-gray-600 h-32 rounded-lg mb-3"></div>
                    <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded mb-2"></div>
                    <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover bg-gray-100 dark:bg-gray-700"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                        <div className="text-sm font-medium truncate">{product.name}</div>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        ${product.price.toFixed(2)}
                      </div>
                      {product.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                          {product.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Ticket */}
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Ticket Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Ticket</h2>
              <div className="flex items-center space-x-2">
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>Take out</option>
                  <option>Dine in</option>
                  <option>Delivery</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No items in cart</p>
                <p className="text-sm">Add items to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-start justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {item.name} x {item.quantity}
                      </div>
                      {item.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {item.description}
                        </div>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateQuantity(item.id, item.quantity - 1)
                          }}
                          className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateQuantity(item.id, item.quantity + 1)
                          }}
                          className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFromCart(item.id)
                          }}
                          className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-800 ml-2"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cart.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-white">${getSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Discounts</span>
                <span className="text-green-600 dark:text-green-400">-${getDiscounts().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                <span className="text-gray-900 dark:text-white">${getTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-3">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-gray-900 dark:text-white">${getTotal().toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={saveDraft}
                disabled={cart.length === 0}
                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                SAVE
              </button>
              <button
                onClick={processSale}
                disabled={cart.length === 0}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                CHARGE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default POSSales
