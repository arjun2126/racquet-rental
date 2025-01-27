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
      const response = await racquetApi.getAllRacquets(searchTerm);
      if (!response.ok) throw new Error('Failed to fetch racquets');
      const data = await response.json();
      setRacquets(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await racquetApi.getRacquetStats();
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
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
      const response = await racquetApi.generateBarcode(formData.manufacturer_code);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate barcode');
      }

      const data = await response.json();
      console.log('Barcode generated:', data);

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
      const response = await racquetApi.deleteRacquet(racquetId);
      
      if (response.ok) {
        fetchRacquets();
        fetchStats(); // Add this line
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete racquet');
      }
    } catch (error) {
      console.error('Error deleting racquet:', error);
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
    
    const url = editingRacquet 
  ? racquetApi.updateRacquet(editingRacquet.id, formData)
  : racquetApi.createRacquet(formData);
    
    const method = editingRacquet ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchRacquets();
        await fetchStats(); // Add this line
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
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save racquet');
      }
    } catch (error) {
      console.error('Error saving racquet:', error);
    }
  };

  const downloadBarcode = () => {
    if (!barcodeImage) return;
    
    const link = document.createElement('a');
    link.href = barcodeImage;
    link.download = `barcode-${formData.serial_number}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Racquet Management</h2>
        <button
          onClick={() => {
            setEditingRacquet(null);
            setBarcodeImage(null);
            setFormData({
              serial_number: '',
              brand: '',
              model: '',
              condition: 'New',
              manufacturer_code: ''
            });
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 uppercase"
        >
          <Plus className="h-5 w-5" />
          Add New Racquet
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Racquets</h3>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Currently Loaned</h3>
          <p className="text-2xl font-bold text-orange-600">{stats.loaned}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Available</h3>
          <p className="text-2xl font-bold text-green-600">{stats.available}</p>
        </div>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search racquets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <h3 className="text-xl font-semibold mb-4">
            {editingRacquet ? 'Edit Racquet' : 'Add New Racquet'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Manufacturer Code First */}
            <div>
              <label className="block mb-1">Manufacturer Code</label>
              <input
                type="text"
                value={formData.manufacturer_code}
                onChange={(e) => setFormData({...formData, manufacturer_code: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            {/* Serial Number and Brand */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Serial Number</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.serial_number}
                    onChange={(e) => setFormData({...formData, serial_number: e.target.value})}
                    className="flex-1 p-2 border rounded-lg"
                    required
                    disabled={editingRacquet}
                  />
                  {!editingRacquet && (
                    <button
                      type="button"
                      onClick={generateBarcode}
                      className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center justify-center"
                    >
                      <Barcode className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="block mb-1">Brand</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Model</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Condition</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({...formData, condition: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="New">New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>
            </div>

            {barcodeImage && (
              <div className="mt-4 border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Generated Barcode</span>
                  <button
                    type="button"
                    onClick={downloadBarcode}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </button>
                </div>
                <img src={barcodeImage} alt="Barcode" className="max-w-xs" />
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingRacquet(null);
                  setBarcodeImage(null);
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 uppercase"
              >
                {editingRacquet ? 'Update' : 'Add'} Racquet
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Serial Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Brand/Model
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Condition
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {racquets.map((racquet) => (
              <tr key={racquet.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {racquet.serial_number}
                  </div>
                  <div className="text-sm text-gray-500">
                    {racquet.manufacturer_code}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{racquet.brand}</div>
                  <div className="text-sm text-gray-500">{racquet.model}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${racquet.condition === 'New' ? 'bg-green-100 text-green-800' :
                      racquet.condition === 'Excellent' ? 'bg-blue-100 text-blue-800' :
                      racquet.condition === 'Good' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`}>
                    {racquet.condition}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${racquet.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {racquet.is_available ? 'Available' : 'Rented'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleEdit(racquet)}
                      className="text-blue-600 hover:text-blue-900 flex items-center uppercase"
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(racquet.id)}
                      className="text-red-600 hover:text-red-900 flex items-center uppercase"
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
