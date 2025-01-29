import React, { useState, useEffect } from 'react';
import { FileDown, Search } from 'lucide-react';
import { rentalApi } from '../../services/api';

const RentalHistory = () => {
  const [rentals, setRentals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRentalHistory();
  }, []);

  const fetchRentalHistory = async () => {
    try {
      const data = await rentalApi.getRentalHistory();
      setRentals(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    rentalApi.exportRentals();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Returned': return 'bg-green-100 text-green-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  const filteredRentals = rentals.filter(rental =>
    rental.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rental.racquet_serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rental.customer_phone.includes(searchTerm)
  );

  // Your existing JSX remains the same
  return (
    <div>Your existing JSX here</div>
  );
};

export default RentalHistory;
