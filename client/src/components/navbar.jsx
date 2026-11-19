import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigationLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Browse Items", path: "/search" },
    { label: "Report Item", path: "/report-item" },
    { label: "My Reports", path: "/my-reports" },
    { label: "My Claims", path: "/my-claims" },
    { label: "Messages", path: "/messages" },
  ];

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <span className="brand-icon">Z</span>
          <span className="brand-name">ZUULA</span>
        </Link>

        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>
          {navigationLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `navbar-link ${isActive ? "active" : ""}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-actions">
          <Link to="/profile" className="navbar-profile">
            <span className="avatar">S</span>
            <span>My Profile</span>
          </Link>

          <Link to="/login" className="navbar-logout">
            Logout
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;