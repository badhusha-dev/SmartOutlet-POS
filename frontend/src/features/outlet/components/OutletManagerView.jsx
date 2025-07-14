import React, { useState, useEffect, useMemo, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  AlertTriangle,
  TrendingUp,
  MapPin,
  Clock,
  Phone,
  Mail,
  User,
  Users,
  BarChart3,
  Bell,
  Settings,
  Edit,
  Plus,
  CheckCircle,
  XCircle,
  Download,
  Filter,
  FileText
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
import outletService from '../outletService'
import { useAppSelector } from '../../../store/hooks'
import { selectUser, selectIsDevMode } from '../../../store/slices/authSlice'
import ReportGeneratorModal from '../../report/components/ReportGeneratorModal'

// Custom cell renderers for AG Grid
const StaffStatusRenderer = ({ value }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'INACTIVE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'ON_LEAVE':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
      {value.replace('_', ' ')}
    </span>
  )
}

const StaffActionsRenderer = ({ data, onEdit }) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onEdit(data)}
        className="p-1 text-coral-600 hover:text-coral-700 dark:text-coral-400 dark:hover:text-coral-300 rounded hover:bg-coral-50 dark:hover:bg-coral-900/20"
        title="Edit Staff"
      >
        <Edit className="h-4 w-4" />
      </button>
    </div>
  )
}

const NoticeTypeRenderer = ({ value }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'SUCCESS':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'INFO':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(value)}`}>
      {value}
    </span>
  )
}

const NoticeActionsRenderer = ({ data, onEdit, onMarkRead }) => {
  return (
    <div className="flex items-center space-x-2">
      {!data.read && (
        <button
          onClick={() => onMarkRead(data.id)}
          className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
          title="Mark as Read"
        >
          <CheckCircle className="h-4 w-4" />
        </button>
      )}
      <button
        onClick={() => onEdit(data)}
        className="p-1 text-coral-600 hover:text-coral-700 dark:text-coral-400 dark:hover:text-coral-300 rounded hover:bg-coral-50 dark:hover:bg-coral-900/20"
        title="Edit Notice"
      >
        <Edit className="h-4 w-4" />
      </button>
    </div>
  )
}

const OutletManagerView = ({ assignedOutlet }) => {
  const [outlet, setOutlet] = useState(null)
  const [performance, setPerformance] = useState(null)
  const [staff, setStaff] = useState([])
  const [expenses, setExpenses] = useState([])
  const [inventory, setInventory] = useState([])
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showReportModal, setShowReportModal] = useState(false)
  const user = useAppSelector(selectUser)
  const isDevMode = useAppSelector(selectIsDevMode)

  // AG Grid refs
  const staffGridRef = useRef()
  const noticesGridRef = useRef()

  useEffect(() => {
    if (assignedOutlet?.id) {
      loadOutletData()
    }
  }, [assignedOutlet])

  const loadOutletData = async () => {
    try {
      setLoading(true)
      
      // Load all outlet data
      const [outletRes, performanceRes, staffRes, expensesRes, inventoryRes] = await Promise.all([
        outletService.getOutletById(assignedOutlet.id),
        outletService.getOutletPerformance(assignedOutlet.id),
        outletService.getStaff(),
        outletService.getOutletExpenses(assignedOutlet.id),
        outletService.getOutletInventory(assignedOutlet.id)
      ])
      
      setOutlet(outletRes.data)
      setPerformance(performanceRes.data)
      setStaff(staffRes.data.filter(s => s.outletId === assignedOutlet.id))
      setExpenses(expensesRes.data)
      setInventory(inventoryRes.data)
      
      // Mock notices
      setNotices([
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
        },
        {
          id: 3,
          title: 'Performance Target Achieved',
          message: 'Congratulations! This outlet has exceeded monthly sales target by 15%',
          type: 'SUCCESS',
          priority: 'LOW',
          createdAt: '2024-12-19T12:00:00Z',
          read: false
        }
      ])
      
    } catch (error) {
      console.error('Failed to load outlet data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mock chart data
  const salesData = [
    { name: 'Mon', sales: 1200, waste: 5 },
    { name: 'Tue', sales: 1800, waste: 3 },
    { name: 'Wed', sales: 1500, waste: 7 },
    { name: 'Thu', sales: 2200, waste: 4 },
    { name: 'Fri', sales: 2800, waste: 6 },
    { name: 'Sat', sales: 3200, waste: 8 },
    { name: 'Sun', sales: 2400, waste: 5 }
  ]

  const categoryData = [
    { name: 'Electronics', value: 45, color: '#3b82f6' },
    { name: 'Clothing', value: 25, color: '#10b981' },
    { name: 'Food & Beverage', value: 20, color: '#f59e0b' },
    { name: 'Others', value: 10, color: '#8b5cf6' }
  ]

  // AG Grid column definitions for staff
  const staffColumnDefs = useMemo(() => [
    {
      headerName: 'Staff Member',
      field: 'name',
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 200,
      cellRenderer: (params) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{params.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{params.data.role}</div>
          </div>
        </div>
      )
    },
    {
      headerName: 'Contact',
      field: 'email',
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 200,
      cellRenderer: (params) => (
        <div className="text-sm">
          <div className="text-gray-900 dark:text-white">{params.value}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{params.data.phone}</div>
        </div>
      )
    },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 120,
      cellRenderer: StaffStatusRenderer
    },
    {
      headerName: 'Actions',
      sortable: false,
      filter: false,
      resizable: false,
      minWidth: 100,
      cellRenderer: StaffActionsRenderer,
      cellRendererParams: {
        onEdit: (staff) => console.log('Edit staff:', staff)
      }
    }
  ], [])

  // AG Grid column definitions for notices
  const noticesColumnDefs = useMemo(() => [
    {
      headerName: 'Notice',
      field: 'title',
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 200,
      cellRenderer: (params) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900 dark:text-white">{params.value}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{params.data.message}</div>
        </div>
      )
    },
    {
      headerName: 'Type',
      field: 'type',
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 100,
      cellRenderer: NoticeTypeRenderer
    },
    {
      headerName: 'Priority',
      field: 'priority',
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 100
    },
    {
      headerName: 'Date',
      field: 'createdAt',
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 150,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString()
    },
    {
      headerName: 'Actions',
      sortable: false,
      filter: false,
      resizable: false,
      minWidth: 120,
      cellRenderer: NoticeActionsRenderer,
      cellRendererParams: {
        onEdit: (notice) => console.log('Edit notice:', notice),
        onMarkRead: (id) => {
          setNotices(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
        }
      }
    }
  ], [])

  // AG Grid default column definition
  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 100,
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
    suppressMenu: false,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab']
  }), [])

  const handleExportStaff = () => {
    const params = {
      fileName: 'staff-export.csv',
      columnSeparator: ',',
      suppressQuotes: true
    }
    staffGridRef.current.api.exportDataAsCsv(params)
  }

  const handleExportNotices = () => {
    const params = {
      fileName: 'notices-export.csv',
      columnSeparator: ',',
      suppressQuotes: true
    }
    noticesGridRef.current.api.exportDataAsCsv(params)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-600"></div>
      </div>
    )
  }

  if (!outlet) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Access Restricted
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          You don't have permission to view outlet information.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {outlet.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manager Dashboard • Welcome, {user?.firstName || user?.username}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 px-3 py-1 bg-coral-100 dark:bg-coral-900/20 rounded-full">
              <User className="h-4 w-4 text-coral-600 dark:text-coral-400" />
              <span className="text-sm text-coral-600 dark:text-coral-400">Manager</span>
            </div>
            <button
              onClick={() => setShowReportModal(true)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Generate report"
            >
              <FileText className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Outlet Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{outlet.address}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{outlet.openingHours}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4" />
            <span>{outlet.phone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>{outlet.email}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Today's Sales
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total revenue
                </p>
              </div>
            </div>
          </div>
          
          {performance ? (
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ${performance.salesToday.toLocaleString()}
              </p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+{performance.salesToday > 2000 ? '15.2' : '8.7'}% from yesterday</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Data unavailable</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Waste %
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Today's waste rate
                </p>
              </div>
            </div>
          </div>
          
          {performance ? (
            <div>
              <p className={`text-3xl font-bold ${
                performance.wastePercentage <= 5 ? 'text-green-600' :
                performance.wastePercentage <= 10 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {performance.wastePercentage}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Target: &lt;5%
              </p>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Data unavailable</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Profit Today
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Net profit
                </p>
              </div>
            </div>
          </div>
          
          {performance ? (
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ${performance.profitToday.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Margin: {((performance.profitToday / performance.salesToday) * 100).toFixed(1)}%
              </p>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Data unavailable</p>
          )}
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        {/* Tab Headers */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'staff', label: 'Assigned Staff', icon: Users },
              { id: 'notices', label: 'Notices', icon: Bell }
            ].map((tab) => {
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
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Sales vs Waste Chart */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Sales vs Waste - Weekly Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stackId="1"
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.3}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="waste" 
                      stackId="2"
                      stroke="#f59e0b" 
                      fill="#f59e0b" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Category Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Sales by Category
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
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

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Staff</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{staff.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Active Inventory</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{inventory.length} items</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Monthly Expenses</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Unread Notices</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {notices.filter(n => !n.read).length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'staff' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Assigned Staff ({staff.length})
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleExportStaff}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Export staff data"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="btn-primary px-4 py-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Staff
                  </button>
                </div>
              </div>
              
              <div className="ag-grid-container">
                <div 
                  className="ag-theme-alpine w-full"
                  style={{ height: '400px' }}
                >
                  <AgGridReact
                    ref={staffGridRef}
                    rowData={staff}
                    columnDefs={staffColumnDefs}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationPageSize={10}
                    animateRows={true}
                    enableCellTextSelection={true}
                    suppressRowClickSelection={true}
                    suppressCellFocus={true}
                    onGridReady={(params) => {
                      params.api.sizeColumnsToFit()
                    }}
                    onFirstDataRendered={(params) => {
                      params.api.sizeColumnsToFit()
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'notices' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Internal Notices ({notices.length})
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleExportNotices}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Export notices data"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="btn-primary px-4 py-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Notice
                  </button>
                </div>
              </div>
              
              <div className="ag-grid-container">
                <div 
                  className="ag-theme-alpine w-full"
                  style={{ height: '400px' }}
                >
                  <AgGridReact
                    ref={noticesGridRef}
                    rowData={notices}
                    columnDefs={noticesColumnDefs}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationPageSize={10}
                    animateRows={true}
                    enableCellTextSelection={true}
                    suppressRowClickSelection={true}
                    suppressCellFocus={true}
                    onGridReady={(params) => {
                      params.api.sizeColumnsToFit()
                    }}
                    onFirstDataRendered={(params) => {
                      params.api.sizeColumnsToFit()
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Development Mode Indicator */}
      {isDevMode && (
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              🔓 Dev Mode - Manager Role • {user?.username}
            </span>
          </div>
        </div>
      )}

      {/* Report Generator Modal */}
      <ReportGeneratorModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        outlet={outlet}
        performance={performance}
        staff={staff}
        expenses={expenses}
        inventory={inventory}
        notices={notices}
      />
    </div>
  )
}

export default OutletManagerView 