import { expenseApi, API_ENDPOINTS } from '../../services/client'

class ExpenseService {
  async getExpenses() {
    try {
      const response = await expenseApi.get(API_ENDPOINTS.EXPENSES)
      return { data: response.data.data, success: true }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch expenses')
    }
  }

  async getExpenseById(id) {
    try {
      const response = await expenseApi.get(API_ENDPOINTS.EXPENSE_BY_ID(id))
      return { data: response.data.data, success: true }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch expense')
    }
  }

  async createExpense(expenseData) {
    try {
      const response = await expenseApi.post(API_ENDPOINTS.EXPENSES, expenseData)
      return { data: response.data.data, success: true }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create expense')
    }
  }

  async updateExpense(id, expenseData) {
    try {
      const response = await expenseApi.put(API_ENDPOINTS.EXPENSE_BY_ID(id), expenseData)
      return { data: response.data.data, success: true }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update expense')
    }
  }

  async deleteExpense(id) {
    try {
      await expenseApi.delete(API_ENDPOINTS.EXPENSE_BY_ID(id))
      return { success: true }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete expense')
    }
  }
}

export default new ExpenseService() 