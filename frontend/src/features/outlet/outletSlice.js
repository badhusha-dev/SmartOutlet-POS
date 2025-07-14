import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '../../services/client'
import toast from 'react-hot-toast'

// Mock data for development
const MOCK_OUTLETS = [
  {
    id: 1,
    name: 'Downtown SmartOutlet',
    address: '123 Main St, Downtown',
    phone: '+1-555-0101',
    email: 'downtown@smartoutlet.com',
    manager: 'John Smith',
    status: 'ACTIVE',
    openingHours: '9:00 AM - 10:00 PM',
    createdAt: '2024-01-15T10:00:00Z',
    staff: [
      { id: 1, name: 'John Smith', role: 'MANAGER', email: 'john@smartoutlet.com', phone: '+1-555-0101', status: 'ACTIVE' },
      { id: 2, name: 'Sarah Johnson', role: 'STAFF', email: 'sarah@smartoutlet.com', phone: '+1-555-0102', status: 'ACTIVE' },
      { id: 3, name: 'Mike Wilson', role: 'STAFF', email: 'mike@smartoutlet.com', phone: '+1-555-0103', status: 'ACTIVE' },
    ],
    notices: [
      { id: 1, title: 'New Product Launch', content: 'Exciting new products arriving next week!', priority: 'HIGH', createdAt: '2024-01-20T09:00:00Z' },
      { id: 2, title: 'Staff Meeting', content: 'Monthly staff meeting this Friday at 3 PM', priority: 'MEDIUM', createdAt: '2024-01-19T14:00:00Z' },
    ],
    tasks: [
      { id: 1, title: 'Inventory Check', description: 'Complete monthly inventory check', status: 'PENDING', assignedTo: 'Sarah Johnson', dueDate: '2024-01-25T17:00:00Z' },
      { id: 2, title: 'Clean Display Area', description: 'Clean and organize product display area', status: 'IN_PROGRESS', assignedTo: 'Mike Wilson', dueDate: '2024-01-22T16:00:00Z' },
    ],
  },
  {
    id: 2,
    name: 'Mall SmartOutlet',
    address: '456 Mall Ave, Shopping Center',
    phone: '+1-555-0202',
    email: 'mall@smartoutlet.com',
    manager: 'Emily Davis',
    status: 'ACTIVE',
    openingHours: '10:00 AM - 9:00 PM',
    createdAt: '2024-01-10T11:00:00Z',
    staff: [
      { id: 4, name: 'Emily Davis', role: 'MANAGER', email: 'emily@smartoutlet.com', phone: '+1-555-0201', status: 'ACTIVE' },
      { id: 5, name: 'David Brown', role: 'STAFF', email: 'david@smartoutlet.com', phone: '+1-555-0202', status: 'ACTIVE' },
    ],
    notices: [
      { id: 3, title: 'Holiday Schedule', content: 'Modified hours for upcoming holiday weekend', priority: 'HIGH', createdAt: '2024-01-18T10:00:00Z' },
    ],
    tasks: [
      { id: 3, title: 'Update Pricing', description: 'Update price tags for seasonal items', status: 'COMPLETED', assignedTo: 'David Brown', dueDate: '2024-01-20T15:00:00Z' },
    ],
  },
]

// Async thunks
export const fetchOutlets = createAsyncThunk(
  'outlet/fetchOutlets',
  async (_, { rejectWithValue }) => {
    try {
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 1000))
      return MOCK_OUTLETS
    } catch (error) {
      return rejectWithValue('Failed to fetch outlets')
    }
  }
)

export const createOutlet = createAsyncThunk(
  'outlet/createOutlet',
  async (outletData, { rejectWithValue }) => {
    try {
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 500))
      const newOutlet = {
        id: Date.now(),
        ...outletData,
        createdAt: new Date().toISOString(),
        staff: [],
        notices: [],
        tasks: [],
      }
      toast.success('Outlet created successfully!')
      return newOutlet
    } catch (error) {
      toast.error('Failed to create outlet')
      return rejectWithValue('Failed to create outlet')
    }
  }
)

export const updateOutlet = createAsyncThunk(
  'outlet/updateOutlet',
  async ({ id, outletData }, { rejectWithValue }) => {
    try {
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('Outlet updated successfully!')
      return { id, ...outletData }
    } catch (error) {
      toast.error('Failed to update outlet')
      return rejectWithValue('Failed to update outlet')
    }
  }
)

export const deleteOutlet = createAsyncThunk(
  'outlet/deleteOutlet',
  async (id, { rejectWithValue }) => {
    try {
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('Outlet deleted successfully!')
      return id
    } catch (error) {
      toast.error('Failed to delete outlet')
      return rejectWithValue('Failed to delete outlet')
    }
  }
)

export const addStaffMember = createAsyncThunk(
  'outlet/addStaffMember',
  async ({ outletId, staffData }, { rejectWithValue }) => {
    try {
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 500))
      const newStaff = {
        id: Date.now(),
        ...staffData,
        status: 'ACTIVE',
      }
      toast.success('Staff member added successfully!')
      return { outletId, staff: newStaff }
    } catch (error) {
      toast.error('Failed to add staff member')
      return rejectWithValue('Failed to add staff member')
    }
  }
)

export const addNotice = createAsyncThunk(
  'outlet/addNotice',
  async ({ outletId, noticeData }, { rejectWithValue }) => {
    try {
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 500))
      const newNotice = {
        id: Date.now(),
        ...noticeData,
        createdAt: new Date().toISOString(),
      }
      toast.success('Notice added successfully!')
      return { outletId, notice: newNotice }
    } catch (error) {
      toast.error('Failed to add notice')
      return rejectWithValue('Failed to add notice')
    }
  }
)

export const addTask = createAsyncThunk(
  'outlet/addTask',
  async ({ outletId, taskData }, { rejectWithValue }) => {
    try {
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 500))
      const newTask = {
        id: Date.now(),
        ...taskData,
        status: 'PENDING',
      }
      toast.success('Task added successfully!')
      return { outletId, task: newTask }
    } catch (error) {
      toast.error('Failed to add task')
      return rejectWithValue('Failed to add task')
    }
  }
)

// Initial state
const initialState = {
  outlets: [],
  selectedOutlet: null,
  loading: false,
  error: null,
  filters: {
    status: 'ALL',
    search: '',
  },
}

// Outlet slice
const outletSlice = createSlice({
  name: 'outlet',
  initialState,
  reducers: {
    setSelectedOutlet: (state, action) => {
      state.selectedOutlet = action.payload
    },
    clearSelectedOutlet: (state) => {
      state.selectedOutlet = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = { status: 'ALL', search: '' }
    },
    updateTaskStatus: (state, action) => {
      const { outletId, taskId, status } = action.payload
      const outlet = state.outlets.find(o => o.id === outletId)
      if (outlet) {
        const task = outlet.tasks.find(t => t.id === taskId)
        if (task) {
          task.status = status
        }
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch outlets
      .addCase(fetchOutlets.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOutlets.fulfilled, (state, action) => {
        state.loading = false
        state.outlets = action.payload
        state.error = null
      })
      .addCase(fetchOutlets.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create outlet
      .addCase(createOutlet.fulfilled, (state, action) => {
        state.outlets.push(action.payload)
      })
      // Update outlet
      .addCase(updateOutlet.fulfilled, (state, action) => {
        const index = state.outlets.findIndex(o => o.id === action.payload.id)
        if (index !== -1) {
          state.outlets[index] = { ...state.outlets[index], ...action.payload }
        }
        if (state.selectedOutlet?.id === action.payload.id) {
          state.selectedOutlet = { ...state.selectedOutlet, ...action.payload }
        }
      })
      // Delete outlet
      .addCase(deleteOutlet.fulfilled, (state, action) => {
        state.outlets = state.outlets.filter(o => o.id !== action.payload)
        if (state.selectedOutlet?.id === action.payload) {
          state.selectedOutlet = null
        }
      })
      // Add staff member
      .addCase(addStaffMember.fulfilled, (state, action) => {
        const outlet = state.outlets.find(o => o.id === action.payload.outletId)
        if (outlet) {
          outlet.staff.push(action.payload.staff)
        }
        if (state.selectedOutlet?.id === action.payload.outletId) {
          state.selectedOutlet.staff.push(action.payload.staff)
        }
      })
      // Add notice
      .addCase(addNotice.fulfilled, (state, action) => {
        const outlet = state.outlets.find(o => o.id === action.payload.outletId)
        if (outlet) {
          outlet.notices.push(action.payload.notice)
        }
        if (state.selectedOutlet?.id === action.payload.outletId) {
          state.selectedOutlet.notices.push(action.payload.notice)
        }
      })
      // Add task
      .addCase(addTask.fulfilled, (state, action) => {
        const outlet = state.outlets.find(o => o.id === action.payload.outletId)
        if (outlet) {
          outlet.tasks.push(action.payload.task)
        }
        if (state.selectedOutlet?.id === action.payload.outletId) {
          state.selectedOutlet.tasks.push(action.payload.task)
        }
      })
  },
})

// Export actions
export const { 
  setSelectedOutlet, 
  clearSelectedOutlet, 
  setFilters, 
  clearFilters, 
  updateTaskStatus, 
  clearError 
} = outletSlice.actions

// Export selectors
export const selectOutlets = (state) => state.outlet.outlets
export const selectSelectedOutlet = (state) => state.outlet.selectedOutlet
export const selectOutletLoading = (state) => state.outlet.loading
export const selectOutletError = (state) => state.outlet.error
export const selectOutletFilters = (state) => state.outlet.filters

// Helper selectors
export const selectFilteredOutlets = (state) => {
  const { outlets, filters } = state.outlet
  let filtered = outlets

  if (filters.status !== 'ALL') {
    filtered = filtered.filter(outlet => outlet.status === filters.status)
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(outlet =>
      outlet.name.toLowerCase().includes(searchLower) ||
      outlet.address.toLowerCase().includes(searchLower) ||
      outlet.manager.toLowerCase().includes(searchLower)
    )
  }

  return filtered
}

export default outletSlice.reducer 