
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminMessages() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [activeNotification, setActiveNotification] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to load notifications.");
      }

      const data = await response.json();
      const allNotifications = Array.isArray(data)
        ? data
        : data.notifications || [];

      const adminNotifications = allNotifications.filter((notification) =>
        ["new_claim", "new_report"].includes(notification.type)
      );

      setNotifications(adminNotifications);

      setActiveNotification((current) => {
        if (!adminNotifications.length) return null;

        if (current) {
          return (
            adminNotifications.find((item) => item.id === current.id) ||
            adminNotifications[0]
          );
        }

        return adminNotifications[0];
      });

      setError("");
    } catch (err) {
      setError(err.message || "Something went wrong while loading messages.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 15000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  const filteredNotifications = notifications.filter((notification) => {
    const searchText = search.toLowerCase();

    return (
      notification.title?.toLowerCase().includes(searchText) ||
      notification.message?.toLowerCase().includes(searchText) ||
      String(notification.related_claim_id || "").includes(searchText) ||
      String(notification.related_report_id || "").includes(searchText)
    );
  });

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "Date unavailable";

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    return parsedDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategory = (type) => {
    if (type === "new_claim") return "New Claim";
    if (type === "new_report") return "New Report";
    return "Notification";
  };

  const handleSelectNotification = async (notification) => {
    setActiveNotification(notification);

    if (notification.is_read) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/notifications/${notification.id}/read`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to mark notification as read.");
      }

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === notification.id ? { ...item, is_read: true } : item
        )
      );

      setActiveNotification((previous) =>
        previous?.id === notification.id
          ? { ...previous, is_read: true }
          : previous
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/notifications/read-all`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to mark notifications as read.");
      }

      setNotifications((previous) =>
        previous.map((item) => ({ ...item, is_read: true }))
      );

      setActiveNotification((previous) =>
        previous ? { ...previous, is_read: true } : null
      );

      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRelatedAction = () => {
    if (!activeNotification) return;

    if (
      activeNotification.type === "new_claim" &&
      activeNotification.related_claim_id
    ) {
      navigate(
        `/admin/review-claim/${activeNotification.related_claim_id}`
      );
      return;
    }

    if (
      activeNotification.type === "new_report" &&
      activeNotification.related_report_id
    ) {
      navigate(
        `/admin/reports/${activeNotification.related_report_id}`
      );
    }
  };

  const getActionLabel = () => {
    if (activeNotification?.type === "new_claim") return "Review Claim";
    if (activeNotification?.type === "new_report") return "View Report";
    return "View Details";
  };

  const hasRelatedAction =
    (activeNotification?.type === "new_claim" &&
      activeNotification?.related_claim_id) ||
    (activeNotification?.type === "new_report" &&
      activeNotification?.related_report_id);

  return (
    <div className="admin-messages-page">
      <div className="admin-messages-heading">
        <div>
          <h1>Messages</h1>
          <p>Review new claims and reports submitted by students.</p>
        </div>

        <button
          type="button"
          className="admin-mark-all-button"
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
        >
          Mark All as Read
        </button>
      </div>

      {error && <div className="admin-messages-error">{error}</div>}

      <div className="admin-message-summary">
        <div className="admin-summary-card">
          <span>Total Notifications</span>
          <strong>{notifications.length}</strong>
        </div>

        <div className="admin-summary-card unread-summary">
          <span>Unread Notifications</span>
          <strong>{unreadCount}</strong>
        </div>

        <div className="admin-summary-card">
          <span>New Claims</span>
          <strong>
            {notifications.filter((item) => item.type === "new_claim").length}
          </strong>
        </div>

        <div className="admin-summary-card">
          <span>New Reports</span>
          <strong>
            {notifications.filter((item) => item.type === "new_report").length}
          </strong>
        </div>
      </div>

      <div className="admin-inbox-layout">
        <section className="admin-inbox-list-panel">
          <div className="admin-inbox-list-header">
            <div>
              <h2>Notification Inbox</h2>
              <span>{filteredNotifications.length} notifications</span>
            </div>

            <input
              type="search"
              className="admin-inbox-search"
              placeholder="Search notifications..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="admin-inbox-list">
            {loading ? (
              <div className="admin-inbox-empty">Loading notifications...</div>
            ) : filteredNotifications.length === 0 ? (
              <div className="admin-inbox-empty">
                {search
                  ? "No notifications match your search."
                  : "There are no notifications to display."}
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <button
                  type="button"
                  key={notification.id}
                  className={`admin-inbox-item ${
                    activeNotification?.id === notification.id
                      ? "active"
                      : ""
                  } ${!notification.is_read ? "unread" : ""}`}
                  onClick={() => handleSelectNotification(notification)}
                >
                  <div className="admin-inbox-item-top">
                    <span
                      className={`admin-inbox-category ${
                        notification.type === "new_claim"
                          ? "claim-category"
                          : "report-category"
                      }`}
                    >
                      {getCategory(notification.type)}
                    </span>

                    <span className="admin-inbox-date">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>

                  <div className="admin-inbox-item-title">
                    <strong>{notification.title}</strong>
                    {!notification.is_read && (
                      <span className="admin-unread-dot" />
                    )}
                  </div>

                  <p>
                    {notification.message?.length > 105
                      ? `${notification.message.slice(0, 105)}...`
                      : notification.message}
                  </p>

                  <span className="admin-inbox-item-time">
                    {formatTime(notification.created_at)}
                  </span>
                </button>
              ))
            )}
          </div>
        </section>

        <section className="admin-inbox-detail-panel">
          {!activeNotification ? (
            <div className="admin-inbox-detail-empty">
              <h2>No Notification Selected</h2>
              <p>Select a notification from the inbox to view its details.</p>
            </div>
          ) : (
            <>
              <div className="admin-detail-header">
                <div>
                  <span
                    className={`admin-inbox-category ${
                      activeNotification.type === "new_claim"
                        ? "claim-category"
                        : "report-category"
                    }`}
                  >
                    {getCategory(activeNotification.type)}
                  </span>

                  <h2>{activeNotification.title}</h2>
                  <p>
                    Received on {formatDate(activeNotification.created_at)}
                    {formatTime(activeNotification.created_at) &&
                      ` at ${formatTime(activeNotification.created_at)}`}
                  </p>
                </div>

                <span
                  className={`admin-read-label ${
                    activeNotification.is_read ? "read" : "unread-label"
                  }`}
                >
                  {activeNotification.is_read ? "Read" : "Unread"}
                </span>
              </div>

              <div className="admin-detail-divider" />

              <div className="admin-notification-source">
                <span>FROM</span>
                <strong>ZUULA System Notification</strong>
              </div>

              <div className="admin-notification-message">
                <h3>Notification Details</h3>
                <p>{activeNotification.message}</p>
              </div>

              <div className="admin-notification-reference">
                <h3>Related Reference</h3>

                {activeNotification.related_claim_id ? (
                  <div className="admin-reference-row">
                    <span>Claim Reference</span>
                    <strong>#{activeNotification.related_claim_id}</strong>
                  </div>
                ) : null}

                {activeNotification.related_report_id ? (
                  <div className="admin-reference-row">
                    <span>Report Reference</span>
                    <strong>#{activeNotification.related_report_id}</strong>
                  </div>
                ) : null}

                {!activeNotification.related_claim_id &&
                  !activeNotification.related_report_id && (
                    <p className="admin-no-reference">
                      No related record is available.
                    </p>
                  )}
              </div>

              <div className="admin-detail-actions">
                <span>
                  {activeNotification.is_read
                    ? "This notification has been read."
                    : "This notification has been marked as unread."}
                </span>

                {hasRelatedAction && (
                  <button
                    type="button"
                    className="admin-related-action-button"
                    onClick={handleRelatedAction}
                  >
                    {getActionLabel()}
                  </button>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
