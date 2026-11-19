
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function StudentTopbar() {
  const { user } = useAuth();

  const fullName =
    user?.fullName ||
    user?.full_name ||
    user?.name ||
    "Student";

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <header className="student-topbar">

      {/* LOGO */}
      <Link to="/home" className="student-brand">
        <span className="student-brand-mark">Z</span>
        <span className="student-brand-name">ZUULA</span>
      </Link>

      {/* RIGHT SIDE */}
      <div className="student-topbar-actions">

        <Link to="/profile" className="student-user">
          <span className="student-avatar">
            {initials || "S"}
          </span>

          <span className="student-user-details">
            <strong>{fullName}</strong>
            <small>Student</small>
          </span>
        </Link>

        {/* SETTINGS */}
        <Link
          to="/settings"
          className="student-settings"
          title="Settings"
          aria-label="Settings"
        >
          ⚙
        </Link>

      </div>
    </header>
  );
}
