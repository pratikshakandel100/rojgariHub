import React, { useState } from "react";
import OverviewComponent from "./OverviewComponent";
import JobsManagement from "./JobsManagement";
import Companies from "./Companies";
import Users from "./Users";
import Analytics from "./Analytics";
import Settings from "./Settings";
import BoostPage from "./BoostPage";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewComponent />;
      case "jobs":
        return <JobsManagement />;
      case "companies":
        return <Companies />;
      case "users":
        return <Users />;
      case "analytics":
        return <Analytics />;
      case "settings":
        return <Settings />;
      case "boost":
        return <BoostPage />;
      default:
        return <OverviewComponent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">{renderActiveComponent()}</main>
    </div>
  );
};

export default AdminDashboard;
