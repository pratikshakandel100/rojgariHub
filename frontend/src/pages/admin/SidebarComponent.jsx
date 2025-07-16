import React from "react";
import {
  BarChart3,
  Briefcase,
  Building2,
  Users,
  TrendingUp,
  Settings,
  Zap,
} from "lucide-react";

const SidebarComponent = ({ activeTab, setActiveTab }) => {
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "jobs", label: "Jobs Management", icon: Briefcase },
    { id: "companies", label: "Companies", icon: Building2 },
    { id: "users", label: "Users", icon: Users },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "boost", label: "Boost Management", icon: Zap },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="ml-2 text-xl font-bold text-gray-900">
            RojgariHub
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">Admin Dashboard</p>
      </div>

      <nav className="mt-6">
        {sidebarItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                activeTab === item.id
                  ? "bg-indigo-50 text-indigo-600 border-r-2 border-indigo-600"
                  : "text-gray-600"
              }`}
            >
              <IconComponent className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default SidebarComponent;
