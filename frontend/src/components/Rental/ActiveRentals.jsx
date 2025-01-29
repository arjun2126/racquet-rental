import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { rentalApi } from '../../services/api';

export default function ActiveRentals() {
  const [rentals, setRentals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRentals();
    const interval = setInterval(fetchRentals, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const fetchRentals = async () => {
    try {
      const data = await rentalApi.getActiveRentals();
      setRentals(data);
    } catch (error) {
      console.error('Error fetching rentals:', error);
    }
  };

  const handleReturn = (rentalId) => {
    navigate('/returns', { state: { rentalId } });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Active Rentals</h2>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Racquet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Dates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rentals.map((rental) => (
              <tr key={rental.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {rental.customer_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {rental.customer_phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {rental.racquet_brand.map((brand, idx) => (
                    <div key={idx} className="text-sm">
                      <div className="text-gray-900">
                        {rental.racquet_serial[idx]}
                      </div>
                      <div className="text-gray-500">
                        {brand} {rental.racquet_model[idx]}
                      </div>
                    </div>
                  ))}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    Out: {formatDate(rental.checkout_date)}
                    <br />
                    Due: {formatDate(rental.expected_return_date)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {rental.is_overdue ? (
                    <div className="flex items-center text-red-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Overdue
                    </div>
                  ) : (
                    <span className="text-green-600">Active</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleReturn(rental.id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Return All
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
