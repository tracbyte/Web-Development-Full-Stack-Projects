import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// wraps a page and kicks the user to login if they're not authenticated
// pass allowedRoles to also restrict by role, e.g. <PrivateRoute allowedRoles={['admin']}>
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;
