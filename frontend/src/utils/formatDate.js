import { format, parseISO, isValid } from 'date-fns'

/**
 * Format a date string or Date object to a readable format
 * @param {string|Date} date - The date to format
 * @param {string} formatString - The format string (default: 'MMM dd, yyyy')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return ''
    
    return format(dateObj, formatString)
  } catch (error) {
    console.error('Error formatting date:', error)
    return ''
  }
}

/**
 * Format a date for display in tables
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatTableDate = (date) => {
  return formatDate(date, 'MMM dd, yyyy')
}

/**
 * Format a date with time
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  return formatDate(date, 'MMM dd, yyyy HH:mm')
}

/**
 * Format a date for input fields
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string for input
 */
export const formatInputDate = (date) => {
  return formatDate(date, 'yyyy-MM-dd')
}

/**
 * Get relative time (e.g., "2 hours ago")
 * @param {string|Date} date - The date to format
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return ''
    
    const now = new Date()
    const diffInMinutes = Math.floor((now - dateObj) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} hours ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} days ago`
    
    return formatDate(date, 'MMM dd')
  } catch (error) {
    console.error('Error getting relative time:', error)
    return ''
  }
} 