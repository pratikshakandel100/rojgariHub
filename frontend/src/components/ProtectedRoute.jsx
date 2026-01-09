import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole, redirectTo = '/login' }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute:', { isAuthenticated: isAuthenticated(), user, loading, requiredRole });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    console.log('Role mismatch:', { userRole: user?.role, requiredRole });
    const roleRedirects = {
      admin: '/admin/dashboard',
      employee: '/employee/dashboard',
      jobseeker: '/user/dashboard'
    };
    
    return <Navigate to={roleRedirects[user?.role] || '/'} replace />;
  }

  console.log('Access granted to protected route');
  return children;
};

export default ProtectedRoute;