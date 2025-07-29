/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} True if email is valid
 */
export const validateEmail = (email) => {
  if (!email) return false
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate email with detailed error message
 * @param {string} email - The email to validate
 * @returns {object} Object with isValid boolean and error message
 */
export const validateEmailWithMessage = (email) => {
  if (!email) {
    return {
      isValid: false,
      message: 'Email is required'
    }
  }
  
  if (!validateEmail(email)) {
    return {
      isValid: false,
      message: 'Please enter a valid email address'
    }
  }
  
  return {
    isValid: true,
    message: ''
  }
}

/**
 * Sanitize email (remove whitespace and convert to lowercase)
 * @param {string} email - The email to sanitize
 * @returns {string} Sanitized email
 */
export const sanitizeEmail = (email) => {
  if (!email) return ''
  return email.trim().toLowerCase()
} 