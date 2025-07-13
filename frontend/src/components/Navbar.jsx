import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 w-full">
      <div className="w-full max-w-none px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">
          <div className="flex items-center flex-shrink-0">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              {/* <img
                src={jobImage}
                alt="RojgariHub Logo"
                className="h-10 w-auto object-contain flex-shrink-0"
              /> */}
              <span className="ml-2 text-xl font-bold text-gray-900 whitespace-nowrap">RojgariHub</span>
            </div>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex md:ml-10 space-x-8">
              <a href="#" className="text-gray-500 hover:text-gray-700 whitespace-nowrap">Find Jobs</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 whitespace-nowrap">Browse Companies</a>
            </nav>
          </div>

          <div className="flex items-center flex-shrink-0">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors whitespace-nowrap"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors whitespace-nowrap"
                onClick={() => navigate('/register')}
              >
                Register
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden w-full">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t w-full">
              <a href="#" className="block px-3 py-2 text-gray-500 hover:text-gray-700 w-full">Find Jobs</a>
              <a href="#" className="block px-3 py-2 text-gray-500 hover:text-gray-700 w-full">Browse Companies</a>
              <div className="border-t pt-2 mt-2 w-full">
                <button
                  className="block w-full text-left px-3 py-2 text-gray-500 hover:text-gray-700"
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>
                <button
                  className="block w-full text-left px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 mt-2"
                  onClick={() => navigate('/register')}
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
