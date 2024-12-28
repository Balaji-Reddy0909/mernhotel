import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Hotel } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Hotel className="h-8 w-8 text-blue-600" />
              <Link 
                to="/rooms" 
                className="ml-2 text-2xl font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                Paradise Hotels
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/rooms')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Book Hotel
              </button>
              <Link 
                to="/account" 
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <User size={20} />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}