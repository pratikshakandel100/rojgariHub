import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Building2, 
  TrendingUp, 
  Zap, 
  Settings, 
  X,
  Shield,
  Bell
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { token } = useAuth();

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      if (response.success) {
        setUnreadCount(response.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Briefcase, label: 'Jobs', path: '/admin/jobs' },
    { icon: Building2, label: 'Companies', path: '/admin/companies' },
    { icon: Zap, label: 'Boost Requests', path: '/admin/boost' },
    { icon: TrendingUp, label: 'Analytics', path: '/admin/analytics' },
    { 
      icon: Bell, 
      label: 'Notifications', 
      path: '/admin/notifications',
      badge: unreadCount > 0 ? unreadCount : null
    },
    { icon: Settings, label: 'Settings', path: '/admin/settings' }
  ];

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <Shield className="text-white" size={20} />
            </div>
            <span className="ml-2 text-lg font-bold text-gray-800">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="mt-6">
          <div className="px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center justify-between px-3 py-2 mb-1 text-sm font-medium rounded-lg transition-colors duration-200
                    ${isActive 
                      ? 'bg-red-100 text-red-700 border-r-2 border-red-600' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center">
                    <Icon size={18} className="mr-3" />
                    {item.label}
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;