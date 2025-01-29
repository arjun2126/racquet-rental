import React, { useState, useEffect } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { customerApi, racquetApi, rentalApi } from '../../services/api';

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
      const data = await customerApi.getAllCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchAvailableRacquets = async () => {
    try {
      const data = await racquetApi.getAllRacquets();
      setAvailableRacquets(data.filter(r => r.is_available));
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
      await rentalApi.createRental({
        ...formData,
        racquet_ids: selectedRacquets.map(r => r.id)
      });
      
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
    // Your existing JSX remains the same
    <div>Your existing JSX here</div>
  );
};

export default RentalForm;
