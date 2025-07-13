import React, { useState, useEffect } from 'react';
import { Plus, Building, MapPin, DollarSign, Calendar, Users, Edit, Clock, Trash2, Eye, Briefcase, Zap, Crown, Star } from 'lucide-react';
import { jobsAPI } from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Jobs = ({ setActiveTab }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployeeJobs();
  }, []);

  const fetchEmployeeJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getEmployeeJobs();
      if (response.success) {
        setJobs(response.jobs || []);
      } else {
        toast.error('Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching employee jobs:', error);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobsAPI.delete(jobId);
        toast.success('Job deleted successfully');
        fetchEmployeeJobs(); // Refresh the list
      } catch (error) {
        console.error('Error deleting job:', error);
        toast.error('Failed to delete job');
      }
    }
  };

  const handlePostNewJob = () => {
    if (setActiveTab) {
      setActiveTab('post-job');
    } else {
      navigate('/employee/post-job');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Posted Jobs</h2>
        <button
          onClick={handlePostNewJob}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Post New Job</span>
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
            <p className="text-gray-600 mb-4">Start by posting your first job to attract talented candidates.</p>
            <button
              onClick={handlePostNewJob}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Post Your First Job</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => {
            const requirements = Array.isArray(job.requirements) ? job.requirements : 
              (typeof job.requirements === 'string' ? JSON.parse(job.requirements || '[]') : []);
            
            const isBoosted = job.boosts && job.boosts.length > 0;
            const boostType = isBoosted ? job.boosts[0].boostType : null;
            const boostStatus = isBoosted ? job.boosts[0].status : null;
            
            const getBoostIcon = (type) => {
              switch(type) {
                case 'Premium': return <Crown className="h-4 w-4" />;
                case 'Standard': return <Zap className="h-4 w-4" />;
                case 'Basic': return <Star className="h-4 w-4" />;
                default: return <Zap className="h-4 w-4" />;
              }
            };
            
            const getBoostColor = (type) => {
              switch(type) {
                case 'Premium': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
                case 'Standard': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
                case 'Basic': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
                default: return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
              }
            };
            
            const getBoostStatusColor = (status) => {
              switch(status) {
                case 'Approved': return 'bg-green-100 text-green-800';
                case 'Pending': return 'bg-yellow-100 text-yellow-800';
                case 'Rejected': return 'bg-red-100 text-red-800';
                default: return 'bg-gray-100 text-gray-800';
              }
            };
            
            return (
              <div key={job.id} className={`bg-white rounded-lg shadow-sm p-6 border ${
                isBoosted ? 'border-2 border-gradient-to-r from-yellow-400 to-orange-500 shadow-lg' : 'border-gray-200'
              } ${isBoosted ? 'relative overflow-hidden' : ''}`}>
                {isBoosted && (
                  <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-yellow-400">
                    <div className="absolute -top-12 -right-1 text-white text-xs font-bold transform rotate-45">
                      BOOSTED
                    </div>
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      {isBoosted && (
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getBoostColor(boostType)}`}>
                            {getBoostIcon(boostType)}
                            <span>{boostType} Boost</span>
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBoostStatusColor(boostStatus)}`}>
                            {boostStatus}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        job.status === 'Active' ? 'bg-green-100 text-green-800' :
                        job.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>${job.salary}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 mt-2">{job.description}</p>
                    {requirements.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {requirements.map((req, index) => (
                          <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm">
                            {req}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="ml-6 text-right">
                    <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                      <Users className="h-4 w-4" />
                      <span>{job.applicationsCount || 0} applications</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600 mb-4">
                      <Eye className="h-4 w-4" />
                      <span>{job.views || 0} views</span>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button 
                        onClick={() => navigate(`/employee/applications?jobId=${job.id}`)}
                        className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
                      >
                        <Users className="h-4 w-4" />
                        <span>View Applications</span>
                      </button>
                      <button 
                        onClick={() => navigate(`/employee/jobs/edit/${job.id}`)}
                        className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors flex items-center space-x-1"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteJob(job.id)}
                        className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition-colors flex items-center space-x-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Jobs;