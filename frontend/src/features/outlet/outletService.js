import apiClient, { API_ENDPOINTS } from '../../services/client'
import { mockOutlets, mockStaff } from '../../utils/mockData'

// Development mode flags
const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true'
const DISABLE_AUTH = import.meta.env.VITE_DISABLE_AUTH === 'true'

class OutletService {
  // Get all outlets
  async getOutlets() {
    if (DEV_MODE && DISABLE_AUTH) {
      console.log('🔓 Development mode: Mock getOutlets')
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      return {
        data: mockOutlets,
        success: true,
        message: 'Outlets retrieved successfully'
      }
    }

    try {
      const response = await apiClient.get(API_ENDPOINTS.OUTLETS)
      return {
        data: response.data.data,
        success: true,
        message: 'Outlets retrieved successfully'
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch outlets')
    }
  }

  // Get outlet by ID
  async getOutletById(id) {
    if (DEV_MODE && DISABLE_AUTH) {
      console.log('🔓 Development mode: Mock getOutletById', id)
      await new Promise(resolve => setTimeout(resolve, 300))
      const outlet = mockOutlets.find(o => o.id === id)
      if (!outlet) {
        throw new Error('Outlet not found')
      }
      return {
        data: outlet,
        success: true,
        message: 'Outlet retrieved successfully'
      }
    }

    try {
      const response = await apiClient.get(API_ENDPOINTS.OUTLET_BY_ID(id))
      return {
        data: response.data.data,
        success: true,
        message: 'Outlet retrieved successfully'
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch outlet')
    }
  }

  // Create new outlet
  async createOutlet(outletData) {
    if (DEV_MODE && DISABLE_AUTH) {
      console.log('🔓 Development mode: Mock createOutlet', outletData)
      await new Promise(resolve => setTimeout(resolve, 800))
      const newOutlet = {
        id: Math.max(...mockOutlets.map(o => o.id)) + 1,
        ...outletData,
        createdAt: new Date().toISOString(),
        revenue: 0,
        orders: 0,
        staffCount: 0
      }
      return {
        data: newOutlet,
        success: true,
        message: 'Outlet created successfully'
      }
    }

    try {
      const response = await apiClient.post(API_ENDPOINTS.OUTLETS, outletData)
      return {
        data: response.data.data,
        success: true,
        message: 'Outlet created successfully'
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create outlet')
    }
  }

  // Update outlet
  async updateOutlet(id, outletData) {
    if (DEV_MODE && DISABLE_AUTH) {
      console.log('🔓 Development mode: Mock updateOutlet', id, outletData)
      await new Promise(resolve => setTimeout(resolve, 600))
      const outletIndex = mockOutlets.findIndex(o => o.id === id)
      if (outletIndex === -1) {
        throw new Error('Outlet not found')
      }
      const updatedOutlet = { ...mockOutlets[outletIndex], ...outletData }
      return {
        data: updatedOutlet,
        success: true,
        message: 'Outlet updated successfully'
      }
    }

    try {
      const response = await apiClient.put(API_ENDPOINTS.OUTLET_BY_ID(id), outletData)
      return {
        data: response.data.data,
        success: true,
        message: 'Outlet updated successfully'
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update outlet')
    }
  }

  // Delete outlet
  async deleteOutlet(id) {
    if (DEV_MODE && DISABLE_AUTH) {
      console.log('🔓 Development mode: Mock deleteOutlet', id)
      await new Promise(resolve => setTimeout(resolve, 400))
      const outletIndex = mockOutlets.findIndex(o => o.id === id)
      if (outletIndex === -1) {
        throw new Error('Outlet not found')
      }
      return {
        success: true,
        message: 'Outlet deleted successfully'
      }
    }

    try {
      await apiClient.delete(API_ENDPOINTS.OUTLET_BY_ID(id))
      return {
        success: true,
        message: 'Outlet deleted successfully'
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete outlet')
    }
  }

  // Get staff for outlet assignment
  async getStaff() {
    if (DEV_MODE && DISABLE_AUTH) {
      console.log('🔓 Development mode: Mock getStaff')
      await new Promise(resolve => setTimeout(resolve, 300))
      return {
        data: mockStaff,
        success: true,
        message: 'Staff retrieved successfully'
      }
    }

    try {
      const response = await apiClient.get('/staff')
      return {
        data: response.data.data,
        success: true,
        message: 'Staff retrieved successfully'
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch staff')
    }
  }

  // Get outlet performance data
  async getOutletPerformance(id) {
    if (DEV_MODE && DISABLE_AUTH) {
      console.log('🔓 Development mode: Mock getOutletPerformance', id)
      await new Promise(resolve => setTimeout(resolve, 500))
      return {
        data: {
          salesToday: Math.floor(Math.random() * 5000) + 1000,
          wastePercentage: Math.floor(Math.random() * 15) + 2,
          profitToday: Math.floor(Math.random() * 2000) + 500,
          ordersToday: Math.floor(Math.random() * 50) + 10,
          averageOrderValue: Math.floor(Math.random() * 100) + 50,
          customerCount: Math.floor(Math.random() * 200) + 50
        },
        success: true,
        message: 'Performance data retrieved successfully'
      }
    }

    try {
      const response = await apiClient.get(`${API_ENDPOINTS.OUTLET_BY_ID(id)}/performance`)
      return {
        data: response.data.data,
        success: true,
        message: 'Performance data retrieved successfully'
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch performance data')
    }
  }

  // Get outlet expenses
  async getOutletExpenses(id) {
    if (DEV_MODE && DISABLE_AUTH) {
      console.log('🔓 Development mode: Mock getOutletExpenses', id)
      await new Promise(resolve => setTimeout(resolve, 400))
      return {
        data: [
          {
            id: 1,
            title: 'Rent Payment',
            amount: 2500,
            category: 'Rent',
            date: new Date().toISOString(),
            status: 'PAID'
          },
          {
            id: 2,
            title: 'Utility Bills',
            amount: 450,
            category: 'Utilities',
            date: new Date().toISOString(),
            status: 'PENDING'
          }
        ],
        success: true,
        message: 'Expenses retrieved successfully'
      }
    }

    try {
      const response = await apiClient.get(`${API_ENDPOINTS.OUTLET_BY_ID(id)}/expenses`)
      return {
        data: response.data.data,
        success: true,
        message: 'Expenses retrieved successfully'
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch expenses')
    }
  }

  // Get outlet inventory
  async getOutletInventory(id) {
    if (DEV_MODE && DISABLE_AUTH) {
      console.log('🔓 Development mode: Mock getOutletInventory', id)
      await new Promise(resolve => setTimeout(resolve, 400))
      return {
        data: [
          {
            id: 1,
            name: 'iPhone 15 Pro',
            stockQuantity: 25,
            minStockLevel: 10,
            maxStockLevel: 50,
            category: 'Electronics'
          },
          {
            id: 2,
            name: 'Samsung Galaxy S24',
            stockQuantity: 8,
            minStockLevel: 15,
            maxStockLevel: 40,
            category: 'Electronics'
          }
        ],
        success: true,
        message: 'Inventory retrieved successfully'
      }
    }

    try {
      const response = await apiClient.get(`${API_ENDPOINTS.OUTLET_BY_ID(id)}/inventory`)
      return {
        data: response.data.data,
        success: true,
        message: 'Inventory retrieved successfully'
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch inventory')
    }
  }
}

export default new OutletService() 