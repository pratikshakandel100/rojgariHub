import React from 'react';
import {
  Home,
  Search,
  FileText,
  BookmarkPlus,
  User,
  BarChart3,
  MessageCircle,
  Settings,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const sidebarItems = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'jobs', label: 'Job Search', icon: Search },
  { id: 'applications', label: 'Applications', icon: FileText },
  { id: 'saved', label: 'Saved Jobs', icon: BookmarkPlus },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab, setSidebarOpen }) {
  const navigate = useNavigate();
 
  const handleSignOut = () => {
    // You can clear localStorage or auth context here
    localStorage.clear(); // or removeItem('token')
    navigate('/login');   // redirect to login page
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <nav className="mt-4 lg:mt-8 px-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Sign Out Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
