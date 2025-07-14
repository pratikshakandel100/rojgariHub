import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        let message = 'Something went wrong';
        
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
          message = 'Unable to connect to server. Please check if the backend is running.';
        } else if (error.response) {
          const status = error.response.status;
          const data = error.response.data;
          
          switch (status) {
            case 401:
              message = 'Authentication required. Please log in again.';
              localStorage.removeItem('token');
              window.location.href = '/login';
              break;
            case 403:
              message = 'Access denied. You do not have permission to perform this action.';
              break;
            case 404:
              message = 'The requested resource was not found.';
              break;
            case 422:
              if (data.errors && Array.isArray(data.errors)) {
                message = data.errors.map(err => err.msg).join(', ');
              } else {
                message = 'Invalid data provided.';
              }
              break;
            case 500:
              message = 'Server error. Please try again later.';
              break;
            default:
              if (data.errors && Array.isArray(data.errors)) {
                message = data.errors.map(err => err.msg).join(', ');
              } else if (data.message) {
                message = data.message;
              } else {
                message = `Request failed with status ${status}`;
              }
          }
        } else if (error.request) {
          message = 'No response from server. Please check your internet connection.';
        }
        
        console.error('API Error:', {
          message,
          status: error.response?.status,
          data: error.response?.data,
          code: error.code
        });
        
        throw new Error(message);
      }
    );
  }

  get(endpoint) {
    return this.client.get(endpoint);
  }

  post(endpoint, data) {
    return this.client.post(endpoint, data);
  }

  put(endpoint, data) {
    return this.client.put(endpoint, data);
  }

  delete(endpoint) {
    return this.client.delete(endpoint);
  }

  postFormData(endpoint, formData) {
    return this.client.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
}

const api = new ApiClient();

export const authAPI = {
  adminLogin: (credentials) => api.post('/auth/admin/login', credentials),
  employeeLogin: (credentials) => api.post('/auth/employee/login', credentials),
  jobSeekerLogin: (credentials) => api.post('/auth/job-seeker/login', credentials),
  employeeRegister: (userData) => api.post('/auth/employee/register', userData),
  jobSeekerRegister: (userData) => api.post('/auth/job-seeker/register', userData),
  forgotPassword: (email) => api.post('/password-reset/request', { email }),
  resetPassword: (token, password) => api.post('/password-reset/reset', { token, password }),
  verifyToken: () => api.get('/auth/verify')
};

export const jobsAPI = {
  getAll: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/jobs${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => api.get(`/jobs/${id}`),
  create: (jobData) => api.post('/jobs', jobData),
  createWithImage: (formData) => api.postFormData('/jobs', formData),
  update: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  delete: (id) => api.delete(`/jobs/${id}`),
  getByEmployee: (employeeId) => api.get(`/jobs/employee/${employeeId}`),
  getEmployeeJobs: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/jobs/employee/my-jobs${queryString ? `?${queryString}` : ''}`);
  }
};

export const applicationsAPI = {
  apply: (jobId, applicationData) => api.post('/applications/apply', { jobId, ...applicationData }),
  getJobSeekerApplications: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/applications/job-seeker/my-applications${queryString ? `?${queryString}` : ''}`);
  },
  getEmployeeApplications: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/applications/employee/received-applications${queryString ? `?${queryString}` : ''}`);
  },
  updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
  withdraw: (id) => api.delete(`/applications/${id}/withdraw`)
};

export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (profileData) => api.put('/profile', profileData),
  uploadProfilePicture: (formData) => api.postFormData('/upload/profile-picture', formData),
  uploadResume: (formData) => api.postFormData('/upload/resume', formData)
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getEmployees: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/employees${queryString ? `?${queryString}` : ''}`);
  },
  getJobSeekers: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/job-seekers${queryString ? `?${queryString}` : ''}`);
  },
  toggleUserStatus: (userType, userId, isActive) => api.put(`/admin/users/${userType}/${userId}/status`, { isActive }),
  getJobs: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/jobs${queryString ? `?${queryString}` : ''}`);
  },
  deleteJob: (jobId) => api.delete(`/admin/jobs/${jobId}`),
  updateJob: (jobId, jobData) => api.put(`/admin/jobs/${jobId}`, jobData),
  getCompanies: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/companies${queryString ? `?${queryString}` : ''}`);
  },
  getCompanyById: (companyId) => api.get(`/admin/companies/${companyId}`),
  toggleCompanyStatus: (companyId, isActive) => api.put(`/admin/companies/${companyId}/status`, { isActive }),
  getAnalytics: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/analytics${queryString ? `?${queryString}` : ''}`);
  }
};

export const boostAPI = {
  getAllBoosts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/boost/admin/all?${queryString}`);
  },
  getEmployeeBoosts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/boost/my-boosts?${queryString}`);
  },
  getBoostById: (id) => api.get(`/boost/${id}`),
  getFinancialAnalytics: () => api.get('/boost/admin/analytics'),
  createBoost: (boostData) => api.post('/boost/create', boostData),
  
  approveBoost: (id) => api.put(`/boost/${id}/approve`),
  
  rejectBoost: (id, rejectionReason) => api.put(`/boost/${id}/reject`, { rejectionReason }),
  
  processRefund: (id, refundReason) => api.put(`/boost/${id}/refund`, { refundReason }),
  
  updateBoostStats: (id, statsData) => api.put(`/boost/${id}/stats`, statsData),
};

export const boostPlanAPI = {
  getActiveBoostPlans: () => api.get('/boost-plans/active'),
  getAllBoostPlans: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/boost-plans/admin/all?${queryString}`);
  },
  getBoostPlanById: (id) => api.get(`/boost-plans/${id}`),
  createBoostPlan: (planData) => api.post('/boost-plans/create', planData),
  updateBoostPlan: (id, planData) => api.put(`/boost-plans/${id}`, planData),
  deleteBoostPlan: (id) => api.delete(`/boost-plans/${id}`),
  toggleBoostPlanStatus: (id) => api.put(`/boost-plans/${id}/toggle-status`)
};


export const dashboardAPI = {
  getEmployeeDashboard: () => api.get('/dashboard/employee'),
  getJobSeekerDashboard: () => api.get('/dashboard/jobseeker')
};

export const savedJobsAPI = {
  getSavedJobs: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/saved-jobs/my-saved-jobs${queryString ? `?${queryString}` : ''}`);
  },
  saveJob: (jobId) => api.post('/saved-jobs/save', { jobId }),
  unsaveJob: (jobId) => api.delete(`/saved-jobs/unsave/${jobId}`),
  checkIfSaved: (jobId) => api.get(`/saved-jobs/check/${jobId}`)
};

export default api;