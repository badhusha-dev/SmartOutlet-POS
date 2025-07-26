import React, { useState, useEffect } from 'react';
import Modal from '../../../components/common/Modal';
import expenseService from '../expenseService';
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({ title: '', amount: '', category: '', date: '', status: 'PENDING', description: '' });
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [amountMin, setAmountMin] = useState('');
  const [amountMax, setAmountMax] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await expenseService.getExpenses();
      setExpenses(res.data || []);
    } catch (e) {
      // Handle error (toast, etc.)
    }
  };

  const handleAdd = () => {
    setFormData({ title: '', amount: '', category: '', date: '', status: 'PENDING', description: '' });
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEdit = (expense) => {
    setFormData({ ...expense });
    setSelectedExpense(expense);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.deleteExpense(id);
        setExpenses(expenses.filter(e => e.id !== id));
      } catch (e) {
        // Handle error (toast, etc.)
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit && selectedExpense) {
        const res = await expenseService.updateExpense(selectedExpense.id, formData);
        setExpenses(expenses.map(e => e.id === selectedExpense.id ? res.data : e));
      } else {
        const res = await expenseService.createExpense(formData);
        setExpenses([...expenses, res.data]);
      }
      setShowModal(false);
      setSelectedExpense(null);
    } catch (e) {
      // Handle error (toast, etc.)
    }
  };

  // Enhanced filter
  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = (e.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || e.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    const matchesDateFrom = dateFrom === '' || e.date >= dateFrom;
    const matchesDateTo = dateTo === '' || e.date <= dateTo;
    const matchesAmountMin = amountMin === '' || Number(e.amount) >= Number(amountMin);
    const matchesAmountMax = amountMax === '' || Number(e.amount) <= Number(amountMax);
    return matchesSearch && matchesCategory && matchesStatus && matchesDateFrom && matchesDateTo && matchesAmountMin && matchesAmountMax;
  });

  // Export helpers
  const handleExportCSV = () => {
    const data = filteredExpenses.map(e => ({
      Title: e.title,
      Amount: e.amount,
      Category: e.category,
      Date: e.date,
      Status: e.status,
      Description: e.description
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses')
    const csv = XLSX.utils.sheet_to_csv(ws)
    const blob = new Blob([csv], { type: 'text/csv' })
    saveAs(blob, 'expenses.csv')
  }
  const handleExportExcel = () => {
    const data = filteredExpenses.map(e => ({
      Title: e.title,
      Amount: e.amount,
      Category: e.category,
      Date: e.date,
      Status: e.status,
      Description: e.description
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses')
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(blob, 'expenses.xlsx')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expense Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage business expenses</p>
        </div>
        <button onClick={handleAdd} className="btn-primary px-4 py-2">
          Add Expense
        </button>
      </div>

      {/* Advanced Filters & Export */}
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="ALL">All Categories</option>
          {[...new Set(expenses.map(e => e.category))].filter(Boolean).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={e => setDateFrom(e.target.value)}
          className="w-36 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="From"
        />
        <input
          type="date"
          value={dateTo}
          onChange={e => setDateTo(e.target.value)}
          className="w-36 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="To"
        />
        <input
          type="number"
          placeholder="Min Amount"
          value={amountMin}
          onChange={e => setAmountMin(e.target.value)}
          className="w-24 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <input
          type="number"
          placeholder="Max Amount"
          value={amountMax}
          onChange={e => setAmountMax(e.target.value)}
          className="w-24 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <div className="flex gap-2 ml-auto">
          <button onClick={handleExportCSV} className="btn-secondary px-3 py-2">Export CSV</button>
          <button onClick={handleExportExcel} className="btn-secondary px-3 py-2">Export Excel</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredExpenses.map((e) => (
              <tr key={e.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{e.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">${e.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{e.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{e.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{e.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(e)} className="text-green-600 hover:text-green-900 mr-3">Edit</button>
                  <button onClick={() => handleDelete(e.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={isEdit ? 'Edit Expense' : 'Add Expense'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary px-4 py-2">Cancel</button>
            <button type="submit" className="btn-primary px-4 py-2">{isEdit ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExpenseManagement; 