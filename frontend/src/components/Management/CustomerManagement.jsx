import React, { useState, useEffect } from 'react';
import { Search, Plus, Phone, Mail, History, Trash2, Edit2 } from 'lucide-react';
import { customerApi } from '../../services/api';

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const fetchCustomers = async (searchTerm = '') => {
    try {
      const data = await customerApi.getAllCustomers(searchTerm);
      setCustomers(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  useEffect(() => {
    fetchCustomers(searchTerm);
  }, [searchTerm]);

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await customerApi.updateCustomer(editingCustomer.id, formData);
      } else {
        await customerApi.createCustomer(formData);
      }
      await fetchCustomers();
      setShowForm(false);
      setEditingCustomer(null);
      setFormData({ name: '', phone: '', email: '' });
    } catch (error) {
      alert(error.message || 'Failed to save customer');
      console.error('Error saving customer:', error);
    }
  };

  const handleDelete = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await customerApi.deleteCustomer(customerId);
      fetchCustomers();
    } catch (error) {
      alert(error.message || 'Failed to delete customer');
      console.error('Error deleting customer:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customer Management</h2>
        <button
          onClick={() => {
            setEditingCustomer(null);
            setFormData({ name: '', phone: '', email: '' });
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          <Plus className="h-5 w-5" />
          Add New Customer
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <h3 className="text-xl font-semibold mb-4">
            {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingCustomer(null);
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {editingCustomer ? 'Update' : 'Add'} Customer
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-4 w-4 mr-2" />
                      {customer.phone}
                    </div>
                    {customer.email && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-4 w-4 mr-2" />
                        {customer.email}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="text-blue-600 hover:text-blue-900 flex items-center"
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="text-red-600 hover:text-red-900 flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
