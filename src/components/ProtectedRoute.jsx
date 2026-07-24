import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import Spinner from "./Spinner";

export default function ProtectedRoute({ children, roles }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner full />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Send new accounts through the wizard once
  if (profile && !profile.onboarded && location.pathname !== "/welcome") {
    return <Navigate to="/welcome" replace />;
  }

  if (roles && profile && !roles.includes(profile.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}