import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '@/lib/storage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('cliente' | 'admin')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
