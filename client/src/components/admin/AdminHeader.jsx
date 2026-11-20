
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminHeader() {
  const { user } = useAuth();

  const fullName =
    user?.fullName ||
    user?.full_name ||
    user?.name ||
    "Administrator";

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <header className="admin-header">
      <Link to="/admin" className="admin-brand">
        <span className="admin-brand-mark">Z</span>
        <span className="admin-brand-name">ZUULA</span>
      </Link>

      <div className="admin-header-actions">
        <Link to="/admin/profile" className="admin-user">
          <span className="admin-avatar">
            {initials || "A"}
          </span>

          <span className="admin-user-details">
            <strong>{fullName}</strong>
            <small>Administrator</small>
          </span>
        </Link>

        <Link
          to="/admin/profile"
          className="admin-settings"
          title="Settings"
          aria-label="Settings"
        >
          ⚙
        </Link>
      </div>
    </header>
  );
}
