import React, { useState, useEffect } from 'react';
import { Briefcase, Users, Eye, Check, Plus } from 'lucide-react';
import { dashboardAPI } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalJobs: 0,
      activeJobs: 0,
      totalApplications: 0,
      pendingApplications: 0,
      applicationsThisWeek: 0
    },
    recentApplications: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getEmployeeDashboard();
      if (response.success) {
        setDashboardData({
          stats: response.stats,
          recentApplications: response.recentApplications
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const { totalJobs, activeJobs, totalApplications, pendingApplications } = dashboardData.stats;
  const { recentApplications } = dashboardData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <button
          onClick={() => navigate('/employee/postjob')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Post New Job</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Jobs</p>
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{totalJobs}</p>
              )}
            </div>
            <div className="bg-blue-50 p-3 rounded-full">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Applications</p>
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{totalApplications}</p>
              )}
            </div>
            <div className="bg-green-50 p-3 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Jobs</p>
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{activeJobs}</p>
              )}
            </div>
            <div className="bg-yellow-50 p-3 rounded-full">
              <Eye className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Reviews</p>
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{pendingApplications}</p>
              )}
            </div>
            <div className="bg-purple-50 p-3 rounded-full">
              <Check className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading applications...</p>
            </div>
          ) : recentApplications.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No applications yet</p>
            </div>
          ) : (
            recentApplications.map((application) => (
              <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {application.jobSeeker?.firstName?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {application.jobSeeker?.firstName} {application.jobSeeker?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{application.job?.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      application.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      application.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                      application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {application.status}
                    </span>
                    <button
                      onClick={() => navigate('/employee/applications')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;