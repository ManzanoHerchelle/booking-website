import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAdminToken } from '../utils/adminSession.js';

function AdminProtectedRoute() {
  const token = getAdminToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export default AdminProtectedRoute;
