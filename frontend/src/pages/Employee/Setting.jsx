import React from 'react';
import { Shield, Bell, Globe, CreditCard, User, Lock, Eye, EyeOff } from 'lucide-react';

const Settings = ({ settings = {}, setSettings = () => {} }) => {
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const defaultSettings = {
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    profileVisibility: true,
    dataSharing: false,
    language: 'en',
    timezone: 'UTC',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    ...settings
  };

  const currentSettings = { ...defaultSettings, ...settings };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (currentSettings.newPassword !== currentSettings.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    // Handle password change logic here
    alert('Password updated successfully');
    setSettings({
      ...currentSettings,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const toggleSetting = (key) => {
    setSettings({
      ...currentSettings,
      [key]: !currentSettings[key]
    });
  };

  const updateSetting = (key, value) => {
    setSettings({
      ...currentSettings,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>

      {/* Account Settings */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentSettings.currentPassword}
                  onChange={(e) => updateSetting('currentPassword', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={currentSettings.newPassword}
                  onChange={(e) => updateSetting('newPassword', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={currentSettings.confirmPassword}
                  onChange={(e) => updateSetting('confirmPassword', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
            { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive push notifications in browser' },
            { key: 'applicationAlerts', label: 'Application Alerts', description: 'Get notified when someone applies to your jobs' },
            { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly summary of your job postings' },
            { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive updates about new features and tips' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{item.label}</p>
              <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <button
                onClick={() => toggleSetting(item.key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  currentSettings[item.key] ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    currentSettings[item.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {[
            { key: 'profileVisible', label: 'Profile Visibility', description: 'Make your company profile visible to job seekers' },
            { key: 'showCompanyInfo', label: 'Show Company Information', description: 'Display company details in job postings' },
            { key: 'allowDirectMessages', label: 'Allow Direct Messages', description: 'Let candidates message you directly' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{item.label}</p>
              <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <button
                onClick={() => toggleSetting(item.key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  currentSettings[item.key] ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    currentSettings[item.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* User Preferences */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">User Preferences</h3>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={currentSettings.language}
              onChange={(e) => updateSetting('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="mr">Marathi</option>
                <option value="gu">Gujarati</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              value={currentSettings.timezone}
              onChange={(e) => updateSetting('timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="Asia/Kolkata">India Standard Time (IST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">GMT</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              value={currentSettings.currency}
              onChange={(e) => updateSetting('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Format
            </label>
            <select
              value={currentSettings.dateFormat}
              onChange={(e) => updateSetting('dateFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Billing & Subscription */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Billing & Subscription</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div>
            <p className="font-medium text-blue-900">Current Plan: Professional</p>
            <p className="text-sm text-blue-700">₹2,999/month • Unlimited job postings</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Upgrade Plan
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <p className="font-medium text-gray-900">Billing History</p>
            <p className="text-sm text-gray-500">View past invoices and payments</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <p className="font-medium text-gray-900">Payment Methods</p>
            <p className="text-sm text-gray-500">Manage your payment methods</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;