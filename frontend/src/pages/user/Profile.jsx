import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { profileAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Loader2, Camera } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [currentResume, setCurrentResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [currentProfilePicture, setCurrentProfilePicture] = useState(null);

  const profileForm = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      location: '',
      bio: '',
      experience: '',
      skills: [],
      education: [],
      workExperience: [],
      hobbies: [],
      portfolio: '',
      linkedin: '',
      github: '',
      instagram: '',
      facebook: '',
      expectedSalary: '',
      jobPreferences: []
    }
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await profileAPI.getProfile();
      const userData = response.user;
      
      profileForm.reset({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : '',
        location: userData.location || '',
        bio: userData.bio || '',
        experience: userData.experience || '',
        skills: userData.skills || [],
        education: userData.education || [],
        workExperience: userData.workExperience || [],
        hobbies: userData.hobbies || [],
        portfolio: userData.portfolio || '',
        linkedin: userData.linkedin || '',
        github: userData.github || '',
        instagram: userData.instagram || '',
        facebook: userData.facebook || '',
        expectedSalary: userData.expectedSalary || '',
        jobPreferences: userData.jobPreferences || []
      });
      
      setCurrentProfilePicture(userData.profilePicture);
      setCurrentResume(userData.resume);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const onProfileSubmit = async (data) => {
    try {
      setUpdating(true);
      
      // Filter out empty strings and null values, only send fields with actual values
      const formattedData = {};
      
      Object.keys(data).forEach(key => {
        const value = data[key];
        if (value !== '' && value !== null && value !== undefined) {
          if (key === 'skills' || key === 'hobbies' || key === 'jobPreferences') {
            // Handle comma-separated strings for arrays
            if (Array.isArray(value)) {
              formattedData[key] = value;
            } else if (typeof value === 'string' && value.trim()) {
              formattedData[key] = value.split(',').map(item => item.trim()).filter(item => item);
            }
          } else {
            formattedData[key] = value;
          }
        }
      });
      
      await profileAPI.updateProfile(formattedData);
      toast.success('Profile updated successfully!');
      await fetchUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file (jpg, jpeg, png)');
      return;
    }
    
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await profileAPI.uploadProfilePicture(formData);
      setCurrentProfilePicture(response.profilePicture);
      setProfileImage(file);
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed for resume upload');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await profileAPI.uploadResume(formData);
      setResumeFile(file);
      toast.success('Resume uploaded successfully!');
      await fetchUserProfile();
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="shrink-0 relative">
              <img
                className="h-20 w-20 object-cover rounded-full border-2 border-gray-200"
                src={profileImage ? URL.createObjectURL(profileImage) : (currentProfilePicture ? `http://localhost:5000/api${currentProfilePicture}` : "https://via.placeholder.com/80")}
                alt="Current profile photo"
              />
              {uploadingImage && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label className="relative cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 inline-flex items-center space-x-2">
                <Camera className="h-4 w-4" />
                <span>{uploadingImage ? 'Uploading...' : 'Change Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                  disabled={uploadingImage}
                />
              </label>
              <p className="text-xs text-gray-500">JPG, JPEG or PNG. Max size 5MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                {...profileForm.register('firstName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                {...profileForm.register('lastName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                {...profileForm.register('email')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                {...profileForm.register('phone')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                {...profileForm.register('dateOfBirth')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                {...profileForm.register('location')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              {...profileForm.register('bio')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us about yourself..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience
              </label>
              <input
                type="text"
                {...profileForm.register('experience')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 3 years"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Salary
              </label>
              <input
                type="text"
                {...profileForm.register('expectedSalary')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., $50,000 - $70,000"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills (comma-separated)
              </label>
              <input
                type="text"
                {...profileForm.register('skills')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="JavaScript, React, Node.js"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hobbies (comma-separated)
              </label>
              <input
                type="text"
                {...profileForm.register('hobbies')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Reading, Gaming, Traveling"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio URL
              </label>
              <input
                type="url"
                {...profileForm.register('portfolio')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://yourportfolio.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                {...profileForm.register('linkedin')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub
              </label>
              <input
                type="url"
                {...profileForm.register('github')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://github.com/yourusername"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <input
                type="url"
                {...profileForm.register('instagram')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://instagram.com/yourusername"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook
              </label>
              <input
                type="url"
                {...profileForm.register('facebook')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://facebook.com/yourprofile"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
            {currentResume ? (
              <div className="mb-3 p-3 bg-gray-50 rounded-md border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Current resume uploaded</span>
                  <a
                    href={`http://localhost:5000/api${currentResume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Resume
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-2">No resume uploaded yet</p>
            )}
            <input
              type="file"
              accept=".pdf"
              onChange={handleResumeUpload}
              className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            {resumeFile && <p className="text-sm text-green-600 mt-1">{resumeFile.name}</p>}
            <p className="text-xs text-gray-500 mt-1">Upload a new PDF to replace the current resume</p>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updating}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              {updating && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{updating ? 'Updating...' : 'Update Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
