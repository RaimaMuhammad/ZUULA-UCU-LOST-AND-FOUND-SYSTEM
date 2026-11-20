
import { useState, useEffect, useCallback } from "react";
import StudentTopbar from "../components/layout/StudentTopbar";
import StudentSidebar from "../components/layout/StudentSidebar";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Messages() {
  const [notifications, setNotifications] = useState([]);
  const [activeNotification, setActiveNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingAll, setMarkingAll] = useState(false);

  // FETCH NOTIFICATIONS
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load notifications.");
      }

      const notificationList = Array.isArray(data)
        ? data
        : data.notifications || [];

      setNotifications(notificationList);

      setActiveNotification((current) => {
        if (current) {
          return (
            notificationList.find(
              (notification) => notification.id === current.id
            ) ||
            notificationList[0] ||
            null
          );
        }

        return notificationList[0] || null;
      });
    } catch (err) {
      console.error("Notifications error:", err);
      setError(err.message || "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // COUNT UNREAD NOTIFICATIONS
  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  // FORMAT DATE
  const formatDate = (dateValue) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // FORMAT TIME
  const formatTime = (dateValue) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // NOTIFICATION CATEGORIES
  const getNotificationCategory = (type) => {
    const categories = {
      report_submitted: "Report Update",
      new_report: "New Report",
      claim_submitted: "Claim Update",
      new_claim: "Claim Update",
      claim_approved: "Claim Update",
      claim_rejected: "Action Required",
      item_ready: "Pickup Notice",
      report_closed: "Report Update",
    };

    return categories[type] || "Notification";
  };

  // NOTIFICATION STYLING
  const getNotificationClass = (type) => {
    if (type === "item_ready") return "pickup";

    if (type === "claim_rejected") return "action";

    if (
      type === "claim_submitted" ||
      type === "claim_approved" ||
      type === "new_claim"
    ) {
      return "claim-update";
    }

    return "report-update";
  };

  // OPEN NOTIFICATION AND MARK AS READ
  const openNotification = async (notification) => {
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not mark notification as read."
        );
      }

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === notification.id
            ? { ...item, is_read: true }
            : item
        )
      );

      setActiveNotification((previous) =>
        previous && previous.id === notification.id
          ? { ...previous, is_read: true }
          : previous
      );
    } catch (err) {
      console.error("Mark notification as read error:", err);
      setError(err.message);
    }
  };

  // MARK ALL NOTIFICATIONS AS READ
  const markAllAsRead = async () => {
    if (unreadCount === 0) return;

    try {
      setMarkingAll(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/notifications/read-all`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not mark notifications as read."
        );
      }

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );

      setActiveNotification((previous) =>
        previous ? { ...previous, is_read: true } : null
      );
    } catch (err) {
      console.error("Mark all notifications as read error:", err);
      setError(err.message);
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div className="student-dashboard">

      <StudentTopbar />

      <div className="student-dashboard-body">

        <StudentSidebar />

        <main className="student-dashboard-content">

          <div className="messages-page">

            {/* PAGE HEADING */}
            <div className="messages-heading">

              <div>
                <h1>Notifications</h1>

                <p>
                  Receive important updates about your reports, claims and
                  collection instructions.
                </p>
              </div>

              <div className="messages-heading-actions">

                <span className="messages-unread-count">
                  {unreadCount} Unread
                </span>

                <button
                  type="button"
                  className="mark-all-read-button"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0 || markingAll}
                >
                  {markingAll ? "Updating..." : "Mark all as read"}
                </button>

              </div>

            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="messages-error">
                {error}

                <button type="button" onClick={fetchNotifications}>
                  Try again
                </button>
              </div>
            )}

            {/* NOTIFICATIONS CONTAINER */}
            <div className="notifications-container">

              {/* LEFT: NOTIFICATION LIST */}
              <aside className="notification-list-panel">

                <div className="notification-list-header">

                  <div>
                    <h2>All Notifications</h2>

                    <span className="notification-total">
                      {notifications.length} notifications
                    </span>
                  </div>

                  <span className="notification-total-badge">
                    {notifications.length}
                  </span>

                </div>

                <div className="notification-list">

                  {loading ? (
                    <div className="notification-state">
                      Loading notifications...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="notification-state">
                      <h3>No notifications yet</h3>

                      <p>
                        Updates about your reports and claims will appear
                        here.
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification) => (

                      <button
                        type="button"
                        key={notification.id}
                        className={`notification-item ${
                          activeNotification?.id === notification.id
                            ? "active"
                            : ""
                        } ${!notification.is_read ? "unread" : ""}`}
                        onClick={() => openNotification(notification)}
                      >

                        <div className="notification-item-top">

                          <span
                            className={`notification-category ${getNotificationClass(
                              notification.type
                            )}`}
                          >
                            {getNotificationCategory(notification.type)}
                          </span>

                          {!notification.is_read && (
                            <span
                              className="notification-new-dot"
                              aria-label="Unread"
                            />
                          )}

                        </div>

                        <strong>{notification.title}</strong>

                        <span className="notification-item-message">
                          {notification.message}
                        </span>

                        <small>
                          {formatDate(notification.created_at)}
                          {notification.created_at && " · "}
                          {formatTime(notification.created_at)}
                        </small>

                      </button>

                    ))
                  )}

                </div>

              </aside>

              {/* RIGHT: NOTIFICATION DETAILS */}
              <section className="notification-details">

                {!loading && activeNotification ? (

                  <>

                    <div className="notification-details-header">

                      <span
                        className={`notification-category ${getNotificationClass(
                          activeNotification.type
                        )}`}
                      >
                        {getNotificationCategory(activeNotification.type)}
                      </span>

                      <span className="notification-sender">
                        ZUULA Notifications
                      </span>

                    </div>

                    <div className="notification-details-content">

                      <h2>{activeNotification.title}</h2>

                      <p className="notification-date">
                        {formatDate(activeNotification.created_at)}
                        {activeNotification.created_at && " · "}
                        {formatTime(activeNotification.created_at)}
                      </p>

                      {(activeNotification.related_report_id ||
                        activeNotification.related_claim_id) && (

                        <div className="notification-item-reference">

                          <span>Related Reference</span>

                          <strong>
                            {activeNotification.related_claim_id
                              ? `Claim #${activeNotification.related_claim_id}`
                              : `Report #${activeNotification.related_report_id}`}
                          </strong>

                        </div>

                      )}

                      <div className="notification-message-body">

                        {/* DISPLAY THE ACTUAL MESSAGE FROM THE DATABASE */}
                        <p className="notification-main-message">
                          {activeNotification.message}
                        </p>

                        {/* ITEM COLLECTION NOTIFICATION */}
                        {activeNotification.type === "item_ready" && (

                          <div className="notification-instructions">

                            <h3>Item Collection Instructions</h3>

                            <p>
                              The administrator has approved your ownership
                              claim. Please follow the collection details
                              provided in the notification above.
                            </p>

                          </div>

                        )}

                        {/* REJECTED CLAIM NOTIFICATION */}
                        {activeNotification.type === "claim_rejected" && (

                          <div className="notification-instructions">

                            <h3>What You Need to Do</h3>

                            <p>
                              Review the administrator's response and
                              contact the Lost and Found Office if you
                              need further clarification.
                            </p>

                          </div>

                        )}

                      </div>

                      <div className="notification-footer">

                        <span>
                          Sent by ZUULA Campus Lost and Found System
                        </span>

                        <span
                          className={`notification-read-status ${
                            activeNotification.is_read ? "read" : "unread"
                          }`}
                        >
                          {activeNotification.is_read ? "Read" : "Unread"}
                        </span>

                      </div>

                    </div>

                  </>

                ) : (

                  !loading && (

                    <div className="notification-details-empty">

                      <h3>Select a notification</h3>

                      <p>
                        Select a notification from the list to view its
                        details.
                      </p>

                    </div>

                  )

                )}

                {loading && (
                  <div className="notification-details-empty">
                    Loading notification details...
                  </div>
                )}

              </section>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}
