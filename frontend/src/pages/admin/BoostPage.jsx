import React, { useState, useEffect, useCallback } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { boostAPI, adminAPI, boostPlanAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { Loader2, AlertTriangle } from 'lucide-react';
import { 
  Zap, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  CreditCard,
  Receipt,
  RefreshCw,
  FileText,
  Wallet
} from 'lucide-react';

const BoostPage = () => {
  const [activeTab, setActiveTab] = useState('financial');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  
  // Create boost form state
  const [createBoostForm, setCreateBoostForm] = useState({
    jobId: '',
    employeeId: '',
    boostPlanId: '',
    paymentMethod: 'pending'
  });
  const [availableBoostPlans, setAvailableBoostPlans] = useState([]);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  
  // Debounce search term to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // State for boost data
  const [boostPosts, setBoostPosts] = useState([]);
  const [financialData, setFinancialData] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    platformFees: 0,
    netProfit: 0,
    pendingPayments: 0,
    refundedAmount: 0,
    averageBoostPrice: 0,
    conversionRate: 0
  });

  // Fetch data when component mounts or when search/filter/pagination changes
  useEffect(() => {
    fetchBoosts();
  }, [currentPage, filterStatus, debouncedSearchTerm]);
  
  // Fetch jobs, employees, and boost plans when Create tab is activated
  useEffect(() => {
    if (activeTab === 'create') {
      fetchJobsAndEmployees();
      fetchBoostPlans();
    }
  }, [activeTab]);
  
  // Fetch financial analytics on component mount
  useEffect(() => {
    fetchFinancialAnalytics();
  }, []);

  // Fetch boosts from API
  const fetchBoosts = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit
      };
      
      // Only add status and search if they have valid values
      if (filterStatus && filterStatus !== 'all') {
        params.status = filterStatus;
      }
      if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
        params.search = debouncedSearchTerm.trim();
      }
      
      const response = await boostAPI.getAllBoosts(params);
      
      setBoostPosts(response.boosts);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (error) {
      console.error('Error fetching boosts:', error);
      setError(error.message || 'Failed to load boost data. Please try again.');
      toast.error(error.message || 'Failed to load boost data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch financial analytics from API
  const fetchFinancialAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await boostAPI.getFinancialAnalytics();
      
      setFinancialData({
        totalRevenue: response.totalRevenue || 0,
        monthlyRevenue: response.monthlyRevenue || 0,
        platformFees: response.totalRevenue * 0.1 || 0, // Assuming 10% platform fee
        netProfit: response.totalRevenue - (response.totalRevenue * 0.1) || 0,
        pendingPayments: response.pendingBoosts * 50 || 0, // Rough estimate based on pending count
        refundedAmount: response.refundedAmount || 0,
        averageBoostPrice: response.averageBoostPrice || 0,
        conversionRate: response.approvalRate || 0
      });
      
      setLoading(false);
    } catch (error) {
      setError(error.message || 'Failed to fetch financial analytics');
      setLoading(false);
      toast.error(error.message || 'Failed to fetch financial analytics');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Active': 'bg-green-100 text-green-700',
      'Expired': 'bg-red-100 text-red-700',
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Rejected': 'bg-red-100 text-red-700'
    };
    return statusConfig[status] || 'bg-gray-100 text-gray-700';
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      'Paid': 'bg-green-100 text-green-700',
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Failed': 'bg-red-100 text-red-700',
      'Refunded': 'bg-gray-100 text-gray-700'
    };
    return statusConfig[status] || 'bg-gray-100 text-gray-700';
  };

  const getBoostTypeBadge = (type) => {
    const typeConfig = {
      'Basic': 'bg-gray-100 text-gray-700',
      'Standard': 'bg-blue-100 text-blue-700',
      'Premium': 'bg-purple-100 text-purple-700'
    };
    return typeConfig[type] || 'bg-gray-100 text-gray-700';
  };

  const handleApproveBoost = async (boostId) => {
    try {
      setLoading(true);
      await boostAPI.approveBoost(boostId);
      toast.success('Boost approved successfully');
      fetchBoosts(); // Refresh the list
    } catch (error) {
      toast.error(error.message || 'Failed to approve boost');
      setLoading(false);
    }
  };

  const handleRejectBoost = async (boostId, rejectionReason = 'Does not meet our requirements') => {
    try {
      setLoading(true);
      await boostAPI.rejectBoost(boostId, rejectionReason);
      toast.success('Boost rejected successfully');
      fetchBoosts(); // Refresh the list
    } catch (error) {
      toast.error(error.message || 'Failed to reject boost');
      setLoading(false);
    }
  };

  const handleRefund = async (boostId) => {
    try {
      setLoading(true);
      await boostAPI.processRefund(boostId, 'Refund processed by admin');
      toast.success('Refund processed successfully');
      fetchBoosts(); // Refresh the list
    } catch (error) {
      toast.error(error.message || 'Failed to process refund');
      setLoading(false);
    }
  };

  // Fetch available jobs and employees for boost creation
  const fetchJobsAndEmployees = async () => {
    try {
      const [jobsResponse, employeesResponse] = await Promise.all([
        adminAPI.getJobs(),
        adminAPI.getEmployees()
      ]);
      
      if (jobsResponse.success) {
        setAvailableJobs(jobsResponse.data || []);
      }
      
      if (employeesResponse.success) {
        setAvailableEmployees(employeesResponse.data || []);
      }
    } catch (error) {
      console.error('Error fetching jobs and employees:', error);
      toast.error('Failed to load jobs and employees');
    }
  };

  // Fetch available boost plans for boost creation
  const fetchBoostPlans = async () => {
    try {
      const response = await boostPlanAPI.getAllBoostPlans();
      if (response.success) {
        setAvailableBoostPlans(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching boost plans:', error);
      toast.error('Failed to load boost plans');
    }
  };

  // Handle create boost form submission
  const handleCreateBoost = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await boostAPI.createBoost(createBoostForm);
      if (response.success) {
        toast.success('Boost created successfully!');
        setActiveTab('all');
        fetchBoosts();
        // Reset form
        setCreateBoostForm({
          jobId: '',
          employeeId: '',
          boostPlanId: '',
          paymentMethod: 'pending'
        });
      }
    } catch (error) {
      console.error('Error creating boost:', error);
      toast.error(error.response?.data?.message || 'Failed to create boost');
    } finally {
      setLoading(false);
    }
  };

  // Update form field
  const updateCreateBoostForm = (field, value) => {
    setCreateBoostForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Financial Overview Component
  const renderFinancialOverview = () => (
    loading ? (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <span className="ml-2 text-gray-600">Loading financial data...</span>
      </div>
    ) : error ? (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    ) : (
    <div className="space-y-6">
      {/* Financial Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${financialData.totalRevenue.toFixed(2)}</p>
              <p className="text-sm text-green-600 mt-1">+12% from last month</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${financialData.monthlyRevenue.toFixed(2)}</p>
              <p className="text-sm text-green-600 mt-1">+8% from last month</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Platform Fees</p>
              <p className="text-2xl font-bold text-gray-900">${financialData.platformFees.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">10% commission</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Net Profit</p>
              <p className="text-2xl font-bold text-gray-900">${financialData.netProfit}</p>
              <p className="text-sm text-green-600 mt-1">After fees & refunds</p>
            </div>
            <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods & Transaction Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">Credit Card</span>
                </div>
                <span className="font-semibold text-gray-900">65%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Wallet className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">PayPal</span>
                </div>
                <span className="font-semibold text-gray-900">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Receipt className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">Stripe</span>
                </div>
                <span className="font-semibold text-gray-900">10%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Financial Summary</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Payments</span>
                <span className="font-semibold text-yellow-600">${financialData.pendingPayments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Refunded Amount</span>
                <span className="font-semibold text-red-600">${financialData.refundedAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Boost Price</span>
                <span className="font-semibold text-gray-900">${financialData.averageBoostPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Approval Rate</span>
                <span className="font-semibold text-green-600">{financialData.conversionRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  );

  // Create Boost Form Component
  const renderCreateBoost = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Create New Boost</h3>
          <p className="text-gray-600">Create a boost campaign for job listings</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <form onSubmit={handleCreateBoost} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Job
              </label>
              <select
                value={createBoostForm.jobId}
                onChange={(e) => updateCreateBoostForm('jobId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select a job...</option>
                {availableJobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} - {job.employee?.companyName || 'Unknown Company'}
                  </option>
                ))}
              </select>
            </div>

            {/* Employee Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Employee
              </label>
              <select
                value={createBoostForm.employeeId}
                onChange={(e) => updateCreateBoostForm('employeeId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select an employee...</option>
                {availableEmployees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName} - {employee.companyName}
                  </option>
                ))}
              </select>
            </div>

            {/* Boost Plan Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Boost Plan
              </label>
              <select
                value={createBoostForm.boostPlanId}
                onChange={(e) => updateCreateBoostForm('boostPlanId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select a boost plan...</option>
                {availableBoostPlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - ${plan.price} ({plan.duration} days)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Available Boost Plans Information */}
          {availableBoostPlans.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Available Boost Plans</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {availableBoostPlans.map((plan) => (
                  <div key={plan.id} className="space-y-1">
                    <div className="font-medium text-gray-700">{plan.name} (${plan.price})</div>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Featured for {plan.duration} days</li>
                      <li>• {plan.type} visibility boost</li>
                      {plan.features && plan.features.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Boost
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Pending Boosts for Admin Approval
  const renderPendingBoosts = () => (
    loading ? (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <span className="ml-2 text-gray-600">Loading pending boost requests...</span>
      </div>
    ) : error ? (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    ) : (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Pending Boost Requests</h3>
          <p className="text-gray-600">Review and approve employer boost requests</p>
        </div>
        <div className="flex space-x-3">
        
        </div>
      </div>

      <div className="space-y-4">
        {boostPosts.filter(boost => boost.status === 'Pending').map((boost) => (
          <div key={boost.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Job Details */}
              <div className="lg:col-span-2">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{boost.job?.title || 'N/A'}</h4>
                    <p className="text-gray-600">{boost.employee?.companyName || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{boost.employee?.email || 'N/A'}</p>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getBoostTypeBadge(boost.boostType)}`}>
                      {boost.boostType}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(boost.status)}`}>
                      {boost.status}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Job Description:</p>
                  <p className="text-gray-800">{boost.job?.description || 'N/A'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Location:</span>
                    <span className="ml-2 text-gray-900">{boost.job?.location || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Job Type:</span>
                    <span className="ml-2 text-gray-900">{boost.job?.type || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <span className="ml-2 text-gray-900">{boost.duration} days</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Submitted:</span>
                    <span className="ml-2 text-gray-900">{new Date(boost.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment & Action Details */}
              <div className="border-l border-gray-200 pl-6">
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Payment Details</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Price:</span>
                      <span className="font-semibold text-gray-900">${(Number(boost.price) || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Platform Fee:</span>
                      <span className="text-gray-900">${(Number(boost.platformFee) || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Net Revenue:</span>
                      <span className="font-semibold text-green-600">${(Number(boost.netRevenue) || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStatusBadge(boost.paymentStatus)}`}>
                        {boost.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Method:</span>
                      <span className="text-gray-900">{boost.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Transaction:</span>
                      <span className="text-gray-900 text-xs">{boost.transactionId}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => handleApproveBoost(boost.id)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Boost
                  </button>
                  <button 
                    onClick={() => handleRejectBoost(boost.id, 'Quality standards not met')}
                    className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject & Refund
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {boostPosts.filter(boost => boost.status === 'Pending').length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pending boost requests</h3>
          <p className="text-gray-600">All boost requests have been processed. Check the "All Boosts" tab to see all boost campaigns.</p>
        </div>
      )}
    </div>
    )
  );

  // All Boosts with Financial Data
  const renderAllBoosts = () => (
    loading ? (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <span className="ml-2 text-gray-600">Loading boost campaigns...</span>
      </div>
    ) : error ? (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    ) : (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">All Boost Campaigns</h3>
          <p className="text-gray-600">Complete history with financial tracking</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search boosts..."
              className="px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Rejected">Rejected</option>
            <option value="Expired">Expired</option>
          </select>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Job Details</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Boost Type</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {boostPosts.map((boost) => (
                <tr key={boost.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{boost.job?.title || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{new Date(boost.createdAt).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm text-gray-900">{boost.employee?.companyName || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{boost.employee?.email || 'N/A'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getBoostTypeBadge(boost.boostType)}`}>
                      {boost.boostType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(boost.status)}`}>
                      {boost.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">${(Number(boost.price) || 0).toFixed(2)}</div>
                      <span className={`px-1 py-0.5 rounded text-xs font-medium ${getPaymentStatusBadge(boost.paymentStatus)}`}>
                        {boost.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-green-600">${(Number(boost.netRevenue) || 0).toFixed(2)}</div>
                      <div className="text-xs text-gray-500">Fee: ${(Number(boost.platformFee) || 0).toFixed(2)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {boost.views ? (
                      <div>
                        <div className="text-sm text-gray-900">{boost.views} views</div>
                        <div className="text-xs text-gray-500">{boost.applications} apps</div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No data</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      {boost.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleApproveBoost(boost.id)}
                            className="p-1 text-gray-400 hover:text-green-600"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleRejectBoost(boost.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {boost.paymentStatus === 'Paid' && boost.status !== 'Active' && (
                        <button 
                          onClick={() => handleRefund(boost.id)}
                          className="p-1 text-gray-400 hover:text-yellow-600"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
        
        {boostPosts.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center mt-6">
            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No boost campaigns found</h3>
            <p className="text-gray-600">There are no boost campaigns in the system yet.</p>
          </div>
        )}
      </div>
    </div>
  ));

  return ( 
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Boost Management & Financial Overview</h2>
          <p className="text-gray-600">Manage employer boost requests and track financial performance</p>
        </div>
        <div className="flex space-x-3">

        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('financial')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'financial'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Financial Overview
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pending'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending Requests
            <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
              {boostPosts.filter(boost => boost.status === 'Pending').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Boosts
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'create'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Create Boost
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'financial' && renderFinancialOverview()}
      {activeTab === 'pending' && renderPendingBoosts()}
      {activeTab === 'all' && renderAllBoosts()}
      {activeTab === 'create' && renderCreateBoost()}
    </div>
  );
};

export default BoostPage;
