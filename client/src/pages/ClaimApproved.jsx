import { Link } from "react-router-dom";

export default function ClaimApproved() {
  return (
    <div className="confirmation-page">
      <div className="confirmation-icon">✓</div>

      <h1>Claim Approved</h1>

      <p>
        The ownership claim has been approved. The claimant can now arrange
        collection of the item.
      </p>

      <div className="private-information-notice">
        <strong>Important</strong>
        <p>
          Approval does not automatically mean that the item has been returned.
          The physical handover must be confirmed separately.
        </p>
      </div>

      <div className="confirmation-actions">
        <Link to="/admin/claims" className="primary-button">
          Return to Claims
        </Link>

        <Link to="/admin" className="secondary-button">
          Admin Dashboard
        </Link>
      </div>
    </div>
  );
}