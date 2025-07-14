import { pdf } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'
import { format } from 'date-fns'
import React from 'react'

class ReportService {
  // Generate and download PDF report
  async generateAndDownloadPDF(ReportComponent, data, filename) {
    try {
      const blob = await pdf(React.createElement(ReportComponent, { ...data, showPreview: false })).toBlob()
      saveAs(blob, filename)
      return { success: true, message: 'Report downloaded successfully' }
    } catch (error) {
      console.error('Error generating PDF:', error)
      return { success: false, message: 'Failed to generate PDF report' }
    }
  }

  // Generate PDF blob for preview or further processing
  async generatePDFBlob(ReportComponent, data) {
    try {
      const blob = await pdf(React.createElement(ReportComponent, { ...data, showPreview: false })).toBlob()
      return { success: true, blob }
    } catch (error) {
      console.error('Error generating PDF blob:', error)
      return { success: false, error }
    }
  }

  // Generate filename with timestamp
  generateFilename(reportType, outletName = 'outlet') {
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss')
    const sanitizedName = outletName.replace(/[^a-zA-Z0-9]/g, '_')
    return `${reportType}_${sanitizedName}_${timestamp}.pdf`
  }

  // Get report data based on type
  async getReportData(reportType, outletId, dateRange = null) {
    try {
      const baseData = {
        reportType,
        dateRange,
        timestamp: new Date().toISOString()
      }

      switch (reportType) {
        case 'comprehensive':
          return await this.getComprehensiveReportData(outletId, dateRange)
        
        case 'sales':
          return await this.getSalesReportData(outletId, dateRange)
        
        case 'staff':
          return await this.getStaffReportData(outletId, dateRange)
        
        case 'inventory':
          return await this.getInventoryReportData(outletId, dateRange)
        
        case 'financial':
          return await this.getFinancialReportData(outletId, dateRange)
        
        case 'performance':
          return await this.getPerformanceReportData(outletId, dateRange)
        
        default:
          return await this.getComprehensiveReportData(outletId, dateRange)
      }
    } catch (error) {
      console.error('Error getting report data:', error)
      throw error
    }
  }

  // Comprehensive report data
  async getComprehensiveReportData(outletId, dateRange) {
    // In a real app, this would fetch from your API
    // For now, we'll use mock data
    const mockData = {
      outlet: {
        id: outletId,
        name: 'SmartOutlet Downtown',
        address: '123 Main Street, Downtown, City',
        phone: '+1 (555) 123-4567',
        email: 'downtown@smartoutlet.com',
        manager: 'John Smith',
        status: 'ACTIVE',
        openingHours: '9:00 AM - 10:00 PM',
        createdAt: '2024-01-15T00:00:00Z'
      },
      performance: {
        salesToday: 28450,
        ordersToday: 156,
        wastePercentage: 4.2,
        profitToday: 8520,
        salesYesterday: 25100,
        ordersYesterday: 142,
        wasteYesterday: 5.1,
        profitYesterday: 7530
      },
      staff: [
        {
          id: 1,
          name: 'John Smith',
          role: 'Manager',
          email: 'john.smith@smartoutlet.com',
          phone: '+1 (555) 123-4567',
          status: 'ACTIVE',
          outletId: outletId
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          role: 'Cashier',
          email: 'sarah.johnson@smartoutlet.com',
          phone: '+1 (555) 123-4568',
          status: 'ACTIVE',
          outletId: outletId
        },
        {
          id: 3,
          name: 'Mike Davis',
          role: 'Stock Clerk',
          email: 'mike.davis@smartoutlet.com',
          phone: '+1 (555) 123-4569',
          status: 'ACTIVE',
          outletId: outletId
        }
      ],
      expenses: [
        {
          id: 1,
          category: 'Utilities',
          amount: 1250,
          date: '2024-12-19T00:00:00Z',
          description: 'Electricity and water bills'
        },
        {
          id: 2,
          category: 'Inventory',
          amount: 8500,
          date: '2024-12-18T00:00:00Z',
          description: 'Stock replenishment'
        },
        {
          id: 3,
          category: 'Maintenance',
          amount: 450,
          date: '2024-12-17T00:00:00Z',
          description: 'Equipment maintenance'
        }
      ],
      inventory: [
        {
          id: 1,
          name: 'iPhone 15 Pro',
          category: 'Electronics',
          quantity: 25,
          price: 999,
          status: 'IN_STOCK'
        },
        {
          id: 2,
          name: 'Samsung Galaxy S24',
          category: 'Electronics',
          quantity: 18,
          price: 899,
          status: 'IN_STOCK'
        }
      ],
      notices: [
        {
          id: 1,
          title: 'Low Stock Alert',
          message: 'iPhone 15 Pro stock is below minimum level (5 units remaining)',
          type: 'WARNING',
          priority: 'HIGH',
          createdAt: '2024-12-19T16:30:00Z',
          read: false
        },
        {
          id: 2,
          title: 'Staff Meeting Reminder',
          message: 'Weekly staff meeting scheduled for tomorrow at 9:00 AM',
          type: 'INFO',
          priority: 'MEDIUM',
          createdAt: '2024-12-19T14:00:00Z',
          read: true
        }
      ]
    }

    return mockData
  }

  // Sales report data
  async getSalesReportData(outletId, dateRange) {
    const comprehensiveData = await this.getComprehensiveReportData(outletId, dateRange)
    return {
      ...comprehensiveData,
      reportType: 'sales',
      salesData: [
        { date: '2024-12-13', sales: 1200, orders: 45, waste: 5 },
        { date: '2024-12-14', sales: 1800, orders: 67, waste: 3 },
        { date: '2024-12-15', sales: 1500, orders: 52, waste: 7 },
        { date: '2024-12-16', sales: 2200, orders: 78, waste: 4 },
        { date: '2024-12-17', sales: 2800, orders: 89, waste: 6 },
        { date: '2024-12-18', sales: 3200, orders: 95, waste: 8 },
        { date: '2024-12-19', sales: 2845, orders: 156, waste: 4.2 }
      ]
    }
  }

  // Staff report data
  async getStaffReportData(outletId, dateRange) {
    const comprehensiveData = await this.getComprehensiveReportData(outletId, dateRange)
    return {
      ...comprehensiveData,
      reportType: 'staff',
      staffMetrics: {
        totalStaff: comprehensiveData.staff.length,
        activeStaff: comprehensiveData.staff.filter(s => s.status === 'ACTIVE').length,
        averageTenure: '2.5 years',
        turnoverRate: '8%'
      }
    }
  }

  // Inventory report data
  async getInventoryReportData(outletId, dateRange) {
    const comprehensiveData = await this.getComprehensiveReportData(outletId, dateRange)
    return {
      ...comprehensiveData,
      reportType: 'inventory',
      inventoryMetrics: {
        totalItems: comprehensiveData.inventory.length,
        totalValue: comprehensiveData.inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0),
        lowStockItems: comprehensiveData.inventory.filter(item => item.quantity < 10).length,
        outOfStockItems: comprehensiveData.inventory.filter(item => item.quantity === 0).length
      }
    }
  }

  // Financial report data
  async getFinancialReportData(outletId, dateRange) {
    const comprehensiveData = await this.getComprehensiveReportData(outletId, dateRange)
    return {
      ...comprehensiveData,
      reportType: 'financial',
      financialMetrics: {
        totalRevenue: comprehensiveData.performance.salesToday,
        totalExpenses: comprehensiveData.expenses.reduce((sum, exp) => sum + exp.amount, 0),
        netProfit: comprehensiveData.performance.profitToday,
        profitMargin: ((comprehensiveData.performance.profitToday / comprehensiveData.performance.salesToday) * 100).toFixed(2)
      }
    }
  }

  // Performance report data
  async getPerformanceReportData(outletId, dateRange) {
    const comprehensiveData = await this.getComprehensiveReportData(outletId, dateRange)
    return {
      ...comprehensiveData,
      reportType: 'performance',
      performanceMetrics: {
        salesGrowth: ((comprehensiveData.performance.salesToday - comprehensiveData.performance.salesYesterday) / comprehensiveData.performance.salesYesterday * 100).toFixed(2),
        orderGrowth: ((comprehensiveData.performance.ordersToday - comprehensiveData.performance.ordersYesterday) / comprehensiveData.performance.ordersYesterday * 100).toFixed(2),
        wasteReduction: ((comprehensiveData.performance.wasteYesterday - comprehensiveData.performance.wastePercentage) / comprehensiveData.performance.wasteYesterday * 100).toFixed(2),
        profitGrowth: ((comprehensiveData.performance.profitToday - comprehensiveData.performance.profitYesterday) / comprehensiveData.performance.profitYesterday * 100).toFixed(2)
      }
    }
  }

  // Get available report types
  getAvailableReportTypes() {
    return [
      {
        id: 'comprehensive',
        name: 'Comprehensive Report',
        description: 'Complete outlet overview with all data',
        icon: '📊'
      },
      {
        id: 'sales',
        name: 'Sales Report',
        description: 'Sales performance and trends',
        icon: '💰'
      },
      {
        id: 'staff',
        name: 'Staff Report',
        description: 'Staff management and metrics',
        icon: '👥'
      },
      {
        id: 'inventory',
        name: 'Inventory Report',
        description: 'Stock levels and inventory status',
        icon: '📦'
      },
      {
        id: 'financial',
        name: 'Financial Report',
        description: 'Financial summary and expenses',
        icon: '💳'
      },
      {
        id: 'performance',
        name: 'Performance Report',
        description: 'Performance metrics and KPIs',
        icon: '📈'
      }
    ]
  }

  // Get date range options
  getDateRangeOptions() {
    return [
      {
        id: 'today',
        name: 'Today',
        value: { start: format(new Date(), 'yyyy-MM-dd'), end: format(new Date(), 'yyyy-MM-dd') }
      },
      {
        id: 'yesterday',
        name: 'Yesterday',
        value: { 
          start: format(new Date(Date.now() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), 
          end: format(new Date(Date.now() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd') 
        }
      },
      {
        id: 'last7days',
        name: 'Last 7 Days',
        value: { 
          start: format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), 
          end: format(new Date(), 'yyyy-MM-dd') 
        }
      },
      {
        id: 'last30days',
        name: 'Last 30 Days',
        value: { 
          start: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), 
          end: format(new Date(), 'yyyy-MM-dd') 
        }
      },
      {
        id: 'thisMonth',
        name: 'This Month',
        value: { 
          start: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'), 
          end: format(new Date(), 'yyyy-MM-dd') 
        }
      },
      {
        id: 'lastMonth',
        name: 'Last Month',
        value: { 
          start: format(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), 'yyyy-MM-dd'), 
          end: format(new Date(new Date().getFullYear(), new Date().getMonth(), 0), 'yyyy-MM-dd') 
        }
      }
    ]
  }
}

export default new ReportService() 