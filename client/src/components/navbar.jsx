
import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navigationLinks =
    user?.role === "admin"
      ? [
          { label: "Dashboard", path: "/admin" },
          { label: "Reports", path: "/admin/reports" },
          { label: "Claims", path: "/admin/claims" },
          { label: "Messages", path: "/admin/messages" },
        ]
      : [
          { label: "Home", path: "/home" },
          { label: "Browse Items", path: "/search" },
          { label: "Report Item", path: "/report-item" },
          { label: "My Reports", path: "/my-reports" },
          { label: "My Claims", path: "/my-claims" },
          { label: "Messages", path: "/messages" },
        ];

  const profilePath =
    user?.role === "admin" ? "/admin/profile" : "/profile";

  const dashboardPath =
    user?.role === "admin" ? "/admin" : "/home";

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to={dashboardPath} className="navbar-brand">
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
          <Link to={profilePath} className="navbar-profile">
            <span className="avatar">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </span>
            <span>My Profile</span>
          </Link>

          <button
            type="button"
            className="navbar-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
