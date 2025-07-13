import React, { useState, useEffect } from 'react';
import { profileAPI } from '../../utils/api';
import { toast } from 'react-hot-toast';
import { Loader2, Camera } from 'lucide-react';

const EmployeeProfile = () => {
  const [companyProfile, setCompanyProfile] = useState({
    companyName: '',
    companyLocation: '',
    companyWebsite: '',
    companyDescription: '',
    companyEmployees: '',
    companyEmail: '',
    companyPhone: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [currentProfilePicture, setCurrentProfilePicture] = useState(null);
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileAPI.getProfile();
      if (response.success) {
        const user = response.user;
        setCompanyProfile({
          companyName: user.companyName || '',
          companyLocation: user.companyLocation || '',
          companyWebsite: user.companyWebsite || '',
          companyDescription: user.companyDescription || '',
          companyEmployees: user.companyEmployees || '',
          companyEmail: user.companyEmail || '',
          companyPhone: user.companyPhone || ''
        });
        setCurrentProfilePicture(user.profilePicture);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await profileAPI.uploadProfilePicture(formData);
      if (response.profilePicture) {
        setCurrentProfilePicture(response.profilePicture);
        setProfileImage(file);
        toast.success('Profile picture updated successfully!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await profileAPI.updateProfile(companyProfile);
      if (response.success) {
        toast.success('Company profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Company Profile</h2>
      
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              {profileImage || currentProfilePicture ? (
                <img
                  src={profileImage ? URL.createObjectURL(profileImage) : `http://localhost:5000/api${currentProfilePicture}`}
                  alt="Profile"
                  className="h-16 w-16 object-cover rounded-full border-2 border-gray-200"
                />
              ) : (
                <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {companyProfile.companyName ? companyProfile.companyName.charAt(0) : 'C'}
                  </span>
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                <Camera size={12} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{companyProfile.companyName || 'Company Name'}</h3>
              <p className="text-gray-600">{companyProfile.companyLocation || 'Location'}</p>
              <p className="text-sm text-gray-500 mt-1">Click the camera icon to change photo</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={companyProfile.companyName}
                onChange={(e) => setCompanyProfile({ ...companyProfile, companyName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                placeholder="Enter company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Email
              </label>
              <input
                type="email"
                value={companyProfile.companyEmail}
                onChange={(e) => setCompanyProfile({ ...companyProfile, companyEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                placeholder="company@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Phone
              </label>
              <input
                type="tel"
                value={companyProfile.companyPhone}
                onChange={(e) => setCompanyProfile({ ...companyProfile, companyPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Size
              </label>
              <select
                value={companyProfile.companyEmployees}
                onChange={(e) => setCompanyProfile({ ...companyProfile, companyEmployees: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="">Select company size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500-1000">500-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={companyProfile.companyWebsite}
              onChange={(e) => setCompanyProfile({ ...companyProfile, companyWebsite: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              placeholder="https://www.company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={companyProfile.companyLocation}
                onChange={(e) => setCompanyProfile({ ...companyProfile, companyLocation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                placeholder="City, Country"
              />
            </div>

          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Description
            </label>
            <textarea
              rows={4}
              value={companyProfile.companyDescription}
              onChange={(e) => setCompanyProfile({ ...companyProfile, companyDescription: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              placeholder="Tell us about your company..."
            />
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;