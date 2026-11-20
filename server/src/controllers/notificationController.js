
import pool from "../config/db.js";

// Create a notification for a specific user
export const createNotification = async ({
  userId,
  title,
  message,
  type,
  reportId = null,
  claimId = null,
}) => {
  if (!userId || !title || !message || !type) {
    throw new Error("Missing required notification information.");
  }

  const [result] = await pool.execute(
    `INSERT INTO notifications
      (user_id, title, message, type, related_report_id, related_claim_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, title, message, type, reportId, claimId]
  );

  return result.insertId;
};

// Notify all administrator accounts
export const notifyAdministrators = async ({
  title,
  message,
  type,
  reportId = null,
  claimId = null,
}) => {
  const [administrators] = await pool.execute(
    `SELECT id
     FROM users
     WHERE role IN ('admin', 'administrator')`
  );

  for (const administrator of administrators) {
    await createNotification({
      userId: administrator.id,
      title,
      message,
      type,
      reportId,
      claimId,
    });
  }
};

// Get notifications for the logged-in user
export const getMyNotifications = async (req, res) => {
  try {
    const [notifications] = await pool.execute(
      `SELECT
         n.id,
         n.title,
         n.message,
         n.type,
         n.related_report_id,
         n.related_claim_id,
         n.is_read,
         n.created_at,
         r.title AS report_title,
         c.status AS claim_status
       FROM notifications n
       LEFT JOIN reports r
         ON n.related_report_id = r.id
       LEFT JOIN claims c
         ON n.related_claim_id = c.id
       WHERE n.user_id = ?
       ORDER BY n.created_at DESC`,
      [req.user.id]
    );

    return res.status(200).json({ notifications });
  } catch (error) {
    console.error("Get notifications error:", error);

    return res.status(500).json({
      message: "Unable to retrieve notifications.",
    });
  }
};

// Get unread notification count
export const getUnreadNotificationCount = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT COUNT(*) AS unreadCount
       FROM notifications
       WHERE user_id = ? AND is_read = FALSE`,
      [req.user.id]
    );

    return res.status(200).json({
      unreadCount: Number(rows[0].unreadCount),
    });
  } catch (error) {
    console.error("Get unread notification count error:", error);

    return res.status(500).json({
      message: "Unable to retrieve unread notification count.",
    });
  }
};

// Mark one notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const [result] = await pool.execute(
      `UPDATE notifications
       SET is_read = TRUE
       WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      message: "Notification marked as read.",
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);

    return res.status(500).json({
      message: "Unable to update notification.",
    });
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    await pool.execute(
      `UPDATE notifications
       SET is_read = TRUE
       WHERE user_id = ? AND is_read = FALSE`,
      [req.user.id]
    );

    return res.status(200).json({
      message: "All notifications marked as read.",
    });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);

    return res.status(500).json({
      message: "Unable to update notifications.",
    });
  }
};
