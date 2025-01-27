import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Users,
  BadgeCheck,
  Calendar,
  BarChart2,
  Settings
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  
  const menuItems = [
    {
      title: 'New Rental',
      icon: <ClipboardList className="h-8 w-8" />,
      description: 'Create a new rental transaction',
      path: '/rentals/new',
      color: 'bg-blue-500'
    },
    {
      title: 'Manage Racquets',
      icon: <BadgeCheck className="h-8 w-8" />,
      description: 'Add or manage demo racquets',
      path: '/racquets',
      color: 'bg-green-500'
    },
    {
      title: 'Rentals History',
      icon: <BarChart2 className="h-8 w-8" />,
      description: 'View and manage rental history',
      path: '/rentals/history',
      color: 'bg-green-500'
    },
    {
      title: 'Active Rentals',
      icon: <Calendar className="h-8 w-8" />,
      description: 'View and manage current rentals',
      path: '/rentals/active',
      color: 'bg-purple-500'
    },
    {
      title: 'Customers',
      icon: <Users className="h-8 w-8" />,
      description: 'Manage customer information',
      path: '/customers',
      color: 'bg-orange-500'
    },
    {
      title: 'Returns',
      icon: <Users className="h-8 w-8" />,
      description: 'Handle returns',
      path: '/returns',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Welcome to Racquet Rental System
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="group p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-left"
            >
              <div className="flex items-start space-x-4">
                <div className={`${item.color} p-3 rounded-lg text-white`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {item.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}