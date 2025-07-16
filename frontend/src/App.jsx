import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Homepage";
import Login from "./pages/auth/Login";
import AdminLogin from "./pages/auth/AdminLogin";
import EmployeeLogin from "./pages/auth/EmployeeLogin";
import Register from "./pages/auth/Register";
import ForgetPassword from "./pages/auth/Forgetpassword";

import AdminLayout from "./components/admin/Layout";
import EmployeeLayout from "./components/employee/Layout";
import UserLayout from "./components/user/Layout";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/Users";
import AdminJobs from "./pages/admin/JobsManagement";
import AdminCompanies from "./pages/admin/Companies";
import AdminBoost from "./pages/admin/BoostPage";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";

import EmployeeDashboard from "./pages/Employee/Dashboard";
import EmployeeApplications from "./pages/Employee/Applications";
import EmployeeProfile from "./pages/Employee/EmployeeProfile";
import EmployeeJobs from "./pages/Employee/Jobs";
import EmployeeEditJob from "./pages/Employee/EditJob";
import EmployeePostJob from "./pages/Employee/Postjob";
import EmployeeNotifications from "./pages/Employee/Notifications";
import EmployeeSettings from "./pages/Employee/Setting";

import UserDashboard from "./pages/user/Dashboard";
import UserJobSearch from "./pages/user/Jobsearch";
import UserApplications from "./pages/user/Applications";
import UserSavedJobs from "./pages/user/SavedJobs";
import UserNotifications from "./pages/user/Notifications";
import UserProfile from "./pages/user/Profile";
import UserSettings from "./pages/user/Settings";

function App() {


  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/employee/login" element={<EmployeeLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="companies" element={<AdminCompanies />} />
            <Route path="boost" element={<AdminBoost />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Employee Routes */}
          <Route path="/employee" element={
            <ProtectedRoute requiredRole="employee">
              <EmployeeLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/employee/dashboard" replace />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="applications" element={<EmployeeApplications />} />
            <Route path="profile" element={<EmployeeProfile />} />
            <Route path="jobs" element={<EmployeeJobs />} />
            <Route path="jobs/edit/:id" element={<EmployeeEditJob />} />
            <Route path="postjob" element={<EmployeePostJob />} />
            <Route path="notifications" element={<EmployeeNotifications />} />
            <Route path="setting" element={<EmployeeSettings />} />
          </Route>

          {/* User/Job Seeker Routes */}
          <Route path="/user" element={
            <ProtectedRoute requiredRole="jobseeker">
              <UserLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/user/dashboard" replace />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="jobsearch" element={<UserJobSearch />} />
            <Route path="applications" element={<UserApplications />} />
            <Route path="saved-jobs" element={<UserSavedJobs />} />
            <Route path="notifications" element={<UserNotifications />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="settings" element={<UserSettings />} />
          </Route>

        </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App
