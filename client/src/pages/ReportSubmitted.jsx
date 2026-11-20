
import { Link } from "react-router-dom";

import StudentTopbar from "../components/layout/StudentTopbar";
import StudentSidebar from "../components/layout/StudentSidebar";

export default function ReportSubmitted() {
  return (
    <div className="student-dashboard report-submitted-page">
      <StudentTopbar />

      <div className="student-dashboard-body">
        <StudentSidebar />

        <main className="student-dashboard-content report-submitted-content">
          <h1 className="report-submitted-heading">
            Report submitted
          </h1>

          <section className="report-submitted-card">
            <div className="report-submitted-check">
              <svg
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M53 25.5V32C53 43.6 43.6 53 32 53C20.4 53 11 43.6 11 32C11 20.4 20.4 11 32 11C35.5 11 38.8 11.9 41.7 13.4"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <path
                  d="M24 29L32 37L58 9"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2>Your report was submitted!</h2>

            <Link
              to="/my-reports"
              className="report-submitted-view-link"
            >
              View my reports
            </Link>

            <Link
              to="/home"
              className="report-submitted-done"
            >
              Done
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}
