import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Search, Filter, MapPin, DollarSign, Clock, Heart, Loader2, User } from 'lucide-react';
import { jobsAPI, savedJobsAPI, applicationsAPI } from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Jobsearch() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch } = useForm();
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
    search: '',
    location: '',
    type: '',
    category: '',
    experience: '',
    isRemote: false
  });
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch jobs from API
  const fetchJobs = async (params = searchParams) => {
    try {
      setLoading(true);
      setError(null);
      
      // Filter out empty values
      const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== '' && value !== false && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});
      
      const response = await jobsAPI.getAll(filteredParams);
      
      if (response.success) {
        setJobs(response.jobs || []);
        setTotalPages(response.totalPages || 1);
        setCurrentPage(response.currentPage || 1);
      } else {
        setError('Failed to fetch jobs');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch saved jobs to check which ones are already saved
  const fetchSavedJobs = async () => {
    try {
      const response = await savedJobsAPI.getSavedJobs({ page: 1, limit: 100 });
      if (response.savedJobs) {
        const savedJobIds = new Set(response.savedJobs.map(savedJob => savedJob.job.id));
        setSavedJobs(savedJobIds);
      }
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  };

  // Load jobs and saved jobs on component mount
  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
  }, []);

  const onSubmit = (data) => {
    const newSearchParams = {
      ...searchParams,
      page: 1,
      search: data.jobTitle || '',
      location: data.location || ''
    };
    setSearchParams(newSearchParams);
    fetchJobs(newSearchParams);
  };

  const handleFilterChange = (filterType, value) => {
    const newSearchParams = {
      ...searchParams,
      page: 1,
      [filterType]: value
    };
    setSearchParams(newSearchParams);
    fetchJobs(newSearchParams);
  };

  const handlePageChange = (page) => {
    const newSearchParams = {
      ...searchParams,
      page
    };
    setSearchParams(newSearchParams);
    fetchJobs(newSearchParams);
  };

  const toggleSaveJob = async (jobId) => {
    try {
      const isCurrentlySaved = savedJobs.has(jobId);
      
      if (isCurrentlySaved) {
        await savedJobsAPI.unsaveJob(jobId);
        setSavedJobs(prev => {
          const newSaved = new Set(prev);
          newSaved.delete(jobId);
          return newSaved;
        });
        toast.success('Job removed from saved jobs');
      } else {
        await savedJobsAPI.saveJob(jobId);
        setSavedJobs(prev => {
          const newSaved = new Set(prev);
          newSaved.add(jobId);
          return newSaved;
        });
        toast.success('Job saved successfully');
      }
    } catch (error) {
      console.error('Error toggling save job:', error);
      toast.error(error.message || 'Failed to save/unsave job');
    }
  };

  const handleApply = async (jobId) => {
    try {
      setApplyingJobId(jobId);
      await applicationsAPI.apply(jobId);
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying to job:', error);
      const errorData = error.response?.data;
      
      const errorMessage = errorData?.message || error.message || 'Failed to apply to job';
      toast.error(errorMessage);
    } finally {
      setApplyingJobId(null);
    }
  };

  const formatSalary = (salary) => {
    return salary || 'Salary not specified';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                {...register('jobTitle')}
                type="text"
                placeholder="Job title, keywords..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <input
                {...register('location')}
                type="text"
                placeholder="Location"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Search className="h-5 w-5 inline mr-2" />
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading jobs...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error}</div>
            <button 
              onClick={() => fetchJobs()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600 mb-4">No jobs found matching your criteria.</div>
            <button 
              onClick={() => {
                setSearchParams({
                  page: 1,
                  limit: 10,
                  search: '',
                  location: '',
                  type: '',
                  category: '',
                  experience: '',
                  isRemote: false
                });
                fetchJobs({
                  page: 1,
                  limit: 10
                });
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {jobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {job.companyImage ? (
                    <img 
                      src={`http://localhost:5000/api${job.companyImage}`} 
                      alt={job.employee?.companyName || 'Company'}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <span 
                    className="text-blue-600 font-semibold text-lg w-full h-full flex items-center justify-center"
                    style={{ display: job.companyImage ? 'none' : 'flex' }}
                  >
                    {job.employee?.companyName?.charAt(0) || 'C'}
                  </span>
                </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                      <p className="text-gray-600 mb-2">{job.employee?.companyName || 'Company'}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                          {job.isRemote && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                              Remote
                            </span>
                          )}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {formatSalary(job.salary)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDate(job.createdAt)}
                        </div>
                      </div>
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {job.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              +{job.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => toggleSaveJob(job.id)}
                      className={`p-2 rounded-full transition-colors ${
                        savedJobs.has(job.id)
                          ? 'text-red-500 bg-red-50'
                          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${savedJobs.has(job.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button 
                      onClick={() => handleApply(job.id)}
                      disabled={applyingJobId === job.id}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {applyingJobId === job.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 border rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Resume Upload Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <User className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Resume Required
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Please upload your resume first on your profile before applying for jobs.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowResumeModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowResumeModal(false);
                    navigate('/profile');
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <User className="h-4 w-4 mr-2" />
                  Go to Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
