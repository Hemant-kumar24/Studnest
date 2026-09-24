import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const storedRole = localStorage.getItem('role'); // Save 'user' or 'admin' during login

  if (!token || storedRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
