import { Link, useParams } from "react-router-dom";
import { useState } from "react";

export default function ReviewClaim() {
  const { id } = useParams();
  const [decisionReason, setDecisionReason] = useState("");

  function handleApprove() {
    // Connect this action to the administrator approval API later.
  }

  function handleReject() {
    // Connect this action to the administrator rejection API later.
  }

  return (
    <div className="review-claim-page">
      <div className="breadcrumb">
        <Link to="/admin">Dashboard</Link> /{" "}
        <Link to="/admin/claims">All Claims</Link> / Review Claim
      </div>

      <h1>Review Claim</h1>
      <p>Examine the submitted evidence before making a decision.</p>

      <div className="claim-review-layout">
        <section className="review-item-section">
          <h2>Reported Item</h2>

          <div className="review-item-image">Item Image</div>

          <h3>Blue Water Bottle</h3>
          <p>Found Item</p>
          <p>Location: Ham Mukasa Library</p>
          <p>Date Found: 18 November 2026</p>

          <div className="private-evidence">
            <h3>Finder's Private Details</h3>
            <p>
              The bottle has a small scratch near the bottom and a name
              inscription on the lid.
            </p>
          </div>
        </section>

        <section className="claim-evidence-section">
          <h2>Claimant Information</h2>

          <p><strong>Name:</strong> Jane Doe</p>
          <p><strong>Student Number:</strong> 2026-00000</p>
          <p><strong>Submitted:</strong> 18 November 2026</p>

          <div className="private-evidence">
            <h3>Claimant's Ownership Evidence</h3>
            <p>
              The bottle has a scratch near the bottom. My name is written
              inside the lid.
            </p>
          </div>

          <label>Decision / Rejection Reason</label>
          <textarea
            rows="4"
            value={decisionReason}
            onChange={(e) => setDecisionReason(e.target.value)}
            placeholder="Provide a reason if rejecting the claim..."
          />

          <div className="review-actions">
            <button onClick={handleApprove} className="approve-button">
              Approve Claim
            </button>

            <button onClick={handleReject} className="reject-button">
              Reject Claim
            </button>
          </div>
        </section>
      </div>

      <p>Claim Reference: {id}</p>
    </div>
  );
}