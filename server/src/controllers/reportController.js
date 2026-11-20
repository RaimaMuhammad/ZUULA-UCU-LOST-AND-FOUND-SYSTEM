
import pool from "../config/db.js";

import {
  createNotification,
  notifyAdministrators,
} from "./notificationController.js";

// Create a new lost or found report
export const createReport = async (req, res) => {
  try {
    const {
      reportType,
      title,
      category,
      description,
      privateDetails,
      location,
      incidentDate,
    } = req.body;

    if (
      !reportType ||
      !title ||
      !category ||
      !description ||
      !location ||
      !incidentDate
    ) {
      return res.status(400).json({
        message: "Please provide all required report information.",
      });
    }

    if (!["lost", "found"].includes(reportType)) {
      return res.status(400).json({
        message: "Report type must be lost or found.",
      });
    }

    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const [result] = await pool.execute(
      `INSERT INTO reports
      (user_id, report_type, title, category, description,
       private_details, location, incident_date, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        reportType,
        title.trim(),
        category,
        description.trim(),
        reportType === "found" ? privateDetails || null : null,
        location,
        incidentDate,
        imageUrl,
      ]
    );

    const reportId = result.insertId;

    try {
      await createNotification({
        userId: req.user.id,
        title: "Report Submitted Successfully",
        message: `Your ${reportType} item report "${title.trim()}" has been submitted successfully.`,
        type: "report_submitted",
        reportId,
      });
    } catch (notificationError) {
      console.error("Student report notification error:", notificationError);
    }

    try {
      await notifyAdministrators({
        title: "New Item Report Submitted",
        message: `A new ${reportType} item report "${title.trim()}" requires attention.`,
        type: "new_report",
        reportId,
      });
    } catch (notificationError) {
      console.error("Administrator report notification error:", notificationError);
    }

    return res.status(201).json({
      message: "Report submitted successfully.",
      reportId,
      imageUrl,
    });
  } catch (error) {
    console.error("Create report error:", error);

    return res.status(500).json({
      message: "Unable to submit report.",
    });
  }
};

// Get all reports for the administrator
export const getAllReports = async (req, res) => {
  try {
    const [reports] = await pool.execute(
      `SELECT
        r.id,
        r.user_id,
        r.report_type,
        r.title,
        r.category,
        r.description,
        r.location,
        r.incident_date,
        r.image_url,
        r.status,
        r.created_at,
        u.full_name AS reporter_name
       FROM reports r
       JOIN users u ON r.user_id = u.id
       ORDER BY r.created_at DESC`
    );

    return res.status(200).json({ reports });
  } catch (error) {
    console.error("Get reports error:", error);

    return res.status(500).json({
      message: "Unable to retrieve reports.",
    });
  }
};

// Get a single report
export const getReportById = async (req, res) => {
  try {
    const [reports] = await pool.execute(
      `SELECT
        r.id,
        r.user_id,
        r.report_type,
        r.title,
        r.category,
        r.description,
        r.location,
        r.incident_date,
        r.image_url,
        r.status,
        r.created_at,
        u.full_name AS reporter_name
       FROM reports r
       JOIN users u ON r.user_id = u.id
       WHERE r.id = ?`,
      [req.params.id]
    );

    if (reports.length === 0) {
      return res.status(404).json({
        message: "Report not found.",
      });
    }

    return res.status(200).json({
      report: reports[0],
    });
  } catch (error) {
    console.error("Get report error:", error);

    return res.status(500).json({
      message: "Unable to retrieve report.",
    });
  }
};

// Get reports belonging to the logged-in student
export const getMyReports = async (req, res) => {
  try {
    const [reports] = await pool.execute(
      `SELECT
        id,
        report_type,
        title,
        category,
        description,
        private_details,
        location,
        incident_date,
        image_url,
        status,
        created_at
       FROM reports
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    return res.status(200).json({ reports });
  } catch (error) {
    console.error("Get my reports error:", error);

    return res.status(500).json({
      message: "Unable to retrieve your reports.",
    });
  }
};

// Update a report belonging to the logged-in student
export const updateReport = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      privateDetails,
      location,
      incidentDate,
    } = req.body;

    if (
      !title ||
      !category ||
      !description ||
      !location ||
      !incidentDate
    ) {
      return res.status(400).json({
        message: "Please provide all required report information.",
      });
    }

    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const [result] = await pool.execute(
      `UPDATE reports
       SET title = ?,
           category = ?,
           description = ?,
           private_details = COALESCE(?, private_details),
           location = ?,
           incident_date = ?,
           image_url = COALESCE(?, image_url)
       WHERE id = ? AND user_id = ? AND status = 'active'`,
      [
        title.trim(),
        category,
        description.trim(),
        privateDetails || null,
        location.trim(),
        incidentDate,
        imageUrl,
        req.params.id,
        req.user.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Report not found or cannot be edited.",
      });
    }

    return res.status(200).json({
      message: "Report updated successfully.",
      imageUrl,
    });
  } catch (error) {
    console.error("Update report error:", error);

    return res.status(500).json({
      message: "Unable to update report.",
    });
  }
};

// Close a report belonging to the logged-in student
export const closeReport = async (req, res) => {
  try {
    const [reports] = await pool.execute(
      `SELECT id, title
       FROM reports
       WHERE id = ? AND user_id = ? AND status = 'active'`,
      [req.params.id, req.user.id]
    );

    if (reports.length === 0) {
      return res.status(404).json({
        message: "Report not found or cannot be closed.",
      });
    }

    const report = reports[0];

    const [result] = await pool.execute(
      `UPDATE reports
       SET status = 'closed'
       WHERE id = ? AND user_id = ? AND status = 'active'`,
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Report not found or cannot be closed.",
      });
    }

    try {
      await createNotification({
        userId: req.user.id,
        title: "Report Closed",
        message: `Your report "${report.title}" has been successfully closed.`,
        type: "report_closed",
        reportId: report.id,
      });
    } catch (notificationError) {
      console.error("Report closure notification error:", notificationError);
    }

    return res.status(200).json({
      message: "Report closed successfully.",
    });
  } catch (error) {
    console.error("Close report error:", error);

    return res.status(500).json({
      message: "Unable to close report.",
    });
  }
};
