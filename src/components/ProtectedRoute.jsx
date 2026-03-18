import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  let localUser = null;
  let sessionUser = null;

  try {
    localUser = JSON.parse(localStorage.getItem("currentUser"));
  } catch {
    localUser = null;
  }

  try {
    sessionUser = JSON.parse(sessionStorage.getItem("currentUser"));
  } catch {
    sessionUser = null;
  }

  const currentUser = localUser || sessionUser;

  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
}