
import { Link, useLocation } from "react-router-dom";

import StudentTopbar from "../components/layout/StudentTopbar";
import StudentSidebar from "../components/layout/StudentSidebar";

export default function ClaimSubmitted() {
  const location = useLocation();

  const successMessage =
    location.state?.successMessage ||
    "Your claim has been submitted successfully. It is now awaiting review.";

  return (
    <div className="claim-submitted-page">
      <StudentTopbar />

      <div className="student-dashboard-body">
        <StudentSidebar />

        <main className="claim-submitted-content">
          <div className="claim-success-panel">
            <div className="claim-success-icon">
              <svg
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="32"
                  cy="32"
                  r="29"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  d="M18 32.5L27.5 42L46 22"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h1>Claim submitted successfully!</h1>

            <p>{successMessage}</p>

            <p className="claim-success-note">
              Your claim has been received and is awaiting review.
              You can check its progress from your claims page.
            </p>

            <div className="claim-success-actions">
              <Link to="/my-claims" className="claim-success-primary">
                View My Claims
              </Link>

              <Link to="/home" className="claim-success-secondary">
                Return Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
