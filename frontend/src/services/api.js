const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

// Customer related API calls
export const customerApi = {
  getAllCustomers: async (searchTerm = '') => {
    const response = await fetch(`${API_URL}/api/customers?search=${encodeURIComponent(searchTerm)}`);
    return response.json();
  },

  getCustomerById: async (id) => {
    const response = await fetch(`${API_URL}/api/customers/${id}`);
    return response.json();
  },

  createCustomer: async (data) => {
    const response = await fetch(`${API_URL}/api/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateCustomer: async (id, data) => {
    const response = await fetch(`${API_URL}/api/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteCustomer: async (id) => {
    const response = await fetch(`${API_URL}/api/customers/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }
};

// Racquet related API calls
export const racquetApi = {
  getAllRacquets: async (searchTerm = '') => {
    const response = await fetch(`${API_URL}/api/racquets?search=${encodeURIComponent(searchTerm)}`);
    return response.json();
  },

  getRacquetStats: async () => {
    const response = await fetch(`${API_URL}/api/racquets/stats`);
    return response.json();
  },

  generateBarcode: async (manufacturerCode) => {
    const response = await fetch(`${API_URL}/api/racquets/barcode/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ manufacturer_code: manufacturerCode }),
    });
    return response.json();
  },

  createRacquet: async (data) => {
    const response = await fetch(`${API_URL}/api/racquets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateRacquet: async (id, data) => {
    const response = await fetch(`${API_URL}/api/racquets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteRacquet: async (id) => {
    const response = await fetch(`${API_URL}/api/racquets/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }
};

// Rental related API calls
export const rentalApi = {
  getActiveRentals: async () => {
    const response = await fetch(`${API_URL}/api/rentals`);
    return response.json();
  },

  getRentalHistory: async () => {
    const response = await fetch(`${API_URL}/api/rentals/history`);
    return response.json();
  },

  createRental: async (data) => {
    const response = await fetch(`${API_URL}/api/rentals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  verifyReturn: async (barcode) => {
    const response = await fetch(`${API_URL}/api/rentals/verify-return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ barcode }),
    });
    return response.json();
  },

  completeReturn: async (rentalId, data) => {
    const response = await fetch(`${API_URL}/api/rentals/${rentalId}/complete-return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  exportRentals: (type = 'active') => {
    window.location.href = `${API_URL}/api/rentals/export?type=${type}`;
  },

  exportRentalHistory: () => {
    window.location.href = `${API_URL}/api/rentals/export?type=history`;
  }
};
