import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { rentalApi } from '../../services/api';

export default function ActiveRentals() {
  const [rentals, setRentals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRentals();
    const interval = setInterval(fetchRentals, 60000);
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

  // Your existing JSX remains the same
  return (
    <div>Your existing JSX here</div>
  );
}
