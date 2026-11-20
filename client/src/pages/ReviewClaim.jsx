
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

function getImageUrl(imagePath) {
  if (!imagePath) return null;

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  const cleanPath = imagePath.replace(/^\/+/, "");

  if (cleanPath.startsWith("uploads/")) {
    return `${API_ORIGIN}/${cleanPath}`;
  }

  return `${API_ORIGIN}/uploads/${cleanPath}`;
}

function formatDate(date) {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ReviewClaim() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [claim, setClaim] = useState(null);
  const [decisionReason, setDecisionReason] = useState("");

  // ITEM COLLECTION DETAILS
  const [collectionLocation, setCollectionLocation] = useState("");
  const [collectionDate, setCollectionDate] = useState("");
  const [collectionTime, setCollectionTime] = useState("");
  const [collectionInstructions, setCollectionInstructions] = useState("");

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/admin/claims/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to retrieve claim.");
        }

        setClaim(data.claim);
      } catch (err) {
        console.error("Review claim error:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchClaim();
  }, [id]);

  async function handleApprove() {
    if (!collectionLocation.trim()) {
      setActionError(
        "Please enter the location where the student should collect the item."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to approve this claim and send the collection instructions to the student?"
    );

    if (!confirmed) return;

    try {
      setProcessing(true);
      setActionError("");

      const response = await fetch(
        `${API_BASE_URL}/admin/claims/${id}/approve`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            collectionLocation: collectionLocation.trim(),
            collectionDate,
            collectionTime,
            collectionInstructions: collectionInstructions.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to approve this claim.");
      }

      alert(data.message || "Claim approved and collection instructions sent.");
      navigate("/admin/claims");
    } catch (err) {
      console.error("Approve claim error:", err);
      setActionError(err.message || "Unable to approve this claim.");
    } finally {
      setProcessing(false);
    }
  }

  async function handleReject() {
    if (!decisionReason.trim()) {
      setActionError("Please provide a reason for rejecting this claim.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to reject this ownership claim?"
    );

    if (!confirmed) return;

    try {
      setProcessing(true);
      setActionError("");

      const response = await fetch(
        `${API_BASE_URL}/admin/claims/${id}/reject`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: decisionReason.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to reject this claim.");
      }

      alert(data.message || "Claim rejected successfully.");
      navigate("/admin/claims");
    } catch (err) {
      console.error("Reject claim error:", err);
      setActionError(err.message || "Unable to reject this claim.");
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-page review-claim-page">
        <div className="review-claim-message">
          <p>Loading claim details...</p>
        </div>
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="admin-page review-claim-page">
        <div className="admin-breadcrumb">
          <Link to="/admin">Dashboard</Link>
          <span>/</span>
          <Link to="/admin/claims">All Claims</Link>
        </div>

        <div className="review-claim-message review-claim-error">
          <h2>Unable to load claim</h2>
          <p>{error || "The requested claim could not be found."}</p>

          <Link to="/admin/claims" className="review-back-button">
            Back to All Claims
          </Link>
        </div>
      </div>
    );
  }

  const status = (claim.status || "pending").toLowerCase();
  const itemImage = getImageUrl(claim.item_image);
  const evidenceImage = getImageUrl(claim.evidence_image);

  return (
    <div className="admin-page review-claim-page">

      {/* BREADCRUMB */}
      <div className="admin-breadcrumb">
        <Link to="/admin">Dashboard</Link>
        <span>/</span>
        <Link to="/admin/claims">All Claims</Link>
        <span>/</span>
        <strong>Review Claim</strong>
      </div>

      {/* PAGE HEADER */}
      <div className="admin-page-heading review-claim-heading">
        <div>
          <h1>Review Claim</h1>
          <p>Examine the ownership evidence before making a decision.</p>
        </div>

        <span className={`admin-status ${status}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
          {status === "pending" ? " Review" : ""}
        </span>
      </div>

      {/* MAIN TWO-COLUMN CONTENT */}
      <div className="admin-review-layout">

        {/* LEFT: REPORTED ITEM */}
        <section className="admin-review-item">

          <div className="review-section-heading">
            <h2>Reported Item</h2>
            <span>Item details</span>
          </div>

          <div className="admin-review-image">
            {itemImage ? (
              <img
                src={itemImage}
                alt={claim.item_title || "Reported item"}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                  event.currentTarget.parentElement.classList.add("image-error");
                }}
              />
            ) : (
              <div className="review-image-placeholder">
                <span>📷</span>
                <small>No item image available</small>
              </div>
            )}
          </div>

          <div className="review-item-title">
            <h3>{claim.item_title || "Untitled Item"}</h3>
            <span className="review-found-badge">Found Item</span>
          </div>

          <div className="admin-detail-list">

            <div>
              <span>Category</span>
              <strong>{claim.category || "Not provided"}</strong>
            </div>

            <div>
              <span>Location Found</span>
              <strong>{claim.location || "Not provided"}</strong>
            </div>

            <div>
              <span>Date Found</span>
              <strong>{formatDate(claim.date_found)}</strong>
            </div>

            <div>
              <span>Report Reference</span>
              <strong>#{claim.report_id}</strong>
            </div>

          </div>

          <div className="admin-private-evidence">
            <h3>Finder's Private Details</h3>
            <p>
              {claim.private_details ||
                "No private item details were provided."}
            </p>
          </div>

        </section>

        {/* RIGHT: CLAIMANT EVIDENCE */}
        <section className="admin-review-evidence">

          <div className="review-section-heading">
            <h2>Claimant Information</h2>
            <span>Ownership verification</span>
          </div>

          <div className="admin-claimant-card">

            <div className="admin-avatar">
              {(claim.claimant_name || "U").charAt(0).toUpperCase()}
            </div>

            <div>
              <h3>{claim.claimant_name || "Unknown Claimant"}</h3>
              <p>
                {claim.claimant_student_number || "Student ID unavailable"}
              </p>
              <small>{claim.claimant_email || "Email unavailable"}</small>
            </div>

          </div>

          <div className="admin-detail-list">

            <div>
              <span>Claim Reference</span>
              <strong>#{claim.id}</strong>
            </div>

            <div>
              <span>Date Submitted</span>
              <strong>{formatDate(claim.created_at)}</strong>
            </div>

            <div>
              <span>Claim Status</span>
              <strong className="review-status-text">{status}</strong>
            </div>

          </div>

          <div className="admin-private-evidence claimant-evidence">

            <h3>Claimant's Ownership Evidence</h3>

            <p>
              {claim.evidence ||
                "The claimant did not provide written evidence."}
            </p>

            {evidenceImage && (
              <div className="review-evidence-image">
                <p>Evidence Photograph</p>
                <img
                  src={evidenceImage}
                  alt="Claimant's evidence"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}

          </div>

        </section>

      </div>

      {/* BOTTOM-CENTRED ADMIN DECISION CARD */}
      <section className={`admin-bottom-decision ${status}`}>

        {status === "pending" ? (
          <>
            <div className="bottom-decision-heading">
              <div>
                <h2>Admin Decision</h2>
                <p>
                  Review the submitted evidence and make your decision.
                </p>
              </div>
            </div>

            {/* ITEM COLLECTION INSTRUCTIONS */}
            <div className="admin-collection-section">

              <div className="admin-collection-heading">
                <h3>Item Collection Instructions</h3>
                <p>
                  Provide the details the student will need to collect
                  their item after approval.
                </p>
              </div>

              <div className="admin-collection-field">
                <label htmlFor="collectionLocation">
                  Collection Location <span>Required</span>
                </label>

                <input
                  type="text"
                  id="collectionLocation"
                  value={collectionLocation}
                  onChange={(event) => {
                    setCollectionLocation(event.target.value);
                    setActionError("");
                  }}
                  placeholder="e.g. UCU Lost and Found Office"
                  disabled={processing}
                />
              </div>

              <div className="admin-collection-grid">

                <div className="admin-collection-field">
                  <label htmlFor="collectionDate">
                    Collection Date
                  </label>

                  <input
                    type="date"
                    id="collectionDate"
                    value={collectionDate}
                    onChange={(event) => setCollectionDate(event.target.value)}
                    disabled={processing}
                  />
                </div>

                <div className="admin-collection-field">
                  <label htmlFor="collectionTime">
                    Collection Time
                  </label>

                  <input
                    type="time"
                    id="collectionTime"
                    value={collectionTime}
                    onChange={(event) => setCollectionTime(event.target.value)}
                    disabled={processing}
                  />
                </div>

              </div>

              <div className="admin-collection-field">
                <label htmlFor="collectionInstructions">
                  Additional Instructions
                </label>

                <textarea
                  id="collectionInstructions"
                  value={collectionInstructions}
                  onChange={(event) =>
                    setCollectionInstructions(event.target.value)
                  }
                  placeholder="e.g. Bring your student ID card when collecting the item."
                  rows={2}
                  disabled={processing}
                />
              </div>

            </div>

            {/* REJECTION REASON */}
            <div className="admin-decision-field">
              <label htmlFor="decisionReason">
                Rejection Reason
                <span>Required only when rejecting a claim</span>
              </label>

              <textarea
                id="decisionReason"
                value={decisionReason}
                onChange={(event) => {
                  setDecisionReason(event.target.value);
                  setActionError("");
                }}
                placeholder="Explain why this ownership claim should be rejected..."
                rows={3}
                disabled={processing}
              />
            </div>

            {actionError && (
              <div className="review-action-error">
                {actionError}
              </div>
            )}

            <div className="admin-review-actions">

              <button
                type="button"
                className="admin-approve-button"
                onClick={handleApprove}
                disabled={processing}
              >
                {processing ? "Processing..." : "Accept Claim"}
              </button>

              <button
                type="button"
                className="admin-reject-button"
                onClick={handleReject}
                disabled={processing}
              >
                {processing ? "Processing..." : "Reject Claim"}
              </button>

            </div>
          </>
        ) : (
          <>
            <div className="bottom-decision-heading">
              <div>
                <h2>Claim Reviewed</h2>
                <p>
                  This ownership claim has already been{" "}
                  <strong>{status}</strong>.
                </p>
              </div>
            </div>

            {claim.admin_reason && (
              <div className="review-admin-reason">
                <strong>Administrator's Reason</strong>
                <p>{claim.admin_reason}</p>
              </div>
            )}

            <Link to="/admin/claims" className="review-back-button">
              Back to All Claims
            </Link>
          </>
        )}

      </section>

    </div>
  );
}
