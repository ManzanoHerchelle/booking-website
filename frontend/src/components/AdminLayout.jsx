import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clearAdminSession, getStoredAdminUser } from '../utils/adminSession.js';

function AdminLayout() {
  const navigate = useNavigate();
  const adminUser = getStoredAdminUser();

  function handleLogout() {
    clearAdminSession();
    navigate('/admin/login');
  }

  return (
    <div className="page-shell">
      <header className="site-header admin-header">
        <div>
          <div className="brand-mark">Admin Panel</div>
          <div className="admin-subtitle">{adminUser?.full_name || 'Administrator'}</div>
        </div>

        <nav className="site-nav" aria-label="Admin">
          <NavLink to="/admin/reservations" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Reservations
          </NavLink>
          <NavLink to="/admin/payments" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Payments
          </NavLink>
          <NavLink to="/admin/operations" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Operations
          </NavLink>
          <NavLink to="/admin/rooms" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Rooms
          </NavLink>
          <NavLink to="/admin/landing-content" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Landing Section
          </NavLink>
          <NavLink to="/admin/amenities" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Amenities
          </NavLink>
          <NavLink to="/admin/slides" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Homepage Slides
          </NavLink>
          <button type="button" className="btn btn-secondary" onClick={handleLogout}>
            Log Out
          </button>
        </nav>
      </header>

      <Outlet />
    </div>
  );
}

export default AdminLayout;
