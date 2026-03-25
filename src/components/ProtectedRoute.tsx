import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAppContext } from '../context/AppDataContext';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAppContext();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role) && role !== 'Superuser') {
    // If they are logged in but don't have the right role, redirect them.
    // Notice Superuser always passes through unless explicitly forbidden (but they are never).
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
