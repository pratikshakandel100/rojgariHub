import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ applications = [], settings = {} }) => {
  const [companyProfile, setCompanyProfile] = useState({
    name: '',
    industry: '',
    size: '',
    website: '',
    location: '',
    description: ''
  });
  

  
  // Initialize companyProfile with default values if needed
  useEffect(() => {
    // You can fetch company profile data here from API
    // For now, setting default values to prevent undefined errors
    if (!companyProfile.name) {
      setCompanyProfile({
        name: 'Your Company',
        industry: 'Technology',
        size: '1-10',
        website: '',
        location: 'Your Location',
        description: 'Company description goes here...'
      });
    }
  }, []);
  
  const renderContent = () => {
    return <Outlet />;
  };
  
  return (
    <div className="min-h-screen">
      <div className="min-h-screen bg-gray-50">
        <Header companyProfile={companyProfile} />
        <div className="flex">
          <Sidebar applications={applications} />
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
