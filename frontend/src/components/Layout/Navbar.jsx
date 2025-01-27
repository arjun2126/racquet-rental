import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.jpg';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Logo" className="h-8 w-auto" />
            <span className="ml-2 text-xl font-semibold text-gray-900">
              Racquet Rental
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}