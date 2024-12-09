import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../services/auth.service';

interface ProtectedRouteProps {
  allowedRoles?: ('librarian' | 'admin')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  allowedRoles = ['librarian', 'admin'] 
}) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    // Redirect to unauthorized page if role doesn't match
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};