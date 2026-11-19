
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function StudentSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navigationLinks = [
    { label: "Home", path: "/home" },
    { label: "Explore Items", path: "/search" },
    { label: "Report an Item", path: "/report-item" },
    { label: "Messages", path: "/messages" },
    { label: "My Profile", path: "/profile" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="student-sidebar">
      <div className="sidebar-section-title">
        STUDENT MENU
      </div>

      <nav className="student-sidebar-nav">
        {navigationLinks.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/home"}
            className={({ isActive }) =>
              `student-sidebar-link${isActive ? " active" : ""}`
            }
          >
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="student-sidebar-bottom">
        <div className="sidebar-help-card">
          <strong>Need Help?</strong>
          <p>
            Having trouble using ZUULA? We're here to help.
          </p>
          <Link to="/help" className="student-help-link">
            Get Support →
          </Link>
        </div>

        <button
          type="button"
          className="student-logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
