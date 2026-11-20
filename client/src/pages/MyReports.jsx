
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import StudentTopbar from "../components/layout/StudentTopbar";
import StudentSidebar from "../components/layout/StudentSidebar";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyReports = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/reports/my`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load your reports.");
        }

        const reportList = Array.isArray(data)
          ? data
          : data.reports || [];

        setReports(reportList);
      } catch (err) {
        setError(err.message || "Something went wrong while loading reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyReports();
  }, []);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "";

    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://")
    ) {
      return imageUrl;
    }

    return `${API_ORIGIN}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Not provided";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "Not provided";

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getReportNumber = (report) => {
    const prefix =
      String(report.report_type || "").toLowerCase() === "found"
        ? "F"
        : "L";

    const id = String(report.id || "").padStart(3, "0");

    return `#${prefix}-${id}`;
  };

  const getStatus = (status) => {
    if (!status) return "Pending";

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="student-dashboard my-reports-page">
      <StudentTopbar />

      <div className="student-dashboard-body">
        <StudentSidebar />

        <main className="student-dashboard-content my-reports-content">
          <div className="my-reports-heading">
            <div>
              <h1>My reports</h1>
              <p>Keep track of the items you have reported.</p>
            </div>
          </div>

          <div className="my-reports-toolbar">
            <div className="my-reports-tabs">
              <Link to="/my-claims" className="my-reports-tab">
                My claims
              </Link>

              <Link
                to="/my-reports"
                className="my-reports-tab active"
              >
                My reports
              </Link>
            </div>

            <Link to="/report-item" className="my-reports-new-button">
              New report
            </Link>
          </div>

          <section className="my-reports-list">
            {loading && (
              <div className="my-reports-message">
                Loading your reports...
              </div>
            )}

            {!loading && error && (
              <div className="my-reports-message my-reports-error">
                {error}
              </div>
            )}

            {!loading && !error && reports.length === 0 && (
              <div className="my-reports-empty">
                <h2>You have not submitted any reports yet.</h2>
                <p>
                  When you report a lost or found item, it will appear here.
                </p>
                <Link to="/report-item" className="my-reports-new-button">
                  Report an item
                </Link>
              </div>
            )}

            {!loading &&
              !error &&
              reports.map((report) => {
                const imageUrl = getImageUrl(report.image_url);

                return (
                  <article className="my-report-card" key={report.id}>
                    <div className="my-report-image">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={report.title || "Reported item"}
                        />
                      ) : (
                        <span>No image available</span>
                      )}
                    </div>

                    <div className="my-report-information">
                      <h2>{report.title}</h2>

                      <div className="my-report-details">
                        <span>Date</span>
                        <p>{formatDate(report.incident_date || report.created_at)}</p>

                        <span>Location</span>
                        <p>{report.location || "Not provided"}</p>

                        <span>Category</span>
                        <p>{report.category || "Not provided"}</p>

                        <span>Status</span>
                        <p>{getStatus(report.status)}</p>
                      </div>
                    </div>

                    <div className="my-report-reference">
                      {getReportNumber(report)}
                    </div>

                    <div className="my-report-actions">
                      <Link
                        to="/report-item"
                        state={{ report }}
                        className="my-report-edit-button"
                      >
                        Edit report
                      </Link>
                    </div>
                  </article>
                );
              })}
          </section>
        </main>
      </div>
    </div>
  );
}
