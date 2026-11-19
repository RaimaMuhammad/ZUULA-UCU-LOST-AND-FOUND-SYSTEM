
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import StudentTopbar from "../components/layout/StudentTopbar";
import StudentSidebar from "../components/layout/StudentSidebar";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API_ORIGIN = API_BASE_URL
  .replace(/\/api\/?$/, "")
  .replace(/\/+$/, "");

const CATEGORIES = [
  "All",
  "Electronics",
  "Bags",
  "Books",
  "Clothing",
  "Keys",
  "Other",
];

export default function Home() {
  const { user } = useAuth();

  const [reports, setReports] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH REPORTS
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/reports`, {
        credentials: "include",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Unable to load reports.");
      }

      setReports(Array.isArray(data.reports) ? data.reports : []);
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // CONVERT IMAGE PATHS INTO COMPLETE BACKEND URLS
  const getImageUrl = (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== "string") {
      return null;
    }

    const cleanPath = imageUrl.trim();

    if (
      cleanPath.startsWith("http://") ||
      cleanPath.startsWith("https://")
    ) {
      return cleanPath;
    }

    return `${API_ORIGIN}/${cleanPath.replace(/^\/+/, "")}`;
  };

  // SEARCH AND FILTER REPORTS
  const filteredItems = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return reports.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchesType =
        selectedType === "All" ||
        item.report_type?.toLowerCase() === selectedType.toLowerCase();

      const matchesSearch =
        !searchTerm ||
        item.title?.toLowerCase().includes(searchTerm) ||
        item.category?.toLowerCase().includes(searchTerm) ||
        item.location?.toLowerCase().includes(searchTerm) ||
        item.description?.toLowerCase().includes(searchTerm);

      return matchesCategory && matchesType && matchesSearch;
    });
  }, [reports, selectedCategory, selectedType, search]);

  const latestItems = filteredItems.slice(0, 4);

  // LOST AND FOUND COUNTERS
  const lostCount = reports.filter(
    (item) =>
      item.report_type?.toLowerCase() === "lost" &&
      item.status === "active"
  ).length;

  const foundCount = reports.filter(
    (item) =>
      item.report_type?.toLowerCase() === "found" &&
      item.status === "active"
  ).length;

  // STUDENT NAME
  const firstName =
    user?.fullName?.split(" ")[0] ||
    user?.full_name?.split(" ")[0] ||
    user?.name?.split(" ")[0] ||
    "Student";

  // FORMAT DATES
  const formatDate = (value) => {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // RESET FILTERS
  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedType("All");
    setSearch("");
  };

  return (
    <div className="student-dashboard">
      {/* TOP HEADER */}
      <StudentTopbar />

      {/* DASHBOARD BODY */}
      <div className="student-dashboard-body">
        {/* SIDEBAR */}
        <StudentSidebar />

        {/* HOME PAGE CONTENT */}
        <main className="student-dashboard-content">
          {/* WELCOME */}
          <section className="student-dashboard-heading">
            <div>
              <p className="student-greeting">WELCOME BACK</p>

              <h1>Hello, {firstName}!</h1>

              <p>
                Find what belongs to you or help someone recover
                something they have lost around UCU.
              </p>
            </div>

            <Link
              to="/report-item"
              className="student-report-button"
            >
              Report an Item
            </Link>
          </section>

          {/* SEARCH */}
          <section className="student-home-search">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by item name, category or location..."
              aria-label="Search reported items"
            />

            {search && (
              <button
                type="button"
                className="student-clear-search"
                onClick={() => setSearch("")}
              >
                Clear
              </button>
            )}
          </section>

          {/* CATEGORIES AND QUICK LINKS */}
          <section className="student-category-filters">
            <div className="student-section-heading">
              <div>
                <h2>Browse Categories</h2>
                <p>Choose a category to see reported items.</p>
              </div>
            </div>

            <div className="student-category-row">
              <div className="student-category-list">
                {CATEGORIES.map((category) => (
                  <button
                    type="button"
                    key={category}
                    className={
                      selectedCategory === category
                        ? "student-category-button active"
                        : "student-category-button"
                    }
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="student-home-quick-links">
                <Link
                  to="/my-reports"
                  className="student-quick-link student-quick-link-reports"
                >
                  My Reports
                </Link>

                <Link
                  to="/my-claims"
                  className="student-quick-link student-quick-link-claims"
                >
                  My Claims
                </Link>
              </div>
            </div>
          </section>

          {/* LOST AND FOUND */}
          <section className="student-report-options">
            <button
              type="button"
              className={`student-report-option lost-option ${
                selectedType === "lost" ? "selected" : ""
              }`}
              onClick={() =>
                setSelectedType(
                  selectedType === "lost" ? "All" : "lost"
                )
              }
            >
              <div>
                <h2>Lost Items</h2>

                <p>
                  Looking for something you misplaced on campus?
                </p>

                <span>
                  {loading
                    ? "Loading..."
                    : `${lostCount} active reports`}
                </span>
              </div>
            </button>

            <button
              type="button"
              className={`student-report-option found-option ${
                selectedType === "found" ? "selected" : ""
              }`}
              onClick={() =>
                setSelectedType(
                  selectedType === "found" ? "All" : "found"
                )
              }
            >
              <div>
                <h2>Found Items</h2>

                <p>
                  Browse items that have been found around campus.
                </p>

                <span>
                  {loading
                    ? "Loading..."
                    : `${foundCount} active reports`}
                </span>
              </div>
            </button>
          </section>

          {/* LATEST ITEMS */}
          <section className="student-latest-section">
            <div className="student-section-heading">
              <div>
                <h2>
                  {selectedCategory === "All"
                    ? "Latest Items"
                    : `${selectedCategory} Items`}
                </h2>

                <p>
                  {selectedType === "All"
                    ? "Recently reported items from the UCU community."
                    : `Showing ${selectedType} item reports.`}
                </p>
              </div>

              <Link
                to="/search"
                className="student-view-all"
              >
                View All
              </Link>
            </div>

            {/* LOADING */}
            {loading && (
              <div className="student-dashboard-message">
                Loading reported items...
              </div>
            )}

            {/* ERROR */}
            {!loading && error && (
              <div className="student-dashboard-message error">
                <strong>Unable to load items</strong>

                <p>{error}</p>

                <button
                  type="button"
                  onClick={fetchReports}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* EMPTY RESULTS */}
            {!loading && !error && latestItems.length === 0 && (
              <div className="student-dashboard-message empty">
                <strong>
                  {search
                    ? "No matching items found"
                    : selectedCategory !== "All"
                      ? `No ${selectedCategory} items available`
                      : selectedType !== "All"
                        ? `No ${selectedType} items available`
                        : "No items available"}
                </strong>

                <p>
                  There are currently no items listed matching
                  your selection. Please check again later.
                </p>

                {(selectedCategory !== "All" ||
                  selectedType !== "All" ||
                  search) && (
                  <button
                    type="button"
                    onClick={resetFilters}
                  >
                    View All Items
                  </button>
                )}
              </div>
            )}

            {/* REPORT CARDS */}
            {!loading && !error && latestItems.length > 0 && (
              <div className="student-latest-grid">
                {latestItems.map((item) => {
                  const imageUrl = getImageUrl(item.image_url);

                  return (
                    <article
                      className="student-latest-card"
                      key={item.id}
                    >
                      {/* ITEM IMAGE */}
                      <Link
                        to={`/item/${item.id}`}
                        className="student-item-image"
                      >
                        {imageUrl && (
                          <img
                            src={imageUrl}
                            alt={item.title || "Reported item"}
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";

                              const placeholder =
                                event.currentTarget.parentElement?.querySelector(
                                  ".student-item-image-placeholder"
                                );

                              if (placeholder) {
                                placeholder.style.display = "flex";
                              }
                            }}
                          />
                        )}

                        <div
                          className="student-item-image-placeholder"
                          style={{
                            display: imageUrl ? "none" : "flex",
                          }}
                        >
                          <small>No image available</small>
                        </div>
                      </Link>

                      {/* ITEM DETAILS */}
                      <div className="student-item-details">
                        <div className="student-item-topline">
                          <span
                            className={`student-item-type ${
                              item.report_type?.toLowerCase() === "lost"
                                ? "lost"
                                : "found"
                            }`}
                          >
                            {item.report_type?.toUpperCase()}
                          </span>

                          <span className="student-item-date">
                            {formatDate(item.created_at)}
                          </span>
                        </div>

                        <Link
                          to={`/item/${item.id}`}
                          className="student-item-title"
                        >
                          {item.title}
                        </Link>

                        <p className="student-item-category">
                          {item.category}
                        </p>

                        <p className="student-item-location">
                          {item.location}
                        </p>

                        <Link
                          to={`/item/${item.id}`}
                          className="student-item-view"
                        >
                          View Details
                        </Link>
                      </div>
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
