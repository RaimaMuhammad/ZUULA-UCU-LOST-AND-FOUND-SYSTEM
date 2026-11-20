
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export default function AdminReportDetails() {
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/reports/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Unable to retrieve report."
          );
        }

        setReport(result.report);
      } catch (err) {
        console.error("Fetch report error:", err);
        setError(err.message || "Failed to load report.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${API_ORIGIN}${image.startsWith("/") ? "" : "/"}${image}`;
  };

  const formatDate = (date) => {
    if (!date) return "Not provided";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-empty-state">
          Loading report details...
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="admin-page">
        <div className="admin-empty-state">
          <h2>Unable to load report</h2>
          <p>{error || "Report not found."}</p>

          <Link
            to="/admin/reports"
            className="admin-primary-button"
          >
            Back to Reports
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* PAGE HEADER */}
      <div className="admin-page-heading">
        <div>
          <h1>Report Details</h1>
          <p>View the complete information about this reported item.</p>
        </div>

        <Link
          to="/admin/reports"
          className="admin-outline-button"
        >
          Back to Reports
        </Link>
      </div>

      {/* REPORT DETAILS */}
      <div className="admin-detail-container">

        {/* IMAGE */}
        <div className="admin-detail-image">
          {report.image_url ? (
            <img
              src={getImageUrl(report.image_url)}
              alt={report.title}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="admin-image-placeholder">
              No photograph available
            </div>
          )}
        </div>

        {/* INFORMATION */}
        <div className="admin-detail-content">

          <div className="admin-detail-title">
            <div>
              <h2>{report.title}</h2>
              <p>{report.category}</p>
            </div>

            <span
              className={`admin-status ${
                report.status === "active" ? "pending" : "approved"
              }`}
            >
              {report.status === "active" ? "Open" : "Closed"}
            </span>
          </div>

          <div className="admin-detail-section">
            <h3>Report Information</h3>

            <div className="admin-detail-grid">

              <div>
                <label>Report Type</label>
                <p>{report.report_type?.toUpperCase()}</p>
              </div>

              <div>
                <label>Category</label>
                <p>{report.category}</p>
              </div>

              <div>
                <label>Reported By</label>
                <p>{report.reporter_name || "Unknown"}</p>
              </div>

              <div>
                <label>Report ID</label>
                <p>#{report.id}</p>
              </div>

              <div>
                <label>Incident Date</label>
                <p>{formatDate(report.incident_date)}</p>
              </div>

              <div>
                <label>Date Submitted</label>
                <p>{formatDate(report.created_at)}</p>
              </div>

              <div>
                <label>Location</label>
                <p>{report.location || "Not provided"}</p>
              </div>

              <div>
                <label>Current Status</label>
                <p>
                  {report.status === "active" ? "Open" : "Closed"}
                </p>
              </div>

            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="admin-detail-section">
            <h3>Description</h3>
            <p className="admin-detail-description">
              {report.description || "No description provided."}
            </p>
          </div>

        </div>
      </div>

    

    </div>
  );
}
