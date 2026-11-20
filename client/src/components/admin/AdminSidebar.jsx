
import { NavLink } from "react-router-dom";

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

      <div className="admin-sidebar-note">
        <strong>UCU Lost &amp; Found</strong>
        <span>Campus item management</span>
      </div>
    </aside>
  );
}
