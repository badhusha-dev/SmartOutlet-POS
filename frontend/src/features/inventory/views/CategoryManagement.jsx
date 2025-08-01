import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import * as XLSX from 'xlsx';
import { Plus, Edit, Trash2, Package, Tag } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import { mockCategories } from '../../../utils/mockData';

const CategoryManagement = () => {
  // Development mode flags
  const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true'
  const DISABLE_AUTH = import.meta.env.VITE_DISABLE_AUTH === 'true'

  const dispatch = useDispatch();
  const categories = (DEV_MODE && DISABLE_AUTH) ? mockCategories : (useSelector(state => state.products?.categories) || mockCategories);
  const loading = useSelector(state => state.products?.loading) || false;
  const error = useSelector(state => state.products?.error) || null;

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (!(DEV_MODE && DISABLE_AUTH)) {
      // dispatch(fetchCategories());
    }
  }, [dispatch, DEV_MODE, DISABLE_AUTH]);

  const handleAdd = () => {
    setFormData({ name: '', description: '' });
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name, description: category.description });
    setSelectedCategory(category);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      if (DEV_MODE && DISABLE_AUTH) {
        console.log('🔓 Development mode: Mock delete category', id);
        return;
      }
      // dispatch(deleteCategory(id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (DEV_MODE && DISABLE_AUTH) {
      console.log('🔓 Development mode: Mock category operation', { isEdit, formData });
      setShowModal(false);
      setSelectedCategory(null);
      return;
    }
    
    if (isEdit && selectedCategory) {
      // dispatch(updateCategory({ id: selectedCategory.id, categoryData: formData }));
    } else {
      // dispatch(createCategory(formData));
    }
    setShowModal(false);
    setSelectedCategory(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Category Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage product categories</p>
        </div>
        <button onClick={handleAdd} className="btn-primary px-4 py-2">
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{cat.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{cat.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(cat)} className="text-green-600 hover:text-green-900 mr-3">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={isEdit ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              required
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

export default CategoryManagement; 