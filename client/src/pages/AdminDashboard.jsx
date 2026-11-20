
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminDashboard() {
  const { user } = useAuth();

  const [reports, setReports] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch actual dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [reportsResponse, claimsResponse] =
          await Promise.all([
            fetch(`${API_BASE_URL}/reports`, {
              credentials: "include",
            }),

            fetch(`${API_BASE_URL}/admin/claims`, {
              credentials: "include",
            }),
          ]);

        const reportsData = await reportsResponse.json();
        const claimsData = await claimsResponse.json();

        if (!reportsResponse.ok) {
          throw new Error(
            reportsData.message || "Unable to retrieve reports."
          );
        }

        if (!claimsResponse.ok) {
          throw new Error(
            claimsData.message || "Unable to retrieve claims."
          );
        }

        setReports(reportsData.reports || []);
        setClaims(claimsData.claims || []);

      } catch (err) {
        console.error("Dashboard loading error:", err);
        setError(err.message || "Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate actual statistics
  const pendingClaims = claims.filter(
    (claim) => claim.status?.toLowerCase() === "pending"
  );

  const approvedClaims = claims.filter(
    (claim) => claim.status?.toLowerCase() === "approved"
  );

  const statistics = [
    {
      label: "Active Reports",
      value: reports.length,
      icon: "📋",
      color: "blue",
    },
    {
      label: "Total Claims",
      value: claims.length,
      icon: "📨",
      color: "purple",
    },
    {
      label: "Approved",
      value: approvedClaims.length,
      icon: "✓",
      color: "green",
    },
    {
      label: "Pending",
      value: pendingClaims.length,
      icon: "◷",
      color: "orange",
    },
  ];

  // Show the latest five pending claims
  const recentPendingClaims = pendingClaims.slice(0, 5);

  const administratorName =
    user?.fullName ||
    user?.full_name ||
    user?.name ||
    "Administrator";

  return (
    <div className="admin-page">

      {/* WELCOME HEADER */}
      <div className="admin-welcome">

        <div>
          <h1>Administrator Overview</h1>

          <p>
            Welcome back, {administratorName}.
            Here is what's happening with ZUULA today.
          </p>
        </div>

        <div className="admin-date">
          {new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>

      </div>

      {/* LOADING */}
      {loading && (
        <div className="admin-empty-state">
          <p>Loading administrator dashboard...</p>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="admin-empty-state">
          <h3>Dashboard could not load</h3>
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
        <>

          {/* STATISTICS */}
          <section className="admin-statistics">

            {statistics.map((stat) => (
              <article
                className="admin-stat-card"
                key={stat.label}
              >

                <div className={`stat-icon ${stat.color}`}>
                  {stat.icon}
                </div>

                <div>
                  <h2>{stat.value}</h2>
                  <p>{stat.label}</p>
                </div>

              </article>
            ))}

          </section>

          {/* PENDING CLAIMS */}
          <section className="admin-section">

            <div className="admin-section-heading">

              <div>
                <h2>Need your attention</h2>

                <p>
                  Claims waiting for administrator review.
                </p>
              </div>

              <Link
                to="/admin/claims"
                className="admin-view-all"
              >
                View all
              </Link>

            </div>

            <div className="admin-pending-list">

              {recentPendingClaims.length > 0 ? (

                recentPendingClaims.map((claim) => (

                  <article
                    className="admin-pending-card"
                    key={claim.id}
                  >

                    {/* ITEM PHOTOGRAPH */}
                    <div className="admin-claim-image">

                      {getImageUrl(claim.item_image) ? (

                        <img
                          src={getImageUrl(claim.item_image)}
                          alt={claim.item_title || "Claimed item"}
                          className="admin-item-thumbnail"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />

                      ) : (

                        <div className="admin-image-placeholder">
                          📷
                        </div>

                      )}

                    </div>

                    {/* CLAIM DETAILS */}
                    <div className="admin-pending-details">

                      <h3>
                        {claim.item_title || "Untitled Item"}
                      </h3>

                      <p>
                        Claimant: {
                          claim.claimant_name || "Unknown"
                        }
                      </p>

                      <small>
                        Submitted: {formatDate(claim.created_at)}
                      </small>

                    </div>

                    {/* STATUS */}
                    <span className="admin-status pending">
                      Pending
                    </span>

                    {/* REVIEW */}
                    <Link
                      to={`/admin/review-claim/${claim.id}`}
                      className="admin-primary-button"
                    >
                      Review claim
                    </Link>

                  </article>

                ))

              ) : (

                <div className="admin-empty-state">
                  <h3>All caught up!</h3>
                  <p>
                    There are no pending claims requiring review.
                  </p>
                </div>

              )}

            </div>

          </section>

          {/* QUICK ACTIONS */}
          <section className="admin-quick-actions">

            <h2>Quick Actions</h2>

            <div className="admin-action-grid">

              <Link to="/admin/reports">

                <span>📋</span>

                <strong>View Reports</strong>

                <small>
                  Manage lost and found reports
                </small>

              </Link>

              <Link to="/admin/claims">

                <span>📨</span>

                <strong>Manage Claims</strong>

                <small>
                  Review student ownership claims
                </small>

              </Link>

            </div>

          </section>

        </>
      )}

    </div>
  );
}
