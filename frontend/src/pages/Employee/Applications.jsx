import React, { useState, useEffect } from 'react';
import { Mail, Phone, Briefcase, Check, X, Loader2, User, Calendar, MapPin, Eye, FileText } from 'lucide-react';
import { applicationsAPI } from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
    // Set job filter from URL params if present
    const jobId = searchParams.get('jobId');
    if (jobId) {
      setJobFilter(jobId);
    }
  }, [searchParams]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (jobFilter) params.jobId = jobFilter;
      
      const response = await applicationsAPI.getEmployeeApplications(params);
      if (response.success) {
        setApplications(response.applications || []);
      } else {
        toast.error('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const response = await applicationsAPI.updateStatus(applicationId, status);
      if (response.success) {
        toast.success(`Application ${status.toLowerCase()} successfully`);
        fetchApplications(); // Refresh the list
      } else {
        toast.error('Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Reviewed': 'bg-blue-100 text-blue-800',
      'Accepted': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const uniqueJobs = [...new Map(applications.map(app => [app.job?.id, app.job])).values()].filter(Boolean);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Job Applications</h2>
        <div className="text-sm text-gray-600">
          Total: {applications.length} applications
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">All Applications</h3>
            <div className="flex space-x-2">
              <select 
                value={jobFilter} 
                onChange={(e) => setJobFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900"
              >
                <option value="">All Jobs</option>
                {uniqueJobs.map((job) => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900"
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
              <button
                onClick={fetchApplications}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {applications.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600">No job applications have been received yet.</p>
            </div>
          ) : (
            applications.map((application) => (
              <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      {application.jobSeeker?.profilePicture ? (
                        <img
                          src={`http://localhost:5000/api${application.jobSeeker.profilePicture}`}
                          alt={`${application.jobSeeker?.firstName} ${application.jobSeeker?.lastName}`}
                          className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {application.jobSeeker?.firstName?.charAt(0)}{application.jobSeeker?.lastName?.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white ${
                        application.status === 'Accepted' ? 'bg-green-500' :
                        application.status === 'Rejected' ? 'bg-red-500' :
                        application.status === 'Reviewed' ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`}></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-1">
                            {application.jobSeeker?.firstName} {application.jobSeeker?.lastName}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(application.status)}`}>
                              {application.status}
                            </span>
                            <span className="text-sm text-gray-500">
                              Applied {new Date(application.createdAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-3 mb-3">
                        <p className="text-sm font-medium text-blue-900 mb-1">Applied for Position:</p>
                        <p className="text-lg font-semibold text-blue-800">{application.job?.title}</p>
                        {application.job?.location && (
                          <p className="text-sm text-blue-600 flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {application.job.location}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        {application.jobSeeker?.email && (
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <Mail className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Email</p>
                              <p className="text-gray-900 font-medium">{application.jobSeeker.email}</p>
                            </div>
                          </div>
                        )}
                        {application.jobSeeker?.phone && (
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <Phone className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Phone</p>
                              <p className="text-gray-900 font-medium">{application.jobSeeker.phone}</p>
                            </div>
                          </div>
                        )}
                        {application.jobSeeker?.experience && (
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <Briefcase className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Experience</p>
                              <p className="text-gray-900 font-medium">{application.jobSeeker.experience}</p>
                            </div>
                          </div>
                        )}
                        {application.jobSeeker?.skills && (
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Skills</p>
                              <p className="text-gray-900 font-medium">{application.jobSeeker.skills}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {application.coverLetter && (
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                          <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-blue-500" />
                            Cover Letter
                          </h5>
                          <p className="text-sm text-gray-700 leading-relaxed">{application.coverLetter}</p>
                        </div>
                      )}
                    </div>
                  </div>
                   <div className="flex items-center space-x-2">
                     {application.jobSeeker?.resume && (
                       <a
                         href={application.jobSeeker.resume}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                       >
                         <Eye className="h-4 w-4 mr-1" />
                         View Resume
                       </a>
                     )}
                     {application.status === 'Pending' && (
                       <>
                         <button
                           onClick={() => updateApplicationStatus(application.id, 'Accepted')}
                           className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
                         >
                           <Check className="h-4 w-4 mr-1" />
                           Accept
                         </button>
                         <button
                           onClick={() => updateApplicationStatus(application.id, 'Rejected')}
                           className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                         >
                           <X className="h-4 w-4 mr-1" />
                           Reject
                         </button>
                       </>
                     )}
                   </div>
                 </div>
               </div>
             ))
           )}
         </div>
       </div>
     </div>
   );
 };
 
export default Applications;