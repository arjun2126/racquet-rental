import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Download, Barcode } from 'lucide-react';
import { racquetApi } from '../../services/api';

export default function RacquetManagement() {
  const [racquets, setRacquets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingRacquet, setEditingRacquet] = useState(null);
  const [barcodeImage, setBarcodeImage] = useState(null);
  const [formData, setFormData] = useState({
    serial_number: '',
    brand: '',
    model: '',
    condition: 'New',
    manufacturer_code: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    loaned: 0,
    available: 0
  });

  const fetchRacquets = async (searchTerm = '') => {
    try {
      const data = await racquetApi.getAllRacquets(searchTerm);
      setRacquets(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await racquetApi.getRacquetStats();
      setStats(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchRacquets(searchTerm);
    fetchStats();
  }, [searchTerm]);

  const generateBarcode = async () => {
    try {
      const data = await racquetApi.generateBarcode(formData.manufacturer_code);
      setBarcodeImage(data.image);
      setFormData(prev => ({
        ...prev,
        serial_number: data.barcode
      }));
    } catch (error) {
      console.error('Error details:', error);
      alert('Failed to generate barcode. Please try again.');
    }
  };

  const handleDelete = async (racquetId) => {
    if (!window.confirm('Are you sure you want to delete this racquet?')) return;
    try {
      await racquetApi.deleteRacquet(racquetId);
      fetchRacquets();
      fetchStats();
    } catch (error) {
      alert(error.message || 'Failed to delete racquet');
    }
  };

  const handleEdit = (racquet) => {
    setEditingRacquet(racquet);
    setFormData({
      serial_number: racquet.serial_number,
      brand: racquet.brand,
      model: racquet.model,
      condition: racquet.condition,
      manufacturer_code: racquet.manufacturer_code || ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRacquet) {
        await racquetApi.updateRacquet(editingRacquet.id, formData);
      } else {
        await racquetApi.createRacquet(formData);
      }
      await fetchRacquets();
      await fetchStats();
      setShowForm(false);
      setEditingRacquet(null);
      setFormData({
        serial_number: '',
        brand: '',
        model: '',
        condition: 'New',
        manufacturer_code: ''
      });
      setBarcodeImage(null);
    } catch (error) {
      alert(error.message || 'Failed to save racquet');
    }
  };

  // Your existing JSX remains the same
  return (
    <div>Your existing JSX here</div>
  );
}
