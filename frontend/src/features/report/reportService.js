import { pdf } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'
import { format } from 'date-fns'
import React from 'react'
import { api, API_ENDPOINTS } from '../../services/client'

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
    try {
      const response = await api.get(API_ENDPOINTS.GET_COMPREHENSIVE_REPORT, { params: { outletId, dateRange } })
      return response.data
    } catch (error) {
      console.error('Error fetching comprehensive report data:', error)
      throw error
    }
  }

  // Sales report data
  async getSalesReportData(outletId, dateRange) {
    try {
      const response = await api.get(API_ENDPOINTS.GET_SALES_REPORT, { params: { outletId, dateRange } })
      return response.data
    } catch (error) {
      console.error('Error fetching sales report data:', error)
      throw error
    }
  }

  // Staff report data
  async getStaffReportData(outletId, dateRange) {
    try {
      const response = await api.get(API_ENDPOINTS.GET_STAFF_REPORT, { params: { outletId, dateRange } })
      return response.data
    } catch (error) {
      console.error('Error fetching staff report data:', error)
      throw error
    }
  }

  // Inventory report data
  async getInventoryReportData(outletId, dateRange) {
    try {
      const response = await api.get(API_ENDPOINTS.GET_INVENTORY_REPORT, { params: { outletId, dateRange } })
      return response.data
    } catch (error) {
      console.error('Error fetching inventory report data:', error)
      throw error
    }
  }

  // Financial report data
  async getFinancialReportData(outletId, dateRange) {
    try {
      const response = await api.get(API_ENDPOINTS.GET_FINANCIAL_REPORT, { params: { outletId, dateRange } })
      return response.data
    } catch (error) {
      console.error('Error fetching financial report data:', error)
      throw error
    }
  }

  // Performance report data
  async getPerformanceReportData(outletId, dateRange) {
    try {
      const response = await api.get(API_ENDPOINTS.GET_PERFORMANCE_REPORT, { params: { outletId, dateRange } })
      return response.data
    } catch (error) {
      console.error('Error fetching performance report data:', error)
      throw error
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