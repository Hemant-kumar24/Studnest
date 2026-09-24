import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function PublicRoute() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  if (user) return <Navigate to={user.role?.toLowerCase() === "admin" ? "/admin/dashboard" : "/student/dashboard"} replace />;
  return <Outlet />;
}
