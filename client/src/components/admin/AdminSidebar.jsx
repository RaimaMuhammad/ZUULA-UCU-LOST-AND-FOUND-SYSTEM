
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const links = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: "▦",
    end: true,
  },
  {
    to: "/admin/reports",
    label: "All Reports",
    icon: "▤",
  },
  {
    to: "/admin/claims",
    label: "All Claims",
    icon: "▣",
  },
  {
    to: "/admin/messages",
    label: "Messages",
    icon: "✉",
  },
  {
    to: "/admin/profile",
    label: "My Profile",
    icon: "♙",
  },
];

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <aside className="admin-sidebar">
      <p className="admin-sidebar-heading">ADMINISTRATION</p>

      <nav className="admin-sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `admin-sidebar-link${isActive ? " active" : ""}`
            }
          >
            <span className="admin-sidebar-icon" aria-hidden="true">
              {link.icon}
            </span>

            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-bottom">
        <div className="admin-sidebar-note">
          <strong>UCU Lost &amp; Found</strong>
          <span>Campus item management</span>
        </div>

        <button
          type="button"
          className="admin-sidebar-logout"
          onClick={handleLogout}
        >
          <span className="admin-sidebar-icon" aria-hidden="true">
            ⇥
          </span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
