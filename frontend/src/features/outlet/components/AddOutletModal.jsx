import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { 
  X, 
  MapPin, 
  User, 
  Clock, 
  Phone, 
  Mail,
  Building,
  Globe,
  Navigation
} from 'lucide-react'
import outletService from '../../services/outletService'
import toast from 'react-hot-toast'

const AddOutletModal = ({ isOpen, onClose, onSuccess, editingOutlet = null }) => {
  const [loading, setLoading] = useState(false)
  const [staff, setStaff] = useState([])
  const [showLocationPicker, setShowLocationPicker] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      latitude: '',
      longitude: '',
      phone: '',
      email: '',
      manager: '',
      openingHours: '',
      status: 'ACTIVE'
    }
  })

  const watchedValues = watch()

  useEffect(() => {
    if (isOpen) {
      loadStaff()
      if (editingOutlet) {
        // Populate form with editing outlet data
        Object.keys(editingOutlet).forEach(key => {
          if (editingOutlet[key] !== undefined) {
            setValue(key, editingOutlet[key])
          }
        })
      } else {
        reset()
      }
    }
  }, [isOpen, editingOutlet, setValue, reset])

  const loadStaff = async () => {
    try {
      const response = await outletService.getStaff()
      setStaff(response.data)
    } catch (error) {
      console.error('Failed to load staff:', error)
    }
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      
      if (editingOutlet) {
        await outletService.updateOutlet(editingOutlet.id, data)
        toast.success('Outlet updated successfully!')
      } else {
        await outletService.createOutlet(data)
        toast.success('Outlet created successfully!')
      }
      
      onSuccess()
      onClose()
      reset()
    } catch (error) {
      toast.error(error.message || 'Failed to save outlet')
    } finally {
      setLoading(false)
    }
  }

  const handleLocationPick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitude', position.coords.latitude)
          setValue('longitude', position.coords.longitude)
          setShowLocationPicker(false)
          toast.success('Location captured successfully!')
        },
        (error) => {
          console.error('Error getting location:', error)
          toast.error('Failed to get location. Please enter manually.')
        }
      )
    } else {
      toast.error('Geolocation is not supported by this browser.')
    }
  }

  const generateEmail = () => {
    const name = watchedValues.name?.toLowerCase().replace(/\s+/g, '')
    if (name) {
      setValue('email', `${name}@smartoutlet.com`)
    }
  }

  const generatePhone = () => {
    const areaCode = Math.floor(Math.random() * 900) + 100
    const prefix = Math.floor(Math.random() * 900) + 100
    const line = Math.floor(Math.random() * 9000) + 1000
    setValue('phone', `+1 (${areaCode}) ${prefix}-${line}`)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-coral-100 dark:bg-coral-900/20 rounded-lg">
              <Building className="h-6 w-6 text-coral-600 dark:text-coral-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingOutlet ? 'Edit Outlet' : 'Add New Outlet'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {editingOutlet ? 'Update outlet information' : 'Create a new retail outlet'}
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

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Building className="h-5 w-5 mr-2 text-coral-600" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Outlet Name *
                </label>
                <input
                  {...register('name', { required: 'Outlet name is required' })}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent ${
                    errors.name 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Enter outlet name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-coral-600" />
              Address Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Street Address *
                </label>
                <input
                  {...register('address', { required: 'Address is required' })}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent ${
                    errors.address 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Enter street address"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City *
                  </label>
                  <input
                    {...register('city', { required: 'City is required' })}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent ${
                      errors.city 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="Enter city"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State *
                  </label>
                  <input
                    {...register('state', { required: 'State is required' })}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent ${
                      errors.state 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="Enter state"
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.state.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    {...register('zipCode', { required: 'ZIP code is required' })}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent ${
                      errors.zipCode 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="Enter ZIP code"
                  />
                  {errors.zipCode && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.zipCode.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country
                </label>
                <input
                  {...register('country')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter country"
                />
              </div>

              {/* Location Coordinates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Latitude
                  </label>
                  <div className="flex space-x-2">
                    <input
                      {...register('latitude')}
                      type="number"
                      step="any"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter latitude"
                    />
                    <button
                      type="button"
                      onClick={handleLocationPick}
                      className="px-3 py-2 bg-coral-100 dark:bg-coral-900/20 text-coral-600 dark:text-coral-400 rounded-lg hover:bg-coral-200 dark:hover:bg-coral-900/40 transition-colors"
                      title="Get current location"
                    >
                      <Navigation className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Longitude
                  </label>
                  <input
                    {...register('longitude')}
                    type="number"
                    step="any"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter longitude"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Phone className="h-5 w-5 mr-2 text-coral-600" />
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number *
                </label>
                <div className="flex space-x-2">
                  <input
                    {...register('phone', { required: 'Phone number is required' })}
                    type="tel"
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent ${
                      errors.phone 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="Enter phone number"
                  />
                  <button
                    type="button"
                    onClick={generatePhone}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="Generate random phone"
                  >
                    Auto
                  </button>
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <div className="flex space-x-2">
                  <input
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent ${
                      errors.email 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="Enter email address"
                  />
                  <button
                    type="button"
                    onClick={generateEmail}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="Generate email from outlet name"
                  >
                    Auto
                  </button>
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Management Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-coral-600" />
              Management Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Manager *
                </label>
                <select
                  {...register('manager', { required: 'Manager is required' })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent ${
                    errors.manager 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                >
                  <option value="">Select a manager</option>
                  {staff.map((member) => (
                    <option key={member.id} value={member.name}>
                      {member.name} ({member.role})
                    </option>
                  ))}
                </select>
                {errors.manager && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.manager.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Operating Hours *
                </label>
                <input
                  {...register('openingHours', { required: 'Operating hours are required' })}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent ${
                    errors.openingHours 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="e.g., 9:00 AM - 9:00 PM"
                />
                {errors.openingHours && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.openingHours.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-coral-600 text-white rounded-lg hover:bg-coral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : (editingOutlet ? 'Update Outlet' : 'Create Outlet')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddOutletModal 