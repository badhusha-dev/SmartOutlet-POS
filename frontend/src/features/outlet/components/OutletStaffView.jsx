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
  List,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Download,
  Filter
} from 'lucide-react'
import outletService from '../outletService'
import { useAppSelector } from '../../../store/hooks'
import { selectUser, selectIsDevMode } from '../../../store/slices/authSlice'

// Custom cell renderers for AG Grid
const TaskStatusRenderer = ({ value }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'PENDING':
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

const TaskPriorityRenderer = ({ value }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'text-red-600 dark:text-red-400'
      case 'MEDIUM':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'LOW':
        return 'text-green-600 dark:text-green-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <span className={`font-medium ${getPriorityColor(value)}`}>
      {value}
    </span>
  )
}

const TaskActionsRenderer = ({ data, onStart, onComplete }) => {
  return (
    <div className="flex items-center space-x-2">
      {data.status === 'PENDING' && (
        <button
          onClick={() => onStart(data.id)}
          className="px-3 py-1 bg-coral-100 dark:bg-coral-900/20 text-coral-600 dark:text-coral-400 rounded-md text-sm hover:bg-coral-200 dark:hover:bg-coral-900/40 transition-colors"
        >
          Start
        </button>
      )}
      {data.status === 'IN_PROGRESS' && (
        <button
          onClick={() => onComplete(data.id)}
          className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-md text-sm hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
        >
          Complete
        </button>
      )}
    </div>
  )
}

const OutletStaffView = ({ assignedOutlet }) => {
  const [outlet, setOutlet] = useState(null)
  const [performance, setPerformance] = useState(null)
  const [loading, setLoading] = useState(true)
  const user = useAppSelector(selectUser)
  const isDevMode = useAppSelector(selectIsDevMode)

  // AG Grid ref
  const tasksGridRef = useRef()

  // Mock assigned tasks for staff
  const [assignedTasks] = useState([
    {
      id: 1,
      title: 'Restock Electronics Section',
      description: 'Check and restock iPhone 15 Pro and Samsung Galaxy S24',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: '2024-12-19T18:00:00Z',
      assignedBy: 'John Smith'
    },
    {
      id: 2,
      title: 'Update Price Tags',
      description: 'Update price tags for all clothing items',
      status: 'COMPLETED',
      priority: 'MEDIUM',
      dueDate: '2024-12-19T16:00:00Z',
      assignedBy: 'John Smith'
    },
    {
      id: 3,
      title: 'Customer Service Training',
      description: 'Complete online customer service training module',
      status: 'PENDING',
      priority: 'LOW',
      dueDate: '2024-12-20T17:00:00Z',
      assignedBy: 'John Smith'
    },
    {
      id: 4,
      title: 'Inventory Count',
      description: 'Count inventory for food & beverage section',
      status: 'PENDING',
      priority: 'HIGH',
      dueDate: '2024-12-19T20:00:00Z',
      assignedBy: 'John Smith'
    }
  ])

  useEffect(() => {
    if (assignedOutlet?.id) {
      loadOutletData()
    }
  }, [assignedOutlet])

  const loadOutletData = async () => {
    try {
      setLoading(true)
      
      // Load outlet details
      const outletResponse = await outletService.getOutletById(assignedOutlet.id)
      setOutlet(outletResponse.data)
      
      // Load performance data
      const performanceResponse = await outletService.getOutletPerformance(assignedOutlet.id)
      setPerformance(performanceResponse.data)
      
    } catch (error) {
      console.error('Failed to load outlet data:', error)
    } finally {
      setLoading(false)
    }
  }

  // AG Grid column definitions for tasks
  const tasksColumnDefs = useMemo(() => [
    {
      headerName: 'Task',
      field: 'title',
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 250,
      cellRenderer: (params) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900 dark:text-white">{params.value}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{params.data.description}</div>
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
      cellRenderer: TaskStatusRenderer
    },
    {
      headerName: 'Priority',
      field: 'priority',
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 100,
      cellRenderer: TaskPriorityRenderer
    },
    {
      headerName: 'Due Date',
      field: 'dueDate',
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 150,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString()
    },
    {
      headerName: 'Assigned By',
      field: 'assignedBy',
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 150
    },
    {
      headerName: 'Actions',
      sortable: false,
      filter: false,
      resizable: false,
      minWidth: 120,
      cellRenderer: TaskActionsRenderer,
      cellRendererParams: {
        onStart: (id) => {
          console.log('Start task:', id)
          // Update task status logic here
        },
        onComplete: (id) => {
          console.log('Complete task:', id)
          // Update task status logic here
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

  const handleExportTasks = () => {
    const params = {
      fileName: 'tasks-export.csv',
      columnSeparator: ',',
      suppressQuotes: true
    }
    tasksGridRef.current.api.exportDataAsCsv(params)
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
              Staff Dashboard • Welcome, {user?.firstName || user?.username}
            </p>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1 bg-coral-100 dark:bg-coral-900/20 rounded-full">
            <User className="h-4 w-4 text-coral-600 dark:text-coral-400" />
            <span className="text-sm text-coral-600 dark:text-coral-400">Staff Access</span>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  Total revenue for today
                </p>
              </div>
            </div>
          </div>
          
          {performance ? (
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ${performance.salesToday.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {performance.ordersToday} orders today
              </p>
              <div className="mt-3 flex items-center justify-center space-x-1 text-sm text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>+12.5% from yesterday</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400">Data unavailable</p>
            </div>
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
                  Waste Percentage
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Today's waste rate
                </p>
              </div>
            </div>
          </div>
          
          {performance ? (
            <div className="text-center">
              <p className={`text-3xl font-bold ${
                performance.wastePercentage <= 5 ? 'text-green-600' :
                performance.wastePercentage <= 10 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {performance.wastePercentage}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {performance.wastePercentage <= 5 ? 'Excellent' :
                 performance.wastePercentage <= 10 ? 'Good' : 'Needs attention'}
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400">Data unavailable</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Assigned Tasks with AG Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <List className="h-5 w-5 text-coral-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Assigned Tasks
            </h3>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {assignedTasks.filter(task => task.status === 'COMPLETED').length} of {assignedTasks.length} completed
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportTasks}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Export tasks data"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="ag-grid-container">
          <div 
            className="ag-theme-alpine w-full"
            style={{ height: '400px' }}
          >
            <AgGridReact
              ref={tasksGridRef}
              rowData={assignedTasks}
              columnDefs={tasksColumnDefs}
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

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <List className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">View Tasks</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Check assigned tasks</p>
              </div>
            </div>
          </button>
          
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Sales Report</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">View today's sales</p>
              </div>
            </div>
          </button>
          
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Report Issue</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Report problems</p>
              </div>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Development Mode Indicator */}
      {isDevMode && (
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              🔓 Dev Mode - Staff Role • {user?.username}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default OutletStaffView 