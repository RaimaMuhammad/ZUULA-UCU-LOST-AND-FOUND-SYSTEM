
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StudentTopbar from "../components/layout/StudentTopbar";
import StudentSidebar from "../components/layout/StudentSidebar";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const fullName = user?.fullName || "Student";
  const email = user?.email || "";
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  };

  return (
    <div className="student-dashboard">
      <StudentTopbar />

      <div className="student-dashboard-body">
        <StudentSidebar />

        <main className="student-dashboard-content">
          <div className="profile-page">

            {/* Page Heading */}
            <div className="profile-heading">
              <h1>My profile</h1>
              <p>Your account and preferences.</p>
            </div>

            {/* Profile Layout */}
            <div className="profile-layout">

              {/* Left Profile Card */}
              <section className="profile-information">

                <div className="profile-cover">
                  <div className="profile-cover-pattern"></div>
                </div>

                <div className="profile-avatar-wrapper">
                  <div className="profile-avatar">
                    {initials}
                  </div>
                </div>

                <div className="profile-user-information">
                  <h2>{fullName}</h2>

                  <p className="profile-email">
                    {email}
                  </p>

                  <span className="profile-user-role">
                    Student
                  </span>
                </div>

                <div className="profile-card-divider"></div>

                <div className="profile-student-number">
                  <span>Student Number</span>
                  <strong>
                    {user?.studentNumber || "Not available"}
                  </strong>
                </div>

                <div className="profile-edit-action">
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("profile-account-details")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Edit profile
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 20h9"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </section>

              {/* Right Account Panel */}
              <section
                className="profile-account-panel"
                id="profile-account-details"
              >
                <div className="profile-account-heading">
                  <h2>Account</h2>
                  <p>Manage your account and preferences.</p>
                </div>

                <div className="profile-account-options">

                  {/* Edit Profile */}
                  <div className="profile-option">
                    <div className="profile-option-icon burgundy">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 20h9"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />
                        <path
                          d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <div className="profile-option-text">
                      <strong>Edit profile</strong>
                      <span>Manage your personal details</span>
                    </div>

                    <span className="profile-option-arrow">›</span>
                  </div>

                  {/* Account Email */}
                  <a
                    href={`mailto:${email}`}
                    className="profile-option"
                  >
                    <div className="profile-option-icon blue">
                      <svg viewBox="0 0 24 24" fill="none">
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                        <path
                          d="m4 7 8 6 8-6"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <div className="profile-option-text">
                      <strong>Email address</strong>
                      <span>{email || "No email available"}</span>
                    </div>

                    <span className="profile-option-arrow">›</span>
                  </a>

                  {/* History */}
                  <Link
                    to="/my-reports"
                    className="profile-option"
                  >
                    <div className="profile-option-icon blue">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M3 12a9 9 0 1 0 3-6.7L3 8"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3 3v5h5M12 7v5l3 2"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <div className="profile-option-text">
                      <strong>History</strong>
                      <span>See your reports and claims</span>
                    </div>

                    <span className="profile-option-arrow">›</span>
                  </Link>

                  {/* Settings */}
                  <div className="profile-option">
                    <div className="profile-option-icon burgundy">
                      <svg viewBox="0 0 24 24" fill="none">
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                        <path
                          d="m19.4 15 .1.1a1.7 1.7 0 1 1-2.4 2.4l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.4a1.7 1.7 0 1 1-3.4 0v-.2a1.7 1.7 0 0 0-2.9-1.2l-.1.1a1.7 1.7 0 1 1-2.4-2.4l.1-.1a1.7 1.7 0 0 0-1.2-2.9h-.4a1.7 1.7 0 1 1 0-3.4h.2a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a1.7 1.7 0 1 1 2.4-2.4l.1.1a1.7 1.7 0 0 0 2.9-1.2v-.4a1.7 1.7 0 1 1 3.4 0v.2a1.7 1.7 0 0 0 2.9 1.2l.1-.1a1.7 1.7 0 1 1 2.4 2.4l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.4a1.7 1.7 0 1 1 0 3.4h-.2a1.7 1.7 0 0 0-1.2 2.9Z"
                          stroke="currentColor"
                          strokeWidth="1.4"
                        />
                      </svg>
                    </div>

                    <div className="profile-option-text">
                      <strong>Settings</strong>
                      <span>Manage your account preferences</span>
                    </div>

                    <span className="profile-option-arrow">›</span>
                  </div>

                  {/* Privacy Policy */}
                  <div className="profile-option">
                    <div className="profile-option-icon blue">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinejoin="round"
                        />
                        <path
                          d="m9 12 2 2 4-4"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <div className="profile-option-text">
                      <strong>Privacy policy</strong>
                      <span>How your information is handled</span>
                    </div>

                    <span className="profile-option-arrow">›</span>
                  </div>

                  {/* Logout */}
                  <button
                    type="button"
                    className="profile-option profile-logout-option"
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    <div className="profile-option-icon logout-icon">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M10 17l5-5-5-5M15 12H3"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    <div className="profile-option-text">
                      <strong>
                        {loggingOut ? "Logging out..." : "Log out"}
                      </strong>
                      <span>Sign out of your account</span>
                    </div>

                    <span className="profile-option-arrow">›</span>
                  </button>

                </div>
              </section>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
