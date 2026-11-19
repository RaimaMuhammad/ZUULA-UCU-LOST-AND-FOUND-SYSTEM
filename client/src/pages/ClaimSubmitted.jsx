import { Link } from "react-router-dom";

export default function ClaimSubmitted() {
  return (
    <div className="confirmation-page">
      <div className="confirmation-icon">✓</div>

      <h1>Claim Submitted Successfully</h1>

      <p>
        Your claim has been sent to the administrator for review. You will be
        able to track the decision from your claims page.
      </p>

      <div className="confirmation-actions">
        <Link to="/my-claims" className="primary-button">
          View My Claims
        </Link>

        <Link to="/home" className="secondary-button">
          Return Home
        </Link>
      </div>
    </div>
  );
}