import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Download, 
  FileText, 
  Calendar, 
  Settings,
  Eye,
  Printer,
  Share2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import reportService from '../../services/reportService'
import OutletReport from './OutletReport'
import toast from 'react-hot-toast'

const ReportGeneratorModal = ({ 
  isOpen, 
  onClose, 
  outlet, 
  performance, 
  staff, 
  expenses, 
  inventory, 
  notices 
}) => {
  const [selectedReportType, setSelectedReportType] = useState('comprehensive')
  const [selectedDateRange, setSelectedDateRange] = useState('today')
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' })
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [reportData, setReportData] = useState(null)
  const [activeTab, setActiveTab] = useState('options') // 'options' or 'preview'

  const reportTypes = reportService.getAvailableReportTypes()
  const dateRangeOptions = reportService.getDateRangeOptions()

  useEffect(() => {
    if (isOpen) {
      loadReportData()
    }
  }, [isOpen, selectedReportType, selectedDateRange, customDateRange])

  const loadReportData = async () => {
    try {
      setIsGenerating(true)
      
      // Validate custom date range
      if (selectedDateRange === 'custom') {
        if (!customDateRange.start || !customDateRange.end) {
          toast.error('Please select both start and end dates')
          return
        }
        if (new Date(customDateRange.start) > new Date(customDateRange.end)) {
          toast.error('Start date cannot be after end date')
          return
        }
      }

      const dateRange = selectedDateRange === 'custom' 
        ? customDateRange 
        : dateRangeOptions.find(option => option.id === selectedDateRange)?.value

      const data = await reportService.getReportData(
        selectedReportType, 
        outlet?.id, 
        dateRange
      )
      
      setReportData(data)
    } catch (error) {
      console.error('Error loading report data:', error)
      toast.error('Failed to load report data: ' + (error.message || 'Unknown error'))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true)
      
      // Validate custom date range
      if (selectedDateRange === 'custom') {
        if (!customDateRange.start || !customDateRange.end) {
          toast.error('Please select both start and end dates')
          return
        }
        if (new Date(customDateRange.start) > new Date(customDateRange.end)) {
          toast.error('Start date cannot be after end date')
          return
        }
      }

      const dateRange = selectedDateRange === 'custom' 
        ? customDateRange 
        : dateRangeOptions.find(option => option.id === selectedDateRange)?.value

      const filename = reportService.generateFilename(
        selectedReportType, 
        outlet?.name
      )

      const result = await reportService.generateAndDownloadPDF(
        OutletReport,
        {
          ...reportData,
          reportType: selectedReportType,
          dateRange
        },
        filename
      )

      if (result.success) {
        toast.success('Report downloaded successfully!')
        onClose()
      } else {
        toast.error(result.message || 'Failed to generate report')
      }
    } catch (error) {
      console.error('Error generating report:', error)
      toast.error('Failed to generate report: ' + (error.message || 'Unknown error'))
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePreviewReport = () => {
    setShowPreview(true)
    setActiveTab('preview')
  }

  const handleBackToOptions = () => {
    setShowPreview(false)
    setActiveTab('options')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="inline-block w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl transform transition-all"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-coral-100 dark:bg-coral-900/20 rounded-lg">
                  <FileText className="h-5 w-5 text-coral-600 dark:text-coral-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Generate Report
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Create and download PDF reports
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'options' ? (
                <div className="space-y-6">
                  {/* Report Type Selection */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Report Type
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {reportTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedReportType(type.id)}
                          className={`p-4 border rounded-lg text-left transition-colors ${
                            selectedReportType === type.id
                              ? 'border-coral-500 bg-coral-50 dark:bg-coral-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{type.icon}</span>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {type.name}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {type.description}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Range Selection */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Date Range
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {dateRangeOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setSelectedDateRange(option.id)}
                          className={`p-3 border rounded-lg text-center transition-colors ${
                            selectedDateRange === option.id
                              ? 'border-coral-500 bg-coral-50 dark:bg-coral-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="font-medium text-gray-900 dark:text-white">
                            {option.name}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Custom Date Range */}
                    <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <input
                          type="checkbox"
                          id="customDateRange"
                          checked={selectedDateRange === 'custom'}
                          onChange={() => setSelectedDateRange('custom')}
                          className="rounded border-gray-300 text-coral-600 focus:ring-coral-500"
                        />
                        <label htmlFor="customDateRange" className="text-sm font-medium text-gray-900 dark:text-white">
                          Custom Date Range
                        </label>
                      </div>
                      {selectedDateRange === 'custom' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={customDateRange.start}
                              onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={customDateRange.end}
                              onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Report Summary */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Report Summary
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div>• Report Type: {reportTypes.find(t => t.id === selectedReportType)?.name}</div>
                      <div>• Date Range: {dateRangeOptions.find(d => d.id === selectedDateRange)?.name}</div>
                      <div>• Outlet: {outlet?.name}</div>
                      <div>• Generated: {new Date().toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Preview Tab */
                <div className="h-96">
                  {reportData ? (
                    <OutletReport
                      {...reportData}
                      showPreview={true}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Loading preview...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                {activeTab === 'preview' && (
                  <button
                    onClick={handleBackToOptions}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    ← Back to Options
                  </button>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                {activeTab === 'options' && (
                  <button
                    onClick={handlePreviewReport}
                    disabled={isGenerating || !reportData}
                    className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </button>
                )}
                
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleGenerateReport}
                  disabled={isGenerating || !reportData}
                  className="btn-primary px-6 py-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}

export default ReportGeneratorModal 