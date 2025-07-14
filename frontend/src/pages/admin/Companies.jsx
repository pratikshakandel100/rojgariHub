import React, { useState, useEffect } from 'react';
import { Plus, Filter, Download, Eye, Edit, Trash2, CheckCircle, XCircle, X, MapPin, Users, Building, Mail, Calendar, Save, Loader2, AlertCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminAPI } from '../../utils/api';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [limit] = useState(10);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchCompanies();
  }, [currentPage, searchTerm, filterStatus]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        limit,
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus !== 'all' && { status: filterStatus })
      };
      
      const response = await adminAPI.getCompanies(params);
      setCompanies(response.companies);
      setTotalCompanies(response.totalCompanies);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (companyId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await adminAPI.toggleCompanyStatus(companyId, newStatus);
      await fetchCompanies();
    } catch (err) {
      setError(err.message);
    }
  };

  const industries = ['Technology', 'Design', 'Fintech', 'Healthcare', 'Education', 'Marketing', 'Manufacturing', 'Retail'];
  const employeeSizes = ['1-10', '10-50', '50-100', '100-500', '500-1000', '1000+'];
  const companyTypes = ['Private', 'Public', 'Startup', 'Non-profit', 'Government'];
  const revenueRanges = ['Under $1M', '$1M - $5M', '$5M - $10M', '$10M - $25M', '$25M - $50M', '$50M - $100M', '$100M+'];

  const handleViewCompany = async (company) => {
    try {
      const response = await adminAPI.getCompanyById(company._id);
      setSelectedCompany(response.company);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setEditFormData({
      name: company.name,
      industry: company.industry || '',
      employees: company.employees || '',
      email: company.email,
      location: company.location || '',
      phone: company.phone || '',
      website: company.website || '',
      description: company.description || '',
      foundedYear: company.foundedYear || '',
      companyType: company.companyType || '',
      headquarters: company.headquarters || '',
      ceo: company.ceo || '',
      revenue: company.revenue || ''
    });
  };

  const handleDeleteCompany = (companyId) => {
    setCompanies(companies.filter(company => company.id !== companyId));
  };

  const closeModal = () => {
    setSelectedCompany(null);
    setEditingCompany(null);
    setEditFormData({});
  };

  const handleInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = () => {
    setCompanies(companies.map(company => 
      company.id === editingCompany.id 
        ? { ...company, ...editFormData }
        : company
    ));
    closeModal();
  };

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return 'bg-green-100 text-green-800';
    } else if (status === 'inactive') {
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };




  return (
    <div className="space-y-6">
      {/* Companies Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Companies Management</h2>
          <p className="text-gray-600">Manage company profiles and verifications ({totalCompanies} total)</p>
        </div>
        <div className="flex space-x-3">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search companies by name, industry, or location..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Companies Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading companies...</span>
        </div>
      ) : companies.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {searchTerm || filterStatus ? 
              "Try adjusting your search or filter to find what you're looking for." : 
              "There are no companies registered in the system yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div key={company._id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-lg">{company.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{company.name}</h3>
                    <p className="text-sm text-gray-500">{company.industry}</p>
                  </div>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(company.isActive ? 'active' : 'inactive')}`}>
                    {company.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Employees:</span> {company.employees || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Active Jobs:</span> {company.activeJobs || 0}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Location:</span> {company.location || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {company.email}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Joined:</span> {new Date(company.joinedDate).toLocaleDateString()}
                </p>
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => handleViewCompany(company)}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
                <button 
                  onClick={() => handleEditCompany(company)}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
               
                <button 
                  onClick={() => handleStatusToggle(company._id, !company.isActive)}
                  className={`flex items-center justify-center px-3 py-2 text-sm ${company.isActive ? 'text-red-600 border-red-300 hover:bg-red-50' : 'text-green-600 border-green-300 hover:bg-green-50'} border rounded-lg`}
                >
                  {company.isActive ? <Trash2 className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && companies.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Showing {companies.length} of {totalCompanies} companies
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 border rounded-lg ${currentPage === 1 ? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
              {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage >= totalPages}
              className={`px-3 py-2 border rounded-lg ${currentPage >= totalPages ? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Company Details Modal (View) */}
      {selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-indigo-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-xl">{selectedCompany.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedCompany.name}</h3>
                  <p className="text-gray-600">{selectedCompany.industry || 'No industry specified'}</p>
                </div>
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
              {/* Company Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{selectedCompany.location || 'No location specified'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{selectedCompany.employees || 'N/A'} employees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{selectedCompany.activeJobs || 0} active jobs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Joined {new Date(selectedCompany.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Company Information */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Company Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getStatusBadge(selectedCompany.isActive ? 'active' : 'inactive')}`}>
                      {selectedCompany.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Founded:</span>
                    <span className="ml-2 text-gray-900">{selectedCompany.foundedYear || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Company Type:</span>
                    <span className="ml-2 text-gray-900">{selectedCompany.companyType || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Revenue:</span>
                    <span className="ml-2 text-gray-900">{selectedCompany.revenue || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">CEO:</span>
                    <span className="ml-2 text-gray-900">{selectedCompany.ceo || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Headquarters:</span>
                    <span className="ml-2 text-gray-900">{selectedCompany.headquarters || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Company Description */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Company Description</h4>
                <p className="text-gray-700 leading-relaxed">{selectedCompany.description || 'No description available.'}</p>
              </div>

              {/* Jobs Information */}
              {selectedCompany.jobs && selectedCompany.jobs.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Active Jobs ({selectedCompany.jobs.length})</h4>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedCompany.jobs.map(job => (
                          <tr key={job._id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-600">{job.title}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{job.employmentType}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{job.location}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-indigo-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <span className="ml-2 text-indigo-600">{selectedCompany.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <span className="ml-2 text-gray-900">{selectedCompany.phone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Website:</span>
                    <span className="ml-2 text-indigo-600">{selectedCompany.website || 'N/A'}</span>
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
                  setSelectedCompany(null);
                  handleEditCompany(selectedCompany);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Edit Company
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Company Edit Modal */}
      {editingCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Edit Company</h3>
                <p className="text-gray-600">Update company details and information</p>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      value={editFormData.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={editFormData.location || ""}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Headquarters</label>
                    <input
                      type="text"
                      value={editFormData.headquarters || ""}
                      onChange={(e) => handleInputChange("headquarters", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Company Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee Count</label>
                    <select
                      value={editFormData.employees || ""}
                      onChange={(e) => handleInputChange("employees", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {employeeSizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Type</label>
                    <select
                      value={editFormData.companyType || ""}
                      onChange={(e) => handleInputChange("companyType", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {companyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Founded Year</label>
                    <input
                      type="text"
                      value={editFormData.foundedYear || ""}
                      onChange={(e) => handleInputChange("foundedYear", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Leadership & Financial */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CEO</label>
                    <input
                      type="text"
                      value={editFormData.ceo || ""}
                      onChange={(e) => handleInputChange("ceo", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Revenue Range</label>
                    <select
                      value={editFormData.revenue || ""}
                      onChange={(e) => handleInputChange("revenue", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {revenueRanges.map(range => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editFormData.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={editFormData.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      value={editFormData.website || ""}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Company Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
                  <textarea
                    value={editFormData.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
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

export default Companies;
