import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Search, Filter, MapPin, DollarSign, Clock, Heart, Loader2, User } from 'lucide-react';
import { jobsAPI, savedJobsAPI, applicationsAPI } from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Jobsearch() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
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

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const filteredParams = Object.fromEntries(
          Object.entries(searchParams).filter(([_, v]) => v !== '' && v !== false)
        );
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchParams]);

  const fetchSavedJobs = async () => {
    try {
      const response = await savedJobsAPI.getSavedJobs({ page: 1, limit: 100 });
      if (response.savedJobs) {
        const savedIds = new Set(response.savedJobs.map((j) => j.job.id));
        setSavedJobs(savedIds);
      }
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const onSubmit = (data) => {
    setSearchParams((prev) => ({
      ...prev,
      page: 1,
      search: data.jobTitle || '',
      location: data.location || '',
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      page: 1,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePageChange = (page) => {
    setSearchParams((prev) => ({
      ...prev,
      page,
    }));
  };

  const toggleSaveJob = async (jobId) => {
    try {
      const isSaved = savedJobs.has(jobId);
      if (isSaved) {
        await savedJobsAPI.unsaveJob(jobId);
        setSavedJobs((prev) => {
          const updated = new Set(prev);
          updated.delete(jobId);
          return updated;
        });
        toast.success('Removed from saved jobs');
      } else {
        await savedJobsAPI.saveJob(jobId);
        setSavedJobs((prev) => new Set(prev).add(jobId));
        toast.success('Saved job');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to save/unsave job');
    }
  };

  const handleApply = async (jobId) => {
    try {
      setApplyingJobId(jobId);
      await applicationsAPI.apply(jobId);
      toast.success('Application submitted');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to apply');
    } finally {
      setApplyingJobId(null);
    }
  };

  const formatSalary = (salary) => salary || 'Salary not specified';
  const formatDate = (d) => {
    const date = new Date(d);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diff < 1) return 'Today';
    if (diff === 1) return '1 day ago';
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} week(s) ago`;
    return `${Math.floor(diff / 30)} month(s) ago`;
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              {...register('jobTitle')}
              type="text"
              placeholder="Job title, keywords..."
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              {...register('location')}
              type="text"
              placeholder="Location"
              className="w-full px-4 py-2 border rounded-lg"
            />
            <div className="flex space-x-2">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border rounded-lg"
              >
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <select name="type" onChange={handleFilterChange} className="border rounded-lg px-4 py-2">
                <option value="">Job Type</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
              </select>
              <select name="category" onChange={handleFilterChange} className="border rounded-lg px-4 py-2">
                <option value="">Category</option>
                <option value="IT">IT</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
              </select>
              <select name="experience" onChange={handleFilterChange} className="border rounded-lg px-4 py-2">
                <option value="">Experience</option>
                <option value="Entry">Entry</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
              </select>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isRemote" onChange={handleFilterChange} />
                Remote
              </label>
            </div>
          )}
        </form>
      </div>

      {/* Job Results */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">Loading jobs...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-gray-600 py-12">No jobs found</div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-bold">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.employee?.companyName}</p>
                  <div className="text-sm text-gray-500 flex gap-4 mt-2">
                    <span><MapPin className="inline w-4 h-4" /> {job.location}</span>
                    <span><DollarSign className="inline w-4 h-4" /> {formatSalary(job.salary)}</span>
                    <span><Clock className="inline w-4 h-4" /> {formatDate(job.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleSaveJob(job.id)}>
                    <Heart
                      className={`w-5 h-5 ${savedJobs.has(job.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                    />
                  </button>
                  <button
                    onClick={() => handleApply(job.id)}
                    disabled={applyingJobId === job.id}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    {applyingJobId === job.id ? <Loader2 className="animate-spin w-4 h-4 mr-2 inline" /> : null}
                    Apply
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 border rounded-lg ${
                  currentPage === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
