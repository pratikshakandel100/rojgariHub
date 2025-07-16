import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Briefcase, DollarSign, Calendar, Loader2 } from 'lucide-react';
import { adminAPI } from '../../utils/api';
import { toast } from 'react-hot-toast';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [topPerformingJobs, setTopPerformingJobs] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAnalytics({ period });
      
      if (response.success) {
        const { summary, topJobs, topCompanies: companies } = response.analytics;
        
        setAnalyticsData([
          {
            title: 'Monthly Revenue',
            value: summary.revenue.formatted,
            change: `${summary.revenue.change >= 0 ? '+' : ''}${summary.revenue.change}%`,
            icon: DollarSign,
            color: 'bg-green-500'
          },
          {
            title: 'New Users',
            value: summary.users.value.toLocaleString(),
            change: `${summary.users.change >= 0 ? '+' : ''}${summary.users.change}%`,
            icon: Users,
            color: 'bg-blue-500'
          },
          {
            title: 'Job Applications',
            value: summary.applications.value.toLocaleString(),
            change: `${summary.applications.change >= 0 ? '+' : ''}${summary.applications.change}%`,
            icon: Briefcase,
            color: 'bg-purple-500'
          },
          {
            title: 'Success Rate',
            value: `${summary.successRate.value}%`,
            change: `${summary.successRate.change}%`,
            icon: TrendingUp,
            color: 'bg-indigo-500'
          }
        ]);
        
        setTopPerformingJobs(topJobs);
        setTopCompanies(companies);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
          <p className="text-gray-600">View detailed analytics and generate reports</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
          {loading && (
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          )}
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-pulse">
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="w-16 h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="w-20 h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))
        ) : (
          analyticsData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{item.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                    <p className="text-sm text-green-600 mt-1">{item.change} from last month</p>
                  </div>
                  <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Jobs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Jobs</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse">
                    <div>
                      <div className="w-32 h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="w-24 h-3 bg-gray-200 rounded"></div>
                    </div>
                    <div className="text-right">
                      <div className="w-16 h-4 bg-gray-200 rounded mb-1"></div>
                      <div className="w-12 h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))
              ) : topPerformingJobs.length > 0 ? (
                topPerformingJobs.map((job, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{job.title}</h4>
                      <p className="text-sm text-gray-500">{job.views} views</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{job.applications}</p>
                      <p className="text-sm text-gray-500">applications</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No job data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Top Companies */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Companies</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
                      <div>
                        <div className="w-28 h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="w-20 h-3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-12 h-4 bg-gray-200 rounded mb-1"></div>
                      <div className="w-16 h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))
              ) : topCompanies.length > 0 ? (
                topCompanies.map((company, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">{company.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{company.name}</h4>
                        <p className="text-sm text-gray-500">{company.jobs} active jobs</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{company.applications}</p>
                      <p className="text-sm text-gray-500">applications</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No company data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
