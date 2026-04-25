import { Navigate, Outlet } from "react-router-dom";
import { getStoredAuth } from "../utils/auth";

export default function ProtectedRoute() {
  const { isAuthenticated } = getStoredAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
