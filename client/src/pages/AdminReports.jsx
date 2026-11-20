
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/reports`, {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch reports."
          );
        }

        setReports(
          Array.isArray(result.reports) ? result.reports : []
        );
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError(err.message || "Unable to load reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

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
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredReports = reports.filter((report) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      (report.title || "").toLowerCase().includes(searchTerm) ||
      (report.reporter_name || "").toLowerCase().includes(searchTerm) ||
      (report.category || "").toLowerCase().includes(searchTerm);

    const matchesFilter =
      filter === "All" ||
      (filter === "Open" && report.status === "active") ||
      (filter === "Closed" && report.status === "closed");

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="admin-page">

      {/* PAGE HEADING */}
      <div className="admin-page-heading">
        <div>
          <h1>All Reports</h1>
          <p>View and manage all lost and found item reports.</p>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="admin-filter-tabs">
        {["All", "Open", "Closed"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={filter === item ? "active" : ""}
          >
            {item}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <div className="admin-search-bar">
        <span>⌕</span>

        <input
          type="search"
          placeholder="Search for an item or reporter..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* REPORT LIST */}
      <section className="admin-reports-list">

        <div className="admin-list-heading">
          <h2>Reported Items</h2>
          <span>{filteredReports.length} reports</span>
        </div>

        {loading ? (
          <div className="admin-loading">
            Loading reports...
          </div>
        ) : error ? (
          <div className="admin-error">
            {error}
          </div>
        ) : filteredReports.length > 0 ? (

          filteredReports.map((report) => {
            const imageUrl = getImageUrl(report.image_url);

            return (
              <article
                className="admin-report-card"
                key={report.id}
              >

                {/* ITEM IMAGE */}
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={report.title}
                    className="admin-item-thumbnail"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="admin-image-placeholder">
                    No image
                  </div>
                )}

                {/* REPORT INFORMATION */}
                <div className="admin-report-information">
                  <h3>{report.title}</h3>

                  <p>{report.category || "Uncategorized"}</p>

                  <small>
                    Reported by {report.reporter_name || "Unknown"}
                  </small>

                  <small>
                    {formatDate(report.created_at)}
                  </small>
                </div>

                {/* REPORT TYPE AND STATUS */}
                <div className="admin-report-meta">

                  <span
                    className={`admin-status ${report.report_type}`}
                  >
                    {report.report_type?.toUpperCase()}
                  </span>

                  <span
                    className={`admin-status ${
                      report.status === "active" ? "pending" : "approved"
                    }`}
                  >
                    {report.status === "active" ? "Open" : "Closed"}
                  </span>

                </div>

                {/* VIEW REPORT DETAILS */}
                <Link
                  to={`/admin/reports/${report.id}`}
                  className="admin-outline-button"
                >
                  View
                </Link>

              </article>
            );
          })

        ) : (
          <div className="admin-empty-state">
            <h3>No reports found</h3>
            <p>
              {reports.length === 0
                ? "There are currently no reports in the system."
                : "Try changing your search or filter."}
            </p>
          </div>
        )}

      </section>
    </div>
  );
}
