
import pool from "../config/db.js";

import {
  createNotification,
  notifyAdministrators,
} from "./notificationController.js";

// Submit a claim for a found item
export const createClaim = async (req, res) => {
  try {
    const { item_id, evidence } = req.body;

    if (
      !item_id ||
      !evidence ||
      typeof evidence !== "string" ||
      !evidence.trim()
    ) {
      return res.status(400).json({
        message: "Please provide your proof of ownership.",
      });
    }

    // Confirm that the report exists, is found, and is still active
    const [reports] = await pool.execute(
      `SELECT id, user_id, title, report_type, status
       FROM reports
       WHERE id = ?`,
      [item_id]
    );

    if (reports.length === 0) {
      return res.status(404).json({
        message: "The item report could not be found.",
      });
    }

    const report = reports[0];

    if (report.report_type !== "found") {
      return res.status(400).json({
        message: "You can only claim items that have been reported as found.",
      });
    }

    if (report.status !== "active") {
      return res.status(400).json({
        message: "This item is no longer available for claiming.",
      });
    }

    // Students cannot claim items they reported themselves
    if (Number(report.user_id) === Number(req.user.id)) {
      return res.status(403).json({
        message: "You cannot claim an item you reported yourself.",
      });
    }

    // Prevent duplicate pending or approved claims
    const [existingClaims] = await pool.execute(
      `SELECT id
       FROM claims
       WHERE report_id = ?
         AND claimant_id = ?
         AND status IN ('pending', 'approved')
       LIMIT 1`,
      [item_id, req.user.id]
    );

    if (existingClaims.length > 0) {
      return res.status(409).json({
        message: "You have already submitted a claim for this item.",
      });
    }

    const evidenceImage = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    // Save the claim
    const [result] = await pool.execute(
      `INSERT INTO claims
       (report_id, claimant_id, evidence, evidence_image)
       VALUES (?, ?, ?, ?)`,
      [
        item_id,
        req.user.id,
        evidence.trim(),
        evidenceImage,
      ]
    );

    const claimId = result.insertId;

    // Notify the student who submitted the claim
    try {
      await createNotification({
        userId: req.user.id,
        title: "Claim Submitted Successfully",
        message: `Your claim for "${report.title}" has been submitted and is awaiting administrator review.`,
        type: "claim_submitted",
        reportId: report.id,
        claimId,
      });
    } catch (notificationError) {
      console.error("Student claim notification error:", notificationError);
    }

    // Notify all administrators about the new claim
    try {
      await notifyAdministrators({
        title: "New Claim Requires Review",
        message: `A student has submitted a claim for "${report.title}". Please review the claim.`,
        type: "new_claim",
        reportId: report.id,
        claimId,
      });
    } catch (notificationError) {
      console.error("Administrator claim notification error:", notificationError);
    }

    return res.status(201).json({
      message: "Your claim has been submitted successfully.",
      claimId,
      status: "pending",
    });
  } catch (error) {
    console.error("Create claim error:", error);

    return res.status(500).json({
      message: "Unable to submit your claim.",
    });
  }
};

// Get claims submitted by the logged-in student
export const getMyClaims = async (req, res) => {
  try {
    const [claims] = await pool.execute(
      `SELECT
         c.id,
         c.report_id,
         c.evidence,
         c.evidence_image,
         c.status,
         c.admin_reason,
         c.created_at,
         r.title AS item_title,
         r.category,
         r.location,
         r.image_url AS item_image,
         r.report_type
       FROM claims c
       JOIN reports r ON c.report_id = r.id
       WHERE c.claimant_id = ?
       ORDER BY c.created_at DESC`,
      [req.user.id]
    );

    return res.status(200).json({ claims });
  } catch (error) {
    console.error("Get my claims error:", error);

    return res.status(500).json({
      message: "Unable to retrieve your claims.",
    });
  }
};

// Get claims submitted for a report owned by the logged-in student
export const getClaimsForMyReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const [reports] = await pool.execute(
      `SELECT id
       FROM reports
       WHERE id = ? AND user_id = ?`,
      [reportId, req.user.id]
    );

    if (reports.length === 0) {
      return res.status(404).json({
        message: "Report not found or you do not have permission to view its claims.",
      });
    }

    const [claims] = await pool.execute(
      `SELECT
         c.id,
         c.report_id,
         c.claimant_id,
         c.evidence,
         c.evidence_image,
         c.status,
         c.admin_reason,
         c.created_at,
         u.full_name AS claimant_name,
         u.student_number AS claimant_student_number
       FROM claims c
       JOIN users u ON c.claimant_id = u.id
       WHERE c.report_id = ?
       ORDER BY c.created_at DESC`,
      [reportId]
    );

    return res.status(200).json({ claims });
  } catch (error) {
    console.error("Get report claims error:", error);

    return res.status(500).json({
      message: "Unable to retrieve claims for this report.",
    });
  }
};
