
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import StudentTopbar from "../components/layout/StudentTopbar";
import StudentSidebar from "../components/layout/StudentSidebar";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export default function ItemDetails() {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load item details.");
        }

        setItem(data.report || data);
      } catch (err) {
        console.error("Fetch item details error:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

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
    if (!dateValue) return "Date unavailable";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const isFound =
    String(item?.report_type || "").toLowerCase() === "found";

  const isAvailable = item?.status === "active";
  const imageUrl = getImageUrl(item?.image_url);

  return (
    <div className="item-details-page">
      <StudentTopbar />

      <div className="student-dashboard-body">
        <StudentSidebar />

        <main className="item-details-content">
          <div className="item-details-breadcrumb">
            <Link to="/home">Home</Link>
            <span>/</span>
            <Link to="/search">Explore Items</Link>
            <span>/</span>
            <span>Item Details</span>
          </div>

          {loading && (
            <div className="item-details-state">
              <p>Loading item details...</p>
            </div>
          )}

          {!loading && error && (
            <div className="item-details-state item-details-error">
              <h2>Unable to load item</h2>
              <p>{error}</p>
              <Link to="/search">Back to Explore Items</Link>
            </div>
          )}

          {!loading && !error && !item && (
            <div className="item-details-state">
              <h2>Item not found</h2>
              <p>This item may have been removed or is no longer available.</p>
              <Link to="/search">Back to Explore Items</Link>
            </div>
          )}

          {!loading && !error && item && (
            <>
              <div className="item-details-heading">
                <div>
                  <h1>Item Details</h1>
                  <p>
                    View information about this lost or found item.
                  </p>
                </div>

                <Link to="/search" className="item-back-button">
                  Back to Explore
                </Link>
              </div>

              <div className="item-details-layout">
                <div className="item-details-image">
                  {imageUrl ? (
                    <img src={imageUrl} alt={item.title} />
                  ) : (
                    <div className="item-details-no-image">
                      No image available
                    </div>
                  )}
                </div>

                <section className="item-details-information">
                  <div className="item-details-labels">
                    <span
                      className={`item-type-label ${
                        isFound ? "found-label" : "lost-label"
                      }`}
                    >
                      {isFound ? "Found Item" : "Lost Item"}
                    </span>

                    <span
                      className={`item-status ${
                        isAvailable ? "available-status" : "closed-status"
                      }`}
                    >
                      {isAvailable ? "Available" : "Closed"}
                    </span>
                  </div>

                  <h2>{item.title}</h2>

                  <div className="item-information-list">
                    <div>
                      <span>Category</span>
                      <strong>{item.category || "Not provided"}</strong>
                    </div>

                    <div>
                      <span>Location</span>
                      <strong>{item.location || "Not provided"}</strong>
                    </div>

                    <div>
                      <span>Date Reported</span>
                      <strong>{formatDate(item.incident_date)}</strong>
                    </div>
                  </div>

                  <div className="item-details-description">
                    <h3>Description</h3>
                    <p>
                      {item.description || "No description provided."}
                    </p>
                  </div>

                  {isFound && isAvailable ? (
                    <div className="item-claim-section">
                      <p>
                        Think this item belongs to you? Submit a claim
                        with details that can help verify ownership.
                      </p>

                      <Link
                        to={`/submit-claim/${item.id}`}
                        className="item-claim-button"
                      >
                        Claim This Item
                      </Link>
                    </div>
                  ) : !isFound ? (
                    <div className="item-details-notice">
                      This is a lost-item report. The claim process is
                      available for items that have been found.
                    </div>
                  ) : (
                    <div className="item-details-notice">
                      This item is no longer available for claiming.
                    </div>
                  )}
                </section>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
