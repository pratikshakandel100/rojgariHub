import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Eye, UserCheck, UserX, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { adminAPI } from '../../utils/api';

const Users = () => {
  const [employees, setEmployees] = useState([]);
  const [jobSeekers, setJobSeekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 10;

  // Fetch users data from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit,
        ...(searchTerm && { search: searchTerm })
      };

      const [employeesResponse, jobSeekersResponse] = await Promise.all([
        adminAPI.getEmployees(params),
        adminAPI.getJobSeekers(params)
      ]);

      setEmployees(employeesResponse.employees || []);
      setJobSeekers(jobSeekersResponse.jobSeekers || []);
      
      // Calculate total pages based on combined results
      const totalEmployees = employeesResponse.totalEmployees || 0;
      const totalJobSeekers = jobSeekersResponse.totalJobSeekers || 0;
      const total = totalEmployees + totalJobSeekers;
      
      setTotalUsers(total);
      setTotalPages(Math.ceil(total / limit));
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle user status toggle
  const handleStatusToggle = async (user, userType) => {
    try {
      const newStatus = !user.isActive;
      await adminAPI.toggleUserStatus(userType, user.id, newStatus);
      
      // Update local state
      if (userType === 'employee') {
        setEmployees(prev => prev.map(emp => 
          emp.id === user.id ? { ...emp, isActive: newStatus } : emp
        ));
      } else {
        setJobSeekers(prev => prev.map(js => 
          js.id === user.id ? { ...js, isActive: newStatus } : js
        ));
      }
    } catch (err) {
      console.error('Error toggling user status:', err);
      alert('Failed to update user status');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Active': 'bg-green-100 text-green-700',
      'Inactive': 'bg-red-100 text-red-700',
      'Suspended': 'bg-yellow-100 text-yellow-700'
    };
    return statusConfig[status] || 'bg-gray-100 text-gray-700';
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      'Job Seeker': 'bg-blue-100 text-blue-700',
      'Employer': 'bg-purple-100 text-purple-700'
    };
    return typeConfig[type] || 'bg-gray-100 text-gray-700';
  };

  // Combine and filter users
  const getAllUsers = () => {
    const employeeUsers = employees.map(emp => ({
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      email: emp.email,
      type: 'Employer',
      status: emp.isActive ? 'Active' : 'Inactive',
      joinDate: new Date(emp.createdAt).toLocaleDateString(),
      companyName: emp.companyName,
      userType: 'employee',
      originalData: emp
    }));

    const jobSeekerUsers = jobSeekers.map(js => ({
      id: js.id,
      name: `${js.firstName} ${js.lastName}`,
      email: js.email,
      type: 'Job Seeker',
      status: js.isActive ? 'Active' : 'Inactive',
      joinDate: new Date(js.createdAt).toLocaleDateString(),
      userType: 'job_seeker',
      originalData: js
    }));

    return [...employeeUsers, ...jobSeekerUsers];
  };

  const filteredUsers = getAllUsers().filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || user.type === filterType;
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-600">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <AlertCircle className="w-8 h-8 text-red-600" />
        <span className="ml-2 text-red-600">Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Users Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
          <p className="text-gray-600">Manage job seekers and employer accounts ({totalUsers} total)</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="All">All Types</option>
              <option value="Job Seeker">Job Seekers</option>
              <option value="Employer">Employers</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Company/Info</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={`${user.userType}-${user.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeBadge(user.type)}`}>
                        {user.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.companyName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.joinDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        {user.status === 'Active' ? (
                          <button 
                            onClick={() => handleStatusToggle(user.originalData, user.userType)}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Deactivate User"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleStatusToggle(user.originalData, user.userType)}
                            className="p-1 text-gray-400 hover:text-green-600"
                            title="Activate User"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
          <div className="flex items-center text-sm text-gray-700">
            Showing page {currentPage} of {totalPages} ({totalUsers} total users)
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
