import React, { useState, useEffect } from 'react';
import { Briefcase, Building2, Users, DollarSign, Eye, Edit, Loader2, AlertCircle } from 'lucide-react';
import { adminAPI } from '../../utils/api';
import { toast } from 'react-hot-toast';

const OverviewComponent = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getDashboardStats();
      setDashboardData(response);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getDashboardStats = () => {
    if (!dashboardData?.stats) return [];
    
    const { stats } = dashboardData;
    return [
      { 
        title: 'Total Jobs', 
        value: stats.totalJobs?.toString() || '0', 
        change: '+12%', 
        icon: Briefcase, 
        color: 'bg-blue-500',
        trend: 'up'
      },
      { 
        title: 'Total Employees', 
        value: stats.totalEmployees?.toString() || '0', 
        change: '+8%', 
        icon: Building2, 
        color: 'bg-green-500',
        trend: 'up'
      },
      { 
        title: 'Job Seekers', 
        value: stats.totalJobSeekers?.toString() || '0', 
        change: '+23%', 
        icon: Users, 
        color: 'bg-indigo-500',
        trend: 'up'
      },
      { 
        title: 'Applications', 
        value: stats.totalApplications?.toString() || '0', 
        change: '+15%', 
        icon: DollarSign, 
        color: 'bg-purple-500',
        trend: 'up'
      }
    ];
  };

  const getRecentJobs = () => {
    return dashboardData?.recentJobs || [];
  };

  const getRecentApplications = () => {
    return dashboardData?.recentApplications || [];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Active': 'bg-green-100 text-green-700',
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Verified': 'bg-green-100 text-green-700',
      'Inactive': 'bg-red-100 text-red-700'
    };
    return statusConfig[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getDashboardStats().map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Jobs and Companies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Jobs</h3>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                View all
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {getRecentJobs().length > 0 ? (
                getRecentJobs().map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{job.title}</h4>
                      <p className="text-sm text-gray-500">{job.employee?.companyName || 'Unknown Company'} • {job.location}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(job.status)}`}>
                          {job.status}
                        </span>
                        <span className="text-xs text-gray-500">{formatDate(job.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent jobs found</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                View all
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {getRecentApplications().length > 0 ? (
                getRecentApplications().map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">
                          {application.jobSeeker?.firstName?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {application.jobSeeker?.firstName} {application.jobSeeker?.lastName}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Applied for: {application.job?.title || 'Unknown Job'}
                        </p>
                        <div className="flex items-center mt-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(application.status || 'Pending')}`}>
                            {application.status || 'Pending'}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">{formatDate(application.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent applications found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewComponent;
