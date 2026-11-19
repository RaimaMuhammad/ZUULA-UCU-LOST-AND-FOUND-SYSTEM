import { Link } from "react-router-dom";

export default function ReportSubmitted() {
  return (
    <div className="confirmation-page">
      <div className="confirmation-icon">✓</div>

      <h1>Report Submitted Successfully</h1>

      <p>
        Your item report has been received. You can track and manage your
        submission from your reports page.
      </p>

      <div className="confirmation-actions">
        <Link to="/my-reports" className="primary-button">
          View My Reports
        </Link>

        <Link to="/home" className="secondary-button">
          Return Home
        </Link>
      </div>
    </div>
  );
}