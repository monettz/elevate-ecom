import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminProtectedRoute() {
  const { isLoaded, isSignedIn, role } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check role from AuthContext (which fetches from customers table)
  if (role !== 'admin' && role !== 'super_admin') {
    return <Navigate to="/admin/forbidden" replace />;
  }

  return <Outlet />;
}
