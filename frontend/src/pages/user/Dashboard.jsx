import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { MapPin, DollarSign, Calendar, FileText, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const Dashboard = () => {
  const { token, user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalApplications: 0,
      profileViews: 0,
      acceptedApplications: 0,
      interviewCalls: 0
    },
    recentApplications: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/jobseeker');

      if (response.success) {
        // Only keep stats and recentApplications
        setDashboardData({
          stats: response.stats,
          recentApplications: response.recentApplications
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <Button onClick={fetchDashboardData} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const { stats, recentApplications } = dashboardData;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          View All Jobs
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">Applications Sent</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.acceptedApplications}</div>
            <p className="text-xs text-muted-foreground">Accepted Applications</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentApplications.length > 0 ? (
              recentApplications.slice(0, 5).map((application) => (
                <div key={application.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {application.job?.companyImage ? (
                          <img
                            src={`http://localhost:3000/api${application.job.companyImage}`}
                            alt={application.job?.employee?.companyName}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <span
                          className={`text-blue-600 font-semibold text-lg ${application.job?.companyImage ? 'hidden' : 'flex'}`}
                          style={{ display: application.job?.companyImage ? 'none' : 'flex' }}
                        >
                          {application.job?.employee?.companyName?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{application.job?.title}</h3>
                        <p className="text-sm text-gray-600">{application.job?.employee?.companyName}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {application.job?.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {application.job?.salary}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(application.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        application.status === 'Shortlisted' || application.status === 'Hired'
                          ? 'default'
                          : application.status === 'Under Review'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {application.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No applications yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
