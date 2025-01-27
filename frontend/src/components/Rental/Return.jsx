import React, { useState } from 'react';
import { Barcode, Check, X } from 'lucide-react';
import { rentalApi } from '../../services/api';

const ReturnPage = () => {
  const [barcode, setBarcode] = useState('');
  const [rentalDetails, setRentalDetails] = useState(null);
  const [newCondition, setNewCondition] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [error, setError] = useState(null);

  const verifyReturn = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/rentals/verify-return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ barcode })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
        setRentalDetails(null);
      } else {
        setRentalDetails(data.rental);
        setError(null);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    }
  };

  const completeReturn = async () => {
    if (!rentalDetails || !newCondition || !employeeName) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/rentals/${rentalDetails.id}/complete-return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          new_condition: newCondition,
          employee_name: employeeName
        })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
      } else {
        alert('Return processed successfully!');
        resetForm();
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    }
  };

  const resetForm = () => {
    setBarcode('');
    setRentalDetails(null);
    setNewCondition('');
    setEmployeeName('');
    setError(null);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold">Racquet Return</h2>
      
      <div className="relative">
        <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Scan or enter racquet barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={verifyReturn}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
        >
          Verify
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      )}

      {rentalDetails && (
        <div className="bg-white p-6 rounded-lg shadow-lg border space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Customer</h3>
              <p className="text-lg">{rentalDetails.customer_name}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Checkout Date</h3>
              <p className="text-lg">{new Date(rentalDetails.checkout_date).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Racquet</h3>
              <p className="text-lg">{rentalDetails.racquet_details.brand} {rentalDetails.racquet_details.model}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Condition at Checkout</h3>
              <p className="text-lg">{rentalDetails.racquet_details.condition_at_checkout}</p>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Employee Name</label>
              <input
                type="text"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">New Condition</label>
              <select
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="">Select condition...</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>

            <button
              onClick={completeReturn}
              className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Complete Return
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnPage;
