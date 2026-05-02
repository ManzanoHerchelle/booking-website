import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/reserve', label: 'Reserve' },
  { to: '/payment', label: 'Payment' },
  { to: '/track', label: 'Track Booking' },
  { to: '/my-bookings', label: 'My Bookings' },
  { to: '/contact', label: 'Contact' },
  { to: '/terms', label: 'Terms' }
];

function SiteLayout() {
  return (
    <div className="page-shell">
      <header className="site-header">
        <NavLink to="/" className="brand-mark">
          BrewSpot
        </NavLink>

        <nav className="site-nav" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <Outlet />

      <footer className="site-footer">
        <div>
          <strong>BrewSpot Cafe & Villa</strong>
          
        </div>
        <div className="footer-links">
          <NavLink to="/reserve">Reserve</NavLink>
          <NavLink to="/payment">Payment</NavLink>
          <NavLink to="/track">Track Booking</NavLink>
          <NavLink to="/my-bookings">My Bookings</NavLink>
          <NavLink to="/terms">Terms</NavLink>
        </div>
      </footer>
    </div>
  );
}

export default SiteLayout;
