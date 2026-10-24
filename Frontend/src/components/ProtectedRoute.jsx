
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");
  const location = useLocation();

  // User is not logged in
  if (!token) {
    return (
      <Navigate
        to="/user/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // User does not have the required role
  if (role && storedRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
