import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar'; // Updated path
import Home from './pages/Home'; // Updated path
import RentalForm from './components/Forms/RentalForm'; // Updated path
import RacquetManagement from './components/Management/RacquetManagement'; // Updated path
import CustomerManagement from './components/Management/CustomerManagement'; // Updated path
import ActiveRentals from './components/Rental/ActiveRentals'; // Updated path
import RentalHistory from './components/Rental/RentalHistory'; // Updated path
import Return from './components/Rental/Return'; // Updated path

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rentals/new" element={<RentalForm />} />
          <Route path="/racquets" element={<RacquetManagement />} />
          <Route path="/customers" element={<CustomerManagement />} />
          <Route path="/rentals/active" element={<ActiveRentals />} />
          <Route path="/rentals/history" element={<RentalHistory />} />
          <Route path="/returns" element={<Return />} />
        </Routes>
      </main>
    </div>
  );
}