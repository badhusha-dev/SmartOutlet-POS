import { authApi, API_ENDPOINTS } from '../../services/client'

class UserService {
  async getUsers() {
    try {
      const response = await authApi.get(API_ENDPOINTS.USERS)
      return { data: response.data.data, success: true }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users')
    }
  }

  async getUserById(id) {
    try {
      const response = await authApi.get(API_ENDPOINTS.USER_BY_ID(id))
      return { data: response.data.data, success: true }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user')
    }
  }

  async createUser(userData) {
    try {
      const response = await authApi.post(API_ENDPOINTS.REGISTER, userData)
      return { data: response.data.data, success: true }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create user')
    }
  }

  async updateUser(id, userData) {
    try {
      const response = await authApi.put(API_ENDPOINTS.USER_BY_ID(id), userData)
      return { data: response.data.data, success: true }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user')
    }
  }

  async deleteUser(id) {
    try {
      await authApi.delete(API_ENDPOINTS.USER_BY_ID(id))
      return { success: true }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user')
    }
  }
}

export default new UserService() 