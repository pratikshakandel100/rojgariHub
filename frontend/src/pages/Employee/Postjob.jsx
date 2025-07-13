import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { jobsAPI, boostAPI, boostPlanAPI } from '../../utils/api';

const PostJob = ({ newJob: propNewJob, setNewJob: propSetNewJob, handleJobSubmit: propHandleJobSubmit, setActiveTab: propSetActiveTab }) => {
  const navigate = useNavigate();
  const [showBoostModal, setShowBoostModal] = React.useState(false);
  
  // Fetch available boost plans
  const fetchBoostPlans = async () => {
    try {
      setLoadingBoostPlans(true);
      const response = await boostPlanAPI.getActiveBoostPlans();
      if (response.success) {
        setAvailableBoostPlans(response.boostPlans);
      }
    } catch (error) {
      console.error('Error fetching boost plans:', error);
      toast.error('Failed to load boost plans');
    } finally {
      setLoadingBoostPlans(false);
    }
  };

  // Fetch boost plans on component mount
  React.useEffect(() => {
    fetchBoostPlans();
  }, []);
  const [boostChecked, setBoostChecked] = React.useState(false);
  const [selectedBoostPlan, setSelectedBoostPlan] = React.useState(null);
  const [availableBoostPlans, setAvailableBoostPlans] = React.useState([]);
  const [loadingBoostPlans, setLoadingBoostPlans] = React.useState(false);
  const [companyImage, setCompanyImage] = React.useState(null);
  
  // Initialize local state if props are not provided
  const [localNewJob, setLocalNewJob] = React.useState({
    title: '',
    type: 'Full-time',
    location: '',
    salary: '',
    description: '',
    requirements: ''
  });
  
  // Use props if available, otherwise use local state
  const newJob = propNewJob || localNewJob;
  const setNewJob = propSetNewJob || setLocalNewJob;
  
  // Default job submit handler
  const defaultHandleJobSubmit = async (e, companyImage) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!newJob.title || !newJob.description || !newJob.requirements || !newJob.location || !newJob.type) {
        toast.error('Please fill in all required fields.');
        return;
      }

      // If boost is selected but no plan chosen, show error
      if (boostChecked && !selectedBoostPlan) {
        toast.error('Please select a boost plan or uncheck boost option.');
        return;
      }

      let createdJob;
      // Submit job to backend
      if (companyImage) {
        // If there's a company image, we need to handle file upload
        const formData = new FormData();
        Object.keys(newJob).forEach(key => {
          formData.append(key, newJob[key]);
        });
        formData.append('companyImage', companyImage);
        
        // Use postFormData for file upload
        const response = await jobsAPI.createWithImage(formData);
        createdJob = response.job;
      } else {
        // Regular JSON submission without image
        const response = await jobsAPI.create(newJob);
        createdJob = response.job;
      }

      // If boost is selected, create boost request
      if (boostChecked && selectedBoostPlan && createdJob) {
          try {
            await boostAPI.createBoost({
          jobId: createdJob.id,
          boostPlanId: selectedBoostPlan.id,
          paymentMethod: 'card'
        });
          toast.success('Job posted successfully! Boost request submitted for admin approval.');
        } catch (boostError) {
          console.error('Error creating boost:', boostError);
          toast.success('Job posted successfully, but boost request failed. You can request boost later.');
        }
      } else {
        toast.success('Job posted successfully!');
      }
      
      // Reset form
      setLocalNewJob({
        title: '',
        type: 'Full-time',
        location: '',
        salary: '',
        description: '',
        requirements: ''
      });
      setCompanyImage(null);
      setBoostChecked(false);
      setSelectedBoostPlan(null);
      
      // Navigate back to jobs page
      navigate('/employee/jobs');
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error(error.message || 'Failed to post job. Please try again.');
    }
  };
  
  const handleJobSubmit = propHandleJobSubmit || defaultHandleJobSubmit;
  
  const handleCancel = () => {
    if (propSetActiveTab) {
      propSetActiveTab('jobs');
    } else {
      navigate('/employee/jobs');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Post New Job</h2>

      <div className="bg-white rounded-lg shadow-sm">
        <form onSubmit={(e) => handleJobSubmit(e, companyImage)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={newJob.title}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                placeholder="e.g. Senior Software Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type *
              </label>
              <select
                value={newJob.type}
                onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={newJob.location}
                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                placeholder="e.g. Mumbai, India"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary Range
              </label>
              <input
                type="text"
                value={newJob.salary}
                onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                placeholder="e.g. ₹15-25 LPA"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              required
              rows={4}
              value={newJob.description}
              onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              placeholder="Describe the job role, responsibilities, and what you're looking for..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements *
            </label>
            <textarea
              required
              rows={3}
              value={newJob.requirements}
              onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              placeholder="Enter requirements separated by commas (e.g. React, Node.js, 3+ years experience)"
            />
          </div>

          {/* Company Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setCompanyImage(file);
                }
              }}
              className="block w-full text-sm text-gray-700
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
              "
            />
            {companyImage && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <img
                  src={URL.createObjectURL(companyImage)}
                  alt="Company preview"
                  className="h-32 w-auto rounded border border-gray-300 object-cover"
                />
              </div>
            )}
          </div>

          {/* Boost Job Checkbox */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="boost"
              checked={boostChecked}
              onChange={(e) => {
                setBoostChecked(e.target.checked);
                if (e.target.checked) setShowBoostModal(true);
              }}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="boost" className="text-sm text-gray-700">
              Boost this job for more visibility
            </label>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Post Job</span>
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Boost Job Modal */}
      {showBoostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg space-y-6 relative">
            <h3 className="text-xl font-bold text-gray-900">Boost Your Job</h3>
            <p className="text-gray-700">
              Reach more candidates by boosting your job post! Choose a boost plan and proceed to payment.
            </p>

            {loadingBoostPlans ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading boost plans...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableBoostPlans.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No boost plans available at the moment.
                    </div>
                  ) : (
                    availableBoostPlans.map((plan) => (
                      <div 
                        key={plan.id}
                        className={`flex items-center justify-between border p-4 rounded-lg cursor-pointer transition-colors ${
                          selectedBoostPlan?.id === plan.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedBoostPlan(plan)}
                      >
                        <div>
                          <p className="font-semibold text-gray-900">{plan.name}</p>
                          <p className="text-gray-600 text-sm">{plan.duration} days visibility boost</p>
                        </div>
                        <span className="text-blue-600 font-bold">₹{plan.price}</span>
                      </div>
                    ))
                  )}
                </div>
              )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowBoostModal(false);
                  setBoostChecked(false);
                  setSelectedBoostPlan(null);
                }}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!selectedBoostPlan) {
                    toast.error('Please select a boost plan.');
                    return;
                  }
                  setShowBoostModal(false);
                  toast('Boost plan selected. Submit the job to request boost approval.');
                }}
                disabled={!selectedBoostPlan}
                className={`px-4 py-2 rounded transition-colors ${
                  selectedBoostPlan 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Select Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostJob;
