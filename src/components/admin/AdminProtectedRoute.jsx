import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminProtectedRoute() {
  const { isLoaded, isSignedIn, role, isSecretVerified } = useAuth();

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

  // Require the Secret Key to have been verified in this session
  if (!isSecretVerified) {
    return <Navigate to="/admin/verify" replace />;
  }

  // Restore strict role check as requested
  if (role !== 'admin' && role !== 'super_admin') {
    return <Navigate to="/admin/forbidden" replace />;
  }

  return <Outlet />;
}
