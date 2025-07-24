<<<<<<< HEAD
import { useState } from 'react';
import { Menu, User, LogOut } from 'lucide-react';
=======
import { useState, useEffect } from 'react';
import { Menu, User, LogOut } from 'lucide-react'; // Removed Settings icon
>>>>>>> 1aa398dd0753edb6560b441b154a3d3abaf1be79
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ setSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
<<<<<<< HEAD
  const { user, logout } = useAuth();
  const navigate = useNavigate();

=======
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If there are other token-related side effects, keep them here
  }, [token]);

>>>>>>> 1aa398dd0753edb6560b441b154a3d3abaf1be79
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <User className="text-white" size={16} />
              </div>
              <span className="hidden md:block font-medium">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user?.displayName || user?.name || 'Admin'
                }
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
<<<<<<< HEAD
                {/* Settings button removed */}
=======
                {/* Settings button has been removed from here */}
>>>>>>> 1aa398dd0753edb6560b441b154a3d3abaf1be79
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
