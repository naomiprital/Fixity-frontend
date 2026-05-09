import { Navigate, Outlet } from 'react-router-dom';
import type { AuthResponse } from '@/features/auth/api/authApi';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const authDataString = localStorage.getItem('fixity.auth');
  
  if (!authDataString) {
    return <Navigate to="/" replace />;
  }

  try {
    const authData = JSON.parse(authDataString) as AuthResponse;
    const userRole = authData.user?.role;

    if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
      return <Navigate to="/home" replace />;
    }

    return <Outlet />;
  } catch (error) {
    return <Navigate to="/" replace />;
  }
};
