import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Briefcase, Plus, Users, User, Bell, Search, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

function Sidebar({ applications = [] }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { token } = useAuth();

  const pendingApplications = applications.filter(app => app.status === 'Pending').length;

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

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-sm transform transition-transform duration-300 ease-in-out lg:transform-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 pt-20 lg:pt-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors absolute top-4 left-4"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <nav className="space-y-2">
            <NavLink to="/employee/dashboard" className={navClass}>
              <Briefcase className="h-5 w-5" />
              <span className="font-medium">Dashboard</span>
            </NavLink>
            <NavLink to="/employee/jobs" className={navClass}>
              <Search className="h-5 w-5" />
              <span className="font-medium">My Jobs</span>
            </NavLink>
            <NavLink to="/employee/postjob" className={navClass}>
              <Plus className="h-5 w-5" />
              <span className="font-medium">Post Job</span>
            </NavLink>
            <NavLink to="/employee/applications" className={navClass}>
              <Users className="h-5 w-5" />
              <span className="font-medium">Applications</span>
              {pendingApplications > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-auto">{pendingApplications}</span>
              )}
            </NavLink>
            <NavLink to="/employee/notifications" className={navClass}>
              <Bell className="h-5 w-5" />
              <span className="font-medium">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-auto">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </NavLink>
            <NavLink to="/employee/profile" className={navClass}>
              <User className="h-5 w-5" />
              <span className="font-medium">Profile</span>
            </NavLink>
            <div className="mt-8 pt-4 border-t border-gray-200">
              <NavLink to="/employee/setting" className={navClass}>
                <Settings className="h-5 w-5" />
                <span className="font-medium">Settings</span>
              </NavLink>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}

const navClass = ({ isActive }) =>
  `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
    isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
  }`;

export default Sidebar;
