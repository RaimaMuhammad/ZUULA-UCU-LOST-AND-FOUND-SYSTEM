
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import StudentTopbar from "../components/layout/StudentTopbar";
import StudentSidebar from "../components/layout/StudentSidebar";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function SubmitClaim() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [item, setItem] = useState(null);
  const [evidence, setEvidence] = useState("");
  const [evidenceImage, setEvidenceImage] = useState(null);
  const [loadingItem, setLoadingItem] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load the item being claimed
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoadingItem(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load this item.");
        }

        const report = data.report || data;

        if (String(report.report_type || "").toLowerCase() !== "found") {
          throw new Error("Only found items can be claimed.");
        }

        if (report.status !== "active") {
          throw new Error("This item is no longer available for claiming.");
        }

        setItem(report);
      } catch (err) {
        setError(err.message || "Unable to load the item.");
      } finally {
        setLoadingItem(false);
      }
    };

    if (id) {
      fetchItem();
    } else {
      setError("No item was selected for claiming.");
      setLoadingItem(false);
    }
  }, [id]);

  // Select optional evidence photograph
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a JPG, PNG or WEBP image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("The image must not exceed 5MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setEvidenceImage(file);
  };

  // Submit ownership claim
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!evidence.trim()) {
      setError("Please explain why you believe this item belongs to you.");
      return;
    }

    if (evidence.trim().length < 20) {
      setError("Please provide more detail about the identifying features.");
      return;
    }

    if (!item || submitting) return;

    try {
      setSubmitting(true);
      setError("");

      const formData = new FormData();
      formData.append("item_id", item.id);
      formData.append("evidence", evidence.trim());

      if (evidenceImage) {
        formData.append("evidence_image", evidenceImage);
      }

      const response = await fetch(`${API_BASE_URL}/claims`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to submit your claim.");
      }

      // Open the confirmation screen after successful submission
      navigate("/claim-submitted", {
        replace: true,
        state: {
          successMessage:
            data.message || "Your claim has been submitted successfully.",
          claimId: data.claimId || null,
        },
      });
    } catch (err) {
      console.error("Submit claim error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="submit-claim-page">
      <StudentTopbar />

      <div className="student-dashboard-body">
        <StudentSidebar />

        <main className="submit-claim-content">
          <div className="submit-claim-heading">
            <h1>Submit claim</h1>
            <p>Tell us why this item belongs to you.</p>
          </div>

          {loadingItem && (
            <div className="submit-claim-state">
              Loading item information...
            </div>
          )}

          {!loadingItem && error && !item && (
            <div className="submit-claim-state submit-claim-error">
              <p>{error}</p>
              <Link to="/search">Return to Explore Items</Link>
            </div>
          )}

          {!loadingItem && item && (
            <form className="claim-form" onSubmit={handleSubmit}>
              <h2>Submit proof that this belongs to you</h2>

              {error && (
                <div className="claim-form-error" role="alert">
                  {error}
                </div>
              )}

              <div className="claim-form-group">
                <label htmlFor="claim-evidence">
                  Description
                </label>

                <textarea
                  id="claim-evidence"
                  rows="7"
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  placeholder="Describe unique marks, contents, stickers, or other identifying features that prove this item belongs to you."
                  required
                  minLength={20}
                  disabled={submitting}
                />
              </div>

              <div className="claim-upload-group">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  hidden
                  disabled={submitting}
                />

                <button
                  type="button"
                  className="claim-upload-button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={submitting}
                >
                  {evidenceImage ? "Change photo" : "Upload a photo"}
                </button>

                {evidenceImage && (
                  <span className="claim-selected-file">
                    {evidenceImage.name}
                  </span>
                )}

                <span className="claim-upload-hint">
                  Optional · JPG, PNG or WEBP · Maximum 5MB
                </span>
              </div>

              <div className="claim-form-actions">
                <button
                  type="submit"
                  className="claim-submit-button"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Claim"}
                </button>

                <Link
                  to={`/item/${id}`}
                  className="claim-cancel-button"
                  aria-disabled={submitting}
                  onClick={(e) => {
                    if (submitting) e.preventDefault();
                  }}
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
