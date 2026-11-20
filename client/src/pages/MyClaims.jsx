
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import StudentTopbar from "../components/layout/StudentTopbar";
import StudentSidebar from "../components/layout/StudentSidebar";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

const getImageUrl = (imagePath) => {
  if (!imagePath) return "";

  const path = String(imagePath).trim();

  if (!path) return "";

  // Keep full external image URLs unchanged.
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  // Convert relative upload paths into backend URLs.
  const cleanPath = path.replace(/^\/+/, "");

  if (cleanPath.startsWith("uploads/")) {
    return `${API_ORIGIN}/${cleanPath}`;
  }

  return `${API_ORIGIN}/${cleanPath}`;
};

export default function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/claims/my`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load your claims.");
        }

        setClaims(Array.isArray(data) ? data : data.claims || []);
      } catch (err) {
        setError(
          err.message || "Something went wrong while loading your claims."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  const getStatus = (status) => {
    const normalized = (status || "").toLowerCase();

    if (normalized === "approved") return "Approved";
    if (normalized === "rejected") return "Rejected";
    if (normalized === "returned") return "Returned";

    return "Pending";
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredClaims =
    activeFilter === "All"
      ? claims
      : claims.filter(
          (claim) => getStatus(claim.status) === activeFilter
        );

  const counts = {
    All: claims.length,
    Pending: claims.filter(
      (claim) => getStatus(claim.status) === "Pending"
    ).length,
    Approved: claims.filter(
      (claim) => getStatus(claim.status) === "Approved"
    ).length,
    Rejected: claims.filter(
      (claim) => getStatus(claim.status) === "Rejected"
    ).length,
    Returned: claims.filter(
      (claim) => getStatus(claim.status) === "Returned"
    ).length,
  };

  return (
    <div className="student-dashboard my-claims-page">
      <StudentTopbar />

      <div className="student-dashboard-body">
        <StudentSidebar />

        <main className="student-dashboard-content my-claims-content">
          <div className="my-claims-header">
            <div>
              <h1>My Claims</h1>
              <p>Track the progress of items you have claimed.</p>
            </div>

            <Link to="/search" className="my-claims-explore-button">
              Explore Items
            </Link>
          </div>

          <div className="my-claims-summary">
            <div className="my-claims-summary-item">
              <span>Total Claims</span>
              <strong>{counts.All}</strong>
            </div>

            <div className="my-claims-summary-item">
              <span>Pending</span>
              <strong>{counts.Pending}</strong>
            </div>

            <div className="my-claims-summary-item">
              <span>Approved</span>
              <strong>{counts.Approved}</strong>
            </div>

            <div className="my-claims-summary-item">
              <span>Rejected</span>
              <strong>{counts.Rejected}</strong>
            </div>
          </div>

          <section className="my-claims-section">
            <div className="my-claims-section-heading">
              <div>
                <h2>Claim History</h2>
                <p>View and follow up on your submitted claims.</p>
              </div>
            </div>

            <div className="my-claims-filters">
              {["All", "Pending", "Approved", "Rejected", "Returned"].map(
                (filter) => (
                  <button
                    type="button"
                    key={filter}
                    className={
                      activeFilter === filter
                        ? "my-claims-filter active"
                        : "my-claims-filter"
                    }
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                    <span>{counts[filter]}</span>
                  </button>
                )
              )}
            </div>

            {loading ? (
              <div className="my-claims-message">
                Loading your claims...
              </div>
            ) : error ? (
              <div className="my-claims-message my-claims-error">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            ) : filteredClaims.length === 0 ? (
              <div className="my-claims-empty">
                <div className="my-claims-empty-icon">!</div>

                <h3>
                  {claims.length === 0
                    ? "No claims submitted yet"
                    : `No ${activeFilter.toLowerCase()} claims`}
                </h3>

                <p>
                  {claims.length === 0
                    ? "When you submit a claim for a found item, it will appear here."
                    : "There are no claims in this category at the moment."}
                </p>

                {claims.length === 0 && (
                  <Link to="/search" className="my-claims-explore-button">
                    Explore Found Items
                  </Link>
                )}
              </div>
            ) : (
              <div className="my-claims-list">
                {filteredClaims.map((claim) => {
                  const status = getStatus(claim.status);

                  const itemTitle =
                    claim.item_title ||
                    claim.title ||
                    claim.item ||
                    "Claimed Item";

                  const imagePath =
                    claim.image_url ||
                    claim.item_image ||
                    claim.report_image ||
                    "";

                  const imageUrl = getImageUrl(imagePath);

                  return (
                    <article className="my-claim-card" key={claim.id}>
                      <div className="my-claim-main">
                        <div className="my-claim-item-image">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={itemTitle}
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                                event.currentTarget.parentElement.classList.add(
                                  "image-failed"
                                );
                              }}
                            />
                          ) : (
                            <span>Item</span>
                          )}
                        </div>

                        <div className="my-claim-information">
                          <h3>{itemTitle}</h3>

                          <p className="my-claim-date">
                            Submitted: {formatDate(claim.created_at)}
                          </p>

                          {claim.category && (
                            <p className="my-claim-category">
                              {claim.category}
                            </p>
                          )}

                          {claim.location && (
                            <p className="my-claim-location">
                              Location: {claim.location}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="my-claim-status-area">
                        <span
                          className={`my-claim-status ${status.toLowerCase()}`}
                        >
                          {status}
                        </span>

                        <p>
                          {claim.admin_reason ||
                            (status === "Pending"
                              ? "Awaiting administrator review"
                              : status === "Approved"
                              ? "Your claim has been approved."
                              : status === "Rejected"
                              ? "Your claim was not approved."
                              : "The item has been marked as returned.")}
                        </p>
                      </div>

                      {status === "Approved" && (
                        <div className="my-claim-next-step">
                          Contact the administrator about collecting your
                          item.
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
