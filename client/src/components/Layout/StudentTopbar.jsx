
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import zuulaLogo from "../../assets/zuula-logo.png";

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

      <Link to="/home" className="student-brand">
        <img
          src={zuulaLogo}
          alt="ZUULA"
          className="student-logo-image"
        />
      </Link>

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
