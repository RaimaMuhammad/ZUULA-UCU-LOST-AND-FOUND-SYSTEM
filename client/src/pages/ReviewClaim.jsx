import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ReviewClaim() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [decisionReason, setDecisionReason] = useState("");

  // Temporary demonstration data.
  // Later, retrieve this record from the backend using id.
  const claim = {
    id,
    item: "Set of Keys",
    category: "Personal Items",
    location: "UCU Main Library",
    dateFound: "16 November 2026",
    image: "/uploads/keys.jpg",
    claimant: "Jane Doe",
    studentId: "2026-00001",
    submitted: "18 November 2026",
    email: "jane@example.com",
    privateDetails:
      "The keys have a small silver keyring with a blue attachment.",
    evidence:
      "I lost a set of keys with a blue keyring near the university library. One of the keys has a small marking on it.",
  };

  function handleApprove() {
    navigate(`/admin/claim-approved/${id}`);
  }

  function handleReject() {
    if (!decisionReason.trim()) {
      alert("Please provide a reason for rejecting this claim.");
      return;
    }

    alert("Claim rejected successfully (demonstration only).");
    navigate("/admin/claims");
  }

  return (
    <div className="admin-page">

      {/* BREADCRUMB */}
      <div className="admin-breadcrumb">
        <Link to="/admin">Dashboard</Link>
        <span>/</span>
        <Link to="/admin/claims">All Claims</Link>
        <span>/</span>
        <strong>Review Claim</strong>
      </div>

      <div className="admin-page-heading">
        <div>
          <h1>Review Claim</h1>
          <p>
            Examine the ownership evidence before making a decision.
          </p>
        </div>

        <span className="admin-status pending">
          Pending Review
        </span>
      </div>

      {/* REVIEW CONTENT */}
      <div className="admin-review-layout">

        {/* LEFT: ITEM INFORMATION */}
        <section className="admin-review-item">

          <h2>Reported Item</h2>

          <div className="admin-review-image">
            <img
              src={claim.image}
              alt={claim.item}
            />
          </div>

          <h3>{claim.item}</h3>

          <span className="admin-status found">
            Found Item
          </span>

          <div className="admin-detail-list">

            <div>
              <span>Category</span>
              <strong>{claim.category}</strong>
            </div>

            <div>
              <span>Location Found</span>
              <strong>{claim.location}</strong>
            </div>

            <div>
              <span>Date Found</span>
              <strong>{claim.dateFound}</strong>
            </div>

          </div>

          {/* PRIVATE INFORMATION */}
          <div className="admin-private-evidence">
            <h3>Finder's Private Details</h3>
            <p>{claim.privateDetails}</p>
          </div>

        </section>

        {/* RIGHT: CLAIMANT EVIDENCE */}
        <section className="admin-review-evidence">

          <h2>Claimant Information</h2>

          <div className="admin-claimant-card">

            <div className="admin-avatar">
              {claim.claimant.charAt(0)}
            </div>

            <div>
              <h3>{claim.claimant}</h3>
              <p>{claim.studentId}</p>
              <small>{claim.email}</small>
            </div>

          </div>

          <div className="admin-detail-list">

            <div>
              <span>Claim Reference</span>
              <strong>#{claim.id}</strong>
            </div>

            <div>
              <span>Date Submitted</span>
              <strong>{claim.submitted}</strong>
            </div>

          </div>

          <div className="admin-private-evidence">
            <h3>Claimant's Ownership Evidence</h3>
            <p>{claim.evidence}</p>
          </div>

          {/* DECISION REASON */}
          <div className="admin-decision-field">

            <label htmlFor="decisionReason">
              Decision / Rejection Reason
            </label>

            <textarea
              id="decisionReason"
              value={decisionReason}
              onChange={(e) => setDecisionReason(e.target.value)}
              placeholder="Enter your decision notes or reason for rejecting this claim..."
              rows={5}
            />

          </div>

          {/* ACTION BUTTONS */}
          <div className="admin-review-actions">

            <button
              type="button"
              className="admin-approve-button"
              onClick={handleApprove}
            >
              Approve Claim
            </button>

            <button
              type="button"
              className="admin-reject-button"
              onClick={handleReject}
            >
              Reject Claim
            </button>

          </div>

        </section>

      </div>

    </div>
  );
}