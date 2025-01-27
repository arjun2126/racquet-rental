import React, { useState, useEffect } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { customerApi, racquetApi, rentalApi } from '../services/api';

const RentalForm = () => {
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    customer_id: '',
    employee_name: '',
    rental_fee: '',
    checkout_date: getCurrentDate() 
  });
  const [customers, setCustomers] = useState([]);
  const [availableRacquets, setAvailableRacquets] = useState([]);
  const [selectedRacquets, setSelectedRacquets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    fetchCustomers();
    fetchAvailableRacquets();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customerApi.getAllCustomers();
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchAvailableRacquets = async () => {
    try {
      const response = await racquetApi.getAllRacquets();
      if (response.ok) {
        const data = await response.json();
        setAvailableRacquets(data.filter(r => r.is_available));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRacquetSelect = (racquet) => {
    if (selectedRacquets.length >= 3) {
      alert('Maximum 3 racquets allowed per rental');
      return;
    }
    setSelectedRacquets([...selectedRacquets, racquet]);
  };

  const handleRacquetRemove = (racquet) => {
    setSelectedRacquets(selectedRacquets.filter(r => r.id !== racquet.id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await rentalApi.createRental({...formData, racquet_ids: selectedRacquets.map(r => r.id)});

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }
      setFormData({
        customer_id: '',
        employee_name: '',
        rental_fee: '',
        checkout_date: getCurrentDate() 
      });
      setSelectedRacquets([]);
      fetchAvailableRacquets();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredRacquets = availableRacquets.filter(racquet =>
    racquet.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    racquet.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    racquet.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">New Rental</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label>Customer</label>
              <button
                type="button"
                onClick={() => setShowCustomerForm(true)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + New Customer
              </button>
            </div>
            <select
              value={formData.customer_id}
              onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Employee Name</label>
            <input
              type="text"
              value={formData.employee_name}
              onChange={(e) => setFormData({ ...formData, employee_name: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Rental Date</label>
            <input
              type="date"
              value={formData.checkout_date}
              className="w-full p-2 border rounded-lg"
              disabled
            />
          </div>
          <div>
            <label className="block mb-1">Rental Fee</label>
            <input
              type="number"
              value={formData.rental_fee}
              onChange={(e) => setFormData({ ...formData, rental_fee: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block mb-1">Selected Racquets ({selectedRacquets.length}/3)</label>
          <div className="flex flex-wrap gap-2">
            {selectedRacquets.map((racquet) => (
              <div key={racquet.id} className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                <span className="text-sm">
                  {racquet.brand} {racquet.model}
                </span>
                <button
                  type="button"
                  onClick={() => handleRacquetRemove(racquet)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search racquets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Serial Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Brand/Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Condition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRacquets.map((racquet) => (
                  <tr key={racquet.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{racquet.serial_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {racquet.brand} {racquet.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          racquet.condition === 'New'
                            ? 'bg-green-100 text-green-800'
                            : racquet.condition === 'Excellent'
                            ? 'bg-blue-100 text-blue-800'
                            : racquet.condition === 'Good'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {racquet.condition.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleRacquetSelect(racquet)}
                        disabled={selectedRacquets.some((r) => r.id === racquet.id)}
                        className="text-blue-600 hover:text-blue-900 disabled:text-gray-400"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={selectedRacquets.length === 0}
            className="btn btn-primary px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 uppercase"
          >
            Create Rental
          </button>
        </div>
      </form>


      {showCustomerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Customer</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const response = await customerApi.createCustomer(newCustomerData);

                  if (response.ok) {
                    const customer = await response.json();
                    setFormData((prev) => ({ ...prev, customer_id: customer.id }));
                    await fetchCustomers();
                    setShowCustomerForm(false);
                  }
                } catch (error) {
                  console.error('Error creating customer:', error);
                }
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">Name</label>
                  <input
                    type="text"
                    value={newCustomerData.name}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, name: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newCustomerData.phone}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Email</label>
                  <input
                    type="email"
                    value={newCustomerData.email}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, email: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowCustomerForm(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Add Customer
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalForm;
