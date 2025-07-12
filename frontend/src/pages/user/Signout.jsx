import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export default function Signout() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Clear session data if needed
    localStorage.clear();
    // Redirect to dashboard (you can change to "/login")
    navigate('/dashboard/overview');
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-red-100 p-4 rounded-full">
            <LogOut className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Sign Out</h2>
        <p className="text-gray-600">Are you sure you want to sign out of your account?</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleSignOut}
            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 font-medium"
          >
            Sign Out
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
