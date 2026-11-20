
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import StudentTopbar from "../components/layout/StudentTopbar";
import StudentSidebar from "../components/layout/StudentSidebar";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export default function SearchResults() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [itemType, setItemType] = useState("All");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch reports from the database
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/reports`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load items.");
        }

        const reports = Array.isArray(data)
          ? data
          : data.reports || [];

        setItems(reports);
      } catch (err) {
        console.error("Explore items error:", err);
        setError(
          err.message || "Something went wrong while loading items."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Get categories from actual reports
  const categories = useMemo(() => {
    return [
      ...new Set(
        items
          .map((item) => item.category)
          .filter(Boolean)
      ),
    ].sort();
  }, [items]);

  // Resolve uploaded image paths
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "";

    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://")
    ) {
      return imageUrl;
    }

    return `${API_ORIGIN}${
      imageUrl.startsWith("/") ? "" : "/"
    }${imageUrl}`;
  };

  // Format report date
  const formatDate = (dateValue) => {
    if (!dateValue) return "Date unavailable";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Search and filter reports
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        [
          item.title,
          item.category,
          item.location,
          item.description,
        ].some((value) =>
          String(value || "").toLowerCase().includes(searchText)
        );

      const matchesCategory =
        category === "All" || item.category === category;

      const reportType = String(
        item.report_type || ""
      ).toLowerCase();

      const matchesType =
        itemType === "All" ||
        reportType === itemType.toLowerCase();

      return (
        matchesSearch &&
        matchesCategory &&
        matchesType &&
        item.status === "active"
      );
    });
  }, [items, search, category, itemType]);

  // Reset filters
  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setItemType("All");
  };

  return (
    <div className="search-results-page">
      <StudentTopbar />

      <div className="student-dashboard-body">
        <StudentSidebar />

        <main className="search-results-content">
          {/* Page heading */}
          <div className="search-results-heading">
            <div>
              <h1>Explore Items</h1>
              <p>
                Search for lost and found items around UCU.
              </p>
            </div>

            <Link
              to="/report-item"
              className="explore-report-button"
            >
              Report an Item
            </Link>
          </div>

          {/* Search and filters */}
          <section className="search-filter-panel">
            <div className="explore-search-field">
              <input
                type="search"
                placeholder="Search by item name, category or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="explore-filter-fields">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Filter by category"
              >
                <option value="All">All Categories</option>

                {categories.map((itemCategory) => (
                  <option
                    key={itemCategory}
                    value={itemCategory}
                  >
                    {itemCategory}
                  </option>
                ))}
              </select>

              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                aria-label="Filter by item type"
              >
                <option value="All">All Items</option>
                <option value="lost">Lost Items</option>
                <option value="found">Found Items</option>
              </select>
            </div>
          </section>

          {/* Results toolbar */}
          <div className="explore-results-toolbar">
            <div>
              <h2>Available Items</h2>
              <p>
                {loading
                  ? "Loading items..."
                  : `${filteredItems.length} ${
                      filteredItems.length === 1 ? "item" : "items"
                    } found`}
              </p>
            </div>

            {(search || category !== "All" || itemType !== "All") && (
              <button
                type="button"
                className="explore-reset-button"
                onClick={resetFilters}
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="explore-state">
              <p>Loading available items...</p>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="explore-state explore-error">
              <h3>Unable to load items</h3>
              <p>{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredItems.length === 0 && (
            <div className="explore-state explore-empty">
              <h3>No items available</h3>
              <p>
                There are currently no items listed matching your
                search. Please check again later.
              </p>

              {(search || category !== "All" || itemType !== "All") && (
                <button
                  type="button"
                  onClick={resetFilters}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Item cards */}
          {!loading && !error && filteredItems.length > 0 && (
            <div className="explore-item-grid">
              {filteredItems.map((item) => {
                const isFound =
                  String(item.report_type || "").toLowerCase() ===
                  "found";

                const imageUrl = getImageUrl(item.image_url);

                return (
                  <article
                    className="explore-item-card"
                    key={item.id}
                  >
                    <div className="explore-item-image">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.title}
                          loading="lazy"
                        />
                      ) : (
                        <div className="explore-image-placeholder">
                          No image available
                        </div>
                      )}

                      <span
                        className={`explore-item-type ${
                          isFound ? "found-type" : "lost-type"
                        }`}
                      >
                        {isFound ? "Found" : "Lost"}
                      </span>
                    </div>

                    <div className="explore-item-card-content">
                      <span className="explore-item-category">
                        {item.category}
                      </span>

                      <h3>{item.title}</h3>

                      <p className="explore-item-location">
                        {item.location || "Location not provided"}
                      </p>

                      <p className="explore-item-date">
                        {formatDate(item.incident_date)}
                      </p>

                      <Link
                        to={`/item/${item.id}`}
                        className="explore-view-button"
                      >
                        View Details
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
