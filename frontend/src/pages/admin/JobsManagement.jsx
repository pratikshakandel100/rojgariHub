import React, { useState, useEffect } from "react";
import { Filter, Download, Plus, Eye, Edit, Trash2, X, MapPin, Clock, DollarSign, Users, Save, AlertCircle, Search, Calendar, Building, Mail, Phone, Globe, Briefcase, Loader2 } from "lucide-react";
import { adminAPI } from '../../utils/api';

const JobsManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [limit] = useState(10);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit,
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus !== 'all' && { status: filterStatus })
      };
      
      const response = await adminAPI.getJobs(params);
      
      if (response.success) {
        setJobs(response.jobs);
        setTotalJobs(response.totalJobs);
        setTotalPages(response.totalPages);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle job deletion
  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        const response = await adminAPI.deleteJob(jobId);
        if (response.success) {
          await fetchJobs(); // Refresh the jobs list
        }
      } catch (err) {
        setError(err.message);
        console.error('Error deleting job:', err);
      }
    }
  };

  // Get filtered jobs (filtering is now handled by the API)
  const filteredJobs = jobs;

  // Fetch jobs when component mounts or dependencies change
  useEffect(() => {
    fetchJobs();
  }, [currentPage, searchTerm, filterStatus]);
  const [editFormData, setEditFormData] = useState({});
  const [newRequirement, setNewRequirement] = useState("");
  const [newBenefit, setNewBenefit] = useState("");

  const jobTypes = ["Full Time", "Part Time", "Remote", "Contract", "Internship"];
  const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Executive"];
  const industries = ["Technology", "Design & Creative", "Fintech", "Data & Analytics", "Healthcare", "Education", "Marketing"];
  const companySizes = ["1-10 employees", "10-50 employees", "50-100 employees", "100-500 employees", "500-1000 employees", "1000+ employees"];

  const handleViewJob = (job) => {
    setSelectedJob(job);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setEditFormData({
      ...job,
      requirements: Array.isArray(job.requirements) ? [...job.requirements] : [],
      benefits: Array.isArray(job.benefits) ? [...job.benefits] : []
    });
  };

  const closeModal = () => {
    setSelectedJob(null);
    setEditingJob(null);
    setEditFormData({});
    setNewRequirement("");
    setNewBenefit("");
  };

  const handleInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setEditFormData(prev => ({
        ...prev,
        requirements: [...(prev.requirements || []), newRequirement.trim()]
      }));
      setNewRequirement("");
    }
  };

  const removeRequirement = (index) => {
    setEditFormData(prev => ({
      ...prev,
      requirements: (prev.requirements || []).filter((_, i) => i !== index)
    }));
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setEditFormData(prev => ({
        ...prev,
        benefits: [...(prev.benefits || []), newBenefit.trim()]
      }));
      setNewBenefit("");
    }
  };

  const removeBenefit = (index) => {
    setEditFormData(prev => ({
      ...prev,
      benefits: (prev.benefits || []).filter((_, i) => i !== index)
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      await adminAPI.updateJob(editingJob.id, editFormData);
      
      // Update local state with the new data
      setJobs(jobs.map(job => 
        job.id === editingJob.id ? { ...job, ...editFormData } : job
      ));
      
      closeModal();
      // Optionally show success message
      console.log('Job updated successfully');
    } catch (error) {
      console.error('Error updating job:', error);
      setError('Failed to update job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Jobs Management</h1>
              <p className="text-gray-600">Manage and monitor all job postings ({totalJobs} total jobs)</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {/* Search and Filter Controls */}
            <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search jobs by title, company, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                  <button className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </button>
                  <button className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Jobs Management Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Jobs Management</h2>
                  <p className="text-gray-600">Manage all job postings and applications</p>
                </div>
                <div className="flex space-x-3">
                 
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mr-3" />
                    <span className="text-gray-600">Loading jobs...</span>
                  </div>
                </div>
              )}

              {/* Jobs Table */}
              {!loading && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                          <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                          <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                          <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                          <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {jobs.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="px-6 py-12 text-center">
                              <div className="text-gray-500">
                                <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p className="text-lg font-medium mb-2">No jobs found</p>
                                <p className="text-sm">Try adjusting your search or filter criteria</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          jobs.map((job) => (
                            <tr key={job.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                 <div>
                                   <div className="font-medium text-gray-900">{job.title}</div>
                                   <div className="text-sm text-gray-500">{job.salary || 'Salary not specified'}</div>
                                 </div>
                               </td>
                               <td className="px-6 py-4 text-sm text-gray-900">{job.employee?.companyName || 'N/A'}</td>
                               <td className="px-6 py-4 text-sm text-gray-900">{job.location}</td>
                               <td className="px-6 py-4 text-sm text-gray-900">{job.employmentType || job.type}</td>
                               <td className="px-6 py-4 text-sm text-gray-900">{job.applicationsCount || 0}</td>
                              <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleViewJob(job)}
                                    className="p-1 text-gray-400 hover:text-gray-600"
                                    title="View Details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleEditJob(job)}
                                    className="p-1 text-gray-400 hover:text-gray-600"
                                    title="Edit Job"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteJob(job.id)}
                                    className="p-1 text-gray-400 hover:text-red-600"
                                    title="Delete Job"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalJobs)} of {totalJobs} jobs
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1 text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

      {/* Job Details Modal (View) */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h3>
                <p className="text-gray-600">{selectedJob.company}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Job Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{selectedJob.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{selectedJob.type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{selectedJob.salary}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{selectedJob.applications} applications</span>
                </div>
              </div>

              {/* Company Information */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Company Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Industry:</span>
                    <span className="ml-2 text-gray-900">{selectedJob.industry}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Company Size:</span>
                    <span className="ml-2 text-gray-900">{selectedJob.companySize}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Experience Level:</span>
                    <span className="ml-2 text-gray-900">{selectedJob.experienceLevel}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Posted:</span>
                    <span className="ml-2 text-gray-900">{selectedJob.posted}</span>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Job Description</h4>
                <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
              </div>

              {/* Requirements */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
                <ul className="space-y-2">
                  {selectedJob.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Benefits & Perks</h4>
                <ul className="space-y-2">
                  {selectedJob.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Information */}
              <div className="bg-indigo-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <span className="ml-2 text-indigo-600">{selectedJob.contactEmail}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <span className="ml-2 text-gray-900">{selectedJob.contactPhone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedJob(null);
                  handleEditJob(selectedJob);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Edit Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Edit Modal */}
      {editingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Edit Job</h3>
                <p className="text-gray-600">Update job details and requirements</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Edit Form */}
            <div className="p-6">
              <form className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                    <input
                      type="text"
                      value={editFormData.title || ""}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      value={editFormData.company || ""}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={editFormData.location || ""}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                    <input
                      type="text"
                      value={editFormData.salary || ""}
                      onChange={(e) => handleInputChange("salary", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Dropdown Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                    <select
                      value={editFormData.type || ""}
                      onChange={(e) => handleInputChange("type", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {jobTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                    <select
                      value={editFormData.experienceLevel || ""}
                      onChange={(e) => handleInputChange("experienceLevel", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {experienceLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <select
                      value={editFormData.industry || ""}
                      onChange={(e) => handleInputChange("industry", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                    <select
                      value={editFormData.companySize || ""}
                      onChange={(e) => handleInputChange("companySize", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {companySizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                    <input
                      type="email"
                      value={editFormData.contactEmail || ""}
                      onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                    <input
                      type="tel"
                      value={editFormData.contactPhone || ""}
                      onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                  <textarea
                    value={editFormData.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                  <div className="space-y-2 mb-3">
                    {editFormData.requirements?.map((requirement, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={requirement}
                          onChange={(e) => {
                            const newRequirements = [...editFormData.requirements];
                            newRequirements[index] = e.target.value;
                            handleInputChange("requirements", newRequirements);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      placeholder="Add new requirement"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={addRequirement}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Benefits & Perks</label>
                  <div className="space-y-2 mb-3">
                    {editFormData.benefits?.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={benefit}
                          onChange={(e) => {
                            const newBenefits = [...editFormData.benefits];
                            newBenefits[index] = e.target.value;
                            handleInputChange("benefits", newBenefits);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeBenefit(index)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      placeholder="Add new benefit"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={addBenefit}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
              </div>
            </div>
          )}
    </div>
  );
};

export default JobsManagement;
