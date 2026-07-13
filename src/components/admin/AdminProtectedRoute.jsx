import { useUser } from '@clerk/clerk-react';
import { Navigate, Outlet } from 'react-router-dom';

export default function AdminProtectedRoute() {
  const { isLoaded, isSignedIn, user } = useUser();

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

  // Check role in Clerk public metadata
  // Requires {"role": "admin"} or {"role": "super_admin"} in public metadata
  const role = user?.publicMetadata?.role;
  
  if (role !== 'admin' && role !== 'super_admin') {
    return <Navigate to="/admin/forbidden" replace />;
  }

  return <Outlet />;
}
