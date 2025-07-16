import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  Users,
  Bell,
  CheckSquare
} from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

// AG Grid CSS
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

const isDev = import.meta.env.MODE === 'development';

// In dev, provide fallback values
const loading = isDev ? false : undefined;
const error = isDev ? null : undefined;

const OutletList = () => {
  const [outlets, setOutlets] = useState([])
  const [filteredOutlets, setFilteredOutlets] = useState([])
  
  const [gridApi, setGridApi] = useState(null)
  const [columnApi, setColumnApi] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Fetch outlets on component mount
  useEffect(() => {
    // Mock data for development
    const mockOutlets = [
      {
        id: 1,
        name: 'Main Outlet',
        manager: 'John Doe',
        status: 'ACTIVE',
        staff: ['Alice', 'Bob', 'Charlie'],
        notices: ['Notice 1', 'Notice 2'],
        tasks: [{ id: 1, name: 'Task A', status: 'PENDING' }, { id: 2, name: 'Task B', status: 'COMPLETED' }],
        createdAt: '2023-01-01T10:00:00Z',
        address: '123 Main St, City A'
      },
      {
        id: 2,
        name: 'Branch Outlet',
        manager: 'Jane Smith',
        status: 'INACTIVE',
        staff: ['David', 'Eve'],
        notices: [],
        tasks: [{ id: 3, name: 'Task C', status: 'PENDING' }],
        createdAt: '2023-02-15T14:30:00Z',
        address: '456 Oak Ave, City B'
      },
      {
        id: 3,
        name: 'New Outlet',
        manager: 'Peter Jones',
        status: 'ACTIVE',
        staff: ['Frank', 'Grace'],
        notices: ['Notice 3'],
        tasks: [],
        createdAt: '2023-03-20T09:15:00Z',
        address: '789 Pine Ln, City A'
      }
    ];
    setOutlets(mockOutlets);
    setFilteredOutlets(mockOutlets);
  }, []);

  // Update filters when search or status changes
  useEffect(() => {
    const filtered = outlets.filter(outlet => {
      const matchesSearch = outlet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            outlet.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            outlet.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || outlet.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    setFilteredOutlets(filtered);
  }, [outlets, searchTerm, statusFilter]);

  // Column definitions
  const columnDefs = useMemo(() => [
    {
      headerName: 'Outlet Name',
      field: 'name',
      sortable: true,
      filter: true,
      flex: 2,
      cellRenderer: (params) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
            <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
              {params.value.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {params.value}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {params.data.address}
            </div>
          </div>
        </div>
      )
    },
    {
      headerName: 'Manager',
      field: 'manager',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: (params) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          params.value === 'ACTIVE' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {params.value}
        </span>
      )
    },
    {
      headerName: 'Staff',
      field: 'staff',
      sortable: true,
      filter: false,
      flex: 1,
      cellRenderer: (params) => (
        <div className="flex items-center space-x-1">
          <Users className="h-4 w-4 text-gray-400" />
          <span>{params.value?.length || 0} members</span>
        </div>
      )
    },
    {
      headerName: 'Notices',
      field: 'notices',
      sortable: true,
      filter: false,
      flex: 1,
      cellRenderer: (params) => (
        <div className="flex items-center space-x-1">
          <Bell className="h-4 w-4 text-gray-400" />
          <span>{params.value?.length || 0} active</span>
        </div>
      )
    },
    {
      headerName: 'Tasks',
      field: 'tasks',
      sortable: true,
      filter: false,
      flex: 1,
      cellRenderer: (params) => {
        const pendingTasks = params.value?.filter(task => task.status === 'PENDING').length || 0
        return (
          <div className="flex items-center space-x-1">
            <CheckSquare className="h-4 w-4 text-gray-400" />
            <span>{pendingTasks} pending</span>
          </div>
        )
      }
    },
    {
      headerName: 'Created',
      field: 'createdAt',
      sortable: true,
      filter: false,
      flex: 1,
      cellRenderer: (params) => format(new Date(params.value), 'MMM dd, yyyy')
    },
    {
      headerName: 'Actions',
      field: 'actions',
      sortable: false,
      filter: false,
      flex: 1.5,
      cellRenderer: (params) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewOutlet(params.data)}
            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEditOutlet(params.data)}
            className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
            title="Edit Outlet"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteOutlet(params.data)}
            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            title="Delete Outlet"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ], [])

  // Grid options
  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
  }), [])

  // Event handlers
  const onGridReady = useCallback((params) => {
    setGridApi(params.api)
    setColumnApi(params.columnApi)
  }, [])

  const handleViewOutlet = useCallback((outlet) => {
    toast.info(`Viewing details for ${outlet.name}`)
  }, [])

  const handleEditOutlet = useCallback((outlet) => {
    toast.info(`Editing outlet: ${outlet.name}`)
  }, [])

  const handleDeleteOutlet = useCallback((outlet) => {
    toast.info(`Deleting outlet: ${outlet.name}`)
  }, [])

  const handleAddOutlet = useCallback(() => {
    toast.info('Adding new outlet...')
  }, [])

  const handleExport = useCallback((format) => {
    if (gridApi) {
      switch (format) {
        case 'csv':
          gridApi.exportDataAsCsv()
          break
        case 'excel':
          gridApi.exportDataAsExcel()
          break
        case 'pdf':
          // PDF export would need additional setup
          toast.info('PDF export coming soon!')
          break
        default:
          break
      }
    }
  }, [gridApi])

  const handlePrint = useCallback(() => {
    if (gridApi) {
      gridApi.exportDataAsCsv()
      window.print()
    }
  }, [gridApi])

  const handleRefresh = useCallback(() => {
    toast.success('Data refreshed successfully')
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearchTerm('')
    setStatusFilter('ALL')
    if (gridApi) {
      gridApi.setFilterModel(null)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">Error: {error}</p>
        <button 
          onClick={handleRefresh}
          className="mt-4 btn-secondary"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Outlet Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your SmartOutlet locations, staff, and operations
          </p>
        </div>
        <button
          onClick={handleAddOutlet}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Outlet</span>
        </button>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search outlets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleClearFilters}
              className="btn-secondary flex items-center space-x-1"
            >
              <Filter className="h-4 w-4" />
              <span>Clear</span>
            </button>
            <button
              onClick={handleRefresh}
              className="btn-secondary flex items-center space-x-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Export Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredOutlets.length} outlets found
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExport('csv')}
              className="btn-secondary flex items-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="btn-secondary flex items-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>Excel</span>
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="btn-secondary flex items-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="btn-secondary flex items-center space-x-1"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* AG Grid */}
      <div className="ag-theme-coral w-full h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <AgGridReact
          rowData={filteredOutlets}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          animateRows={true}
          rowSelection="single"
          suppressRowClickSelection={true}
          domLayout="normal"
          className="ag-theme-coral"
        />
      </div>
    </div>
  )
}

export default OutletList 