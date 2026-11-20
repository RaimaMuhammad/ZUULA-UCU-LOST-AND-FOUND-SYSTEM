
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminClaims() {
  const [filter, setFilter] = useState("Pending");
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/admin/claims`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to retrieve claims.");
        }

        setClaims(Array.isArray(data.claims) ? data.claims : []);
      } catch (err) {
        console.error("Admin claims error:", err);
        setError(err.message || "Something went wrong while loading claims.");
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  const filteredClaims = claims.filter((claim) => {
    if (filter === "All") return true;

    return (claim.status || "pending").toLowerCase() === filter.toLowerCase();
  });

  const getCount = (status) => {
    if (status === "All") return claims.length;

    return claims.filter(
      (claim) =>
        (claim.status || "pending").toLowerCase() === status.toLowerCase()
    ).length;
  };

  const statuses = ["All", "Pending", "Approved", "Rejected"];

  return (
    <div className="admin-page admin-claims-page">
      <div className="admin-page-heading">
        <div>
          <h1>All Claims</h1>
          <p>Review and manage ownership claims submitted by students.</p>
        </div>
        <div className="admin-claims-total">
          <span>Total Claims</span>
          <strong>{claims.length}</strong>
        </div>
      </div>

      <div className="admin-claims-filters">
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            className={filter === status ? "active" : ""}
            onClick={() => setFilter(status)}
          >
            {status}
            <span>{getCount(status)}</span>
          </button>
        ))}
      </div>

      {loading && (
        <div className="admin-claims-message">
          <p>Loading student claims...</p>
        </div>
      )}

      {!loading && error && (
        <div className="admin-claims-message admin-claims-error">
          <h3>Unable to load claims</h3>
          <p>{error}</p>
          <button
            type="button"
            className="admin-primary-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && (
        <section className="admin-claims-list">
          <div className="admin-list-heading">
            <h2>
              {filter === "All" ? "All Submitted Claims" : `${filter} Claims`}
            </h2>
            <span>
              {filteredClaims.length}{" "}
              {filteredClaims.length === 1 ? "claim" : "claims"}
            </span>
          </div>

          {filteredClaims.length > 0 ? (
            <div className="admin-claims-items">
              {filteredClaims.map((claim) => {
                const status = (claim.status || "pending").toLowerCase();
                const imageUrl = getImageUrl(claim.item_image);

                return (
                  <article className="admin-claim-card" key={claim.id}>
                    <div className="admin-claim-image">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={claim.item_title || "Claimed item"}
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                            event.currentTarget.parentElement.classList.add(
                              "image-error"
                            );
                          }}
                        />
                      ) : (
                        <div className="admin-image-placeholder">
                          <span>📷</span>
                          <small>No image</small>
                        </div>
                      )}
                    </div>

                    <div className="admin-claim-details">
                      <h3>{claim.item_title || "Untitled Item"}</h3>

                      <p className="admin-claimant">
                        <strong>Claimant:</strong>{" "}
                        {claim.claimant_name || "Unknown"}
                      </p>

                      <div className="admin-claim-meta">
                        <span>
                          <strong>Student ID:</strong>{" "}
                          {claim.claimant_student_number || "Not available"}
                        </span>

                        <span>
                          <strong>Submitted:</strong>{" "}
                          {formatDate(claim.created_at)}
                        </span>

                        {claim.category && (
                          <span>
                            <strong>Category:</strong> {claim.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="admin-claim-status">
                      <span className={`admin-status ${status}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>

                    <div className="admin-claim-action">
                      <Link
                        to={`/admin/review-claim/${claim.id}`}
                        className="admin-primary-button"
                      >
                        {status === "pending" ? "Review Claim" : "View Claim"}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="admin-empty-state">
              <h3>
                No {filter === "All" ? "" : filter.toLowerCase() + " "}claims
                found
              </h3>
              <p>There are currently no claims in this category.</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
