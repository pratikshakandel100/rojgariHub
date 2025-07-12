import React, { useState, useEffect } from 'react';
import { MapPin, DollarSign, Clock, Trash2, ExternalLink, Loader2, AlertCircle, User } from 'lucide-react';
import { savedJobsAPI, applicationsAPI } from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function SavedJobs() {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [removingJobId, setRemovingJobId] = useState(null);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const limit = 10;

  useEffect(() => {
    fetchSavedJobs();
  }, [currentPage]);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await savedJobsAPI.getSavedJobs({
        page: currentPage,
        limit
      });
      setSavedJobs(response.savedJobs || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load saved jobs';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (jobId) => {
    try {
      setRemovingJobId(jobId);
      await savedJobsAPI.unsaveJob(jobId);
      setSavedJobs(prev => prev.filter(savedJob => savedJob.job.id !== jobId));
      toast.success('Job removed from saved jobs');
    } catch (error) {
      console.error('Error removing saved job:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to remove job';
      toast.error(errorMessage);
    } finally {
      setRemovingJobId(null);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading saved jobs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading saved jobs</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={fetchSavedJobs}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
        <span className="text-sm text-gray-500">{savedJobs.length} jobs saved</span>
      </div>

      <div className="space-y-4">
        {savedJobs.map((savedJob) => {
          const job = savedJob.job;
          const employee = job.employee;
          return (
            <div key={savedJob.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                {job.companyImage ? (
                  <img 
                    src={`http://localhost:5000/api${job.companyImage}`} 
                    alt={job.company || 'Company'}
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
                  {job.company?.charAt(0) || job.title.charAt(0)}
                </span>
              </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-gray-600 mb-2">{job.company || 'Company'}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {job.salary || 'Not specified'}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleApply(job.id)}
                    disabled={applyingJobId === job.id}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {applyingJobId === job.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <ExternalLink className="h-4 w-4 mr-2" />
                    )}
                    Apply
                  </button>
                  <button
                    onClick={() => handleRemove(job.id)}
                    disabled={removingJobId === job.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {removingJobId === job.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {savedJobs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">💼</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No saved jobs yet</h3>
          <p className="text-gray-500">Start saving jobs you're interested in to see them here.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-3 py-2 text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

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
