import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Plus, Edit, Trash2, Store, MapPin, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import apiClient, { API_ENDPOINTS } from '../api/client'
import Modal from '../components/ui/Modal'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const OutletManagement = () => {
  const { isAdmin } = useAuth()
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOutlet, setEditingOutlet] = useState(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  // Fetch outlets
  const { data: outlets, isLoading } = useQuery(
    'outlets',
    () => apiClient.get(API_ENDPOINTS.OUTLETS),
    {
      select: (response) => response.data.data,
    }
  )

  // Create outlet mutation
  const createMutation = useMutation(
    (data) => apiClient.post(API_ENDPOINTS.OUTLETS, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('outlets')
        setIsModalOpen(false)
        reset()
        toast.success('Outlet created successfully!')
      },
      onError: () => {
        toast.error('Failed to create outlet')
      }
    }
  )

  // Update outlet mutation
  const updateMutation = useMutation(
    ({ id, ...data }) => apiClient.put(API_ENDPOINTS.OUTLET_BY_ID(id), data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('outlets')
        setIsModalOpen(false)
        setEditingOutlet(null)
        reset()
        toast.success('Outlet updated successfully!')
      },
      onError: () => {
        toast.error('Failed to update outlet')
      }
    }
  )

  // Delete outlet mutation
  const deleteMutation = useMutation(
    (id) => apiClient.delete(API_ENDPOINTS.OUTLET_BY_ID(id)),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('outlets')
        toast.success('Outlet deleted successfully!')
      },
      onError: () => {
        toast.error('Failed to delete outlet')
      }
    }
  )

  const handleSubmitForm = (data) => {
    if (editingOutlet) {
      updateMutation.mutate({ id: editingOutlet.id, ...data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (outlet) => {
    setEditingOutlet(outlet)
    reset(outlet)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this outlet?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleAddNew = () => {
    setEditingOutlet(null)
    reset({})
    setIsModalOpen(true)
  }

  if (!isAdmin()) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to manage outlets.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Outlet Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your store outlets and locations.
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="btn-primary px-4 py-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Outlet
        </button>
      </div>

      {/* Outlets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {outlets?.map((outlet) => (
          <motion.div
            key={outlet.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                  <Store className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {outlet.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {outlet.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(outlet)}
                  className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(outlet.id)}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                {outlet.location || 'No location specified'}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <User className="h-4 w-4 mr-2" />
                Manager: {outlet.managerName || 'Unassigned'}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  outlet.isActive 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {outlet.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingOutlet(null)
          reset({})
        }}
        title={editingOutlet ? 'Edit Outlet' : 'Add New Outlet'}
      >
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Outlet Name
            </label>
            <input
              {...register('name', { required: 'Outlet name is required' })}
              type="text"
              className="input"
              placeholder="Enter outlet name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <input
              {...register('location', { required: 'Location is required' })}
              type="text"
              className="input"
              placeholder="Enter outlet location"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.location.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Manager ID
            </label>
            <input
              {...register('managerId')}
              type="number"
              className="input"
              placeholder="Enter manager ID (optional)"
            />
          </div>

          <div className="flex items-center">
            <input
              {...register('isActive')}
              type="checkbox"
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Active
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false)
                setEditingOutlet(null)
                reset({})
              }}
              className="flex-1 btn-secondary py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isLoading || updateMutation.isLoading}
              className="flex-1 btn-primary py-2"
            >
              {createMutation.isLoading || updateMutation.isLoading
                ? 'Saving...'
                : editingOutlet
                ? 'Update'
                : 'Create'
              }
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default OutletManagement