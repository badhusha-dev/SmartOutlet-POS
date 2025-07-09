import React, { useState } from 'react'
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, DollarSign, Receipt } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const POSSales = () => {
  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('CASH')

  // Mock products for demo
  const products = [
    { id: 1, name: 'iPhone 15 Pro', price: 999.99, barcode: '123456789', stock: 25 },
    { id: 2, name: 'Samsung Galaxy S24', price: 899.99, barcode: '987654321', stock: 15 },
    { id: 3, name: 'MacBook Air M3', price: 1299.99, barcode: '456789123', stock: 8 },
    { id: 4, name: 'AirPods Pro', price: 249.99, barcode: '789123456', stock: 50 },
  ]

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm)
  )

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ))
      } else {
        toast.error('Insufficient stock!')
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(id)
      return
    }
    
    const product = products.find(p => p.id === id)
    if (newQuantity > product.stock) {
      toast.error('Insufficient stock!')
      return
    }

    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ))
  }

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const getTax = () => {
    return getTotal() * 0.1 // 10% tax
  }

  const getGrandTotal = () => {
    return getTotal() + getTax()
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Products Section */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            POS Sales
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Select products to add to cart and process sales.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search products by name or scan barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
          <ShoppingCart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="card cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => addToCart(product)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {product.barcode}
                  </p>
                  <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    ${product.price}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Stock: {product.stock}
                  </p>
                </div>
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Shopping Cart
          </h2>

          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Cart is empty</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ${item.price} each
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Totals */}
        {cart.length > 0 && (
          <div className="card">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${getTotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax (10%):</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${getTax().toFixed(2)}
                </span>
              </div>
              <hr className="border-gray-200 dark:border-gray-700" />
              <div className="flex justify-between text-lg">
                <span className="font-bold text-gray-900 dark:text-white">Total:</span>
                <span className="font-bold text-primary-600 dark:text-primary-400">
                  ${getGrandTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Method */}
        {cart.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Payment Method
            </h3>
            <div className="space-y-2">
              {['CASH', 'CARD', 'DIGITAL'].map((method) => (
                <label key={method} className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    {method === 'CASH' && <><DollarSign className="inline h-4 w-4 mr-1" />Cash</>}
                    {method === 'CARD' && <><CreditCard className="inline h-4 w-4 mr-1" />Card</>}
                    {method === 'DIGITAL' && <><CreditCard className="inline h-4 w-4 mr-1" />Digital</>}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Process Sale Button */}
        {cart.length > 0 && (
          <button
            onClick={processSale}
            className="w-full btn-primary py-3 text-lg"
          >
            <Receipt className="h-5 w-5 mr-2" />
            Process Sale
          </button>
        )}
      </div>
    </div>
  )
}

export default POSSales