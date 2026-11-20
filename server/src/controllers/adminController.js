
import pool from "../config/db.js";
import { createNotification } from "./notificationController.js";

// Get all claims for administrator review
export const getAllClaims = async (req, res) => {
  try {
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
         c.reviewed_at,
         c.reviewed_by,
         r.title AS item_title,
         r.category,
         r.location,
         r.image_url AS item_image,
         r.report_type,
         r.status AS report_status,
         u.full_name AS claimant_name,
         u.email AS claimant_email,
         u.student_number AS claimant_student_number
       FROM claims c
       JOIN reports r ON c.report_id = r.id
       JOIN users u ON c.claimant_id = u.id
       ORDER BY
         CASE WHEN c.status = 'pending' THEN 0 ELSE 1 END,
         c.created_at DESC`
    );

    return res.status(200).json({ claims });
  } catch (error) {
    console.error("Get all claims error:", error);

    return res.status(500).json({
      message: "Unable to retrieve claims.",
    });
  }
};

// Get one claim for administrator review
export const getClaimById = async (req, res) => {
  try {
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
         c.reviewed_at,
         c.reviewed_by,
         r.title AS item_title,
         r.category,
         r.location,
         r.image_url AS item_image,
         r.report_type,
         r.status AS report_status,
         u.full_name AS claimant_name,
         u.email AS claimant_email,
         u.student_number AS claimant_student_number
       FROM claims c
       JOIN reports r ON c.report_id = r.id
       JOIN users u ON c.claimant_id = u.id
       WHERE c.id = ?`,
      [req.params.id]
    );

    if (claims.length === 0) {
      return res.status(404).json({
        message: "Claim not found.",
      });
    }

    return res.status(200).json({
      claim: claims[0],
    });
  } catch (error) {
    console.error("Get claim error:", error);

    return res.status(500).json({
      message: "Unable to retrieve claim.",
    });
  }
};

// Approve a claim
export const approveClaim = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Lock the claim while the administrator reviews it
    const [claims] = await connection.execute(
      `SELECT
         c.id,
         c.report_id,
         c.claimant_id,
         c.status AS claim_status,
         r.title AS item_title,
         r.status AS report_status
       FROM claims c
       JOIN reports r ON c.report_id = r.id
       WHERE c.id = ?
       FOR UPDATE`,
      [req.params.id]
    );

    if (claims.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        message: "Claim not found.",
      });
    }

    const claim = claims[0];

    if (claim.claim_status !== "pending") {
      await connection.rollback();

      return res.status(409).json({
        message: "This claim has already been reviewed.",
      });
    }

    if (claim.report_status !== "active") {
      await connection.rollback();

      return res.status(409).json({
        message: "This item is no longer available for claiming.",
      });
    }

    // Approve the claim
    await connection.execute(
      `UPDATE claims
       SET status = 'approved',
           admin_reason = NULL,
           reviewed_by = ?,
           reviewed_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [req.user.id, claim.id]
    );

    // Mark the associated report as claimed
    await connection.execute(
      `UPDATE reports
       SET status = 'claimed'
       WHERE id = ? AND status = 'active'`,
      [claim.report_id]
    );

    await connection.commit();

    // Notify the student who submitted the claim
    try {
      await createNotification({
        userId: claim.claimant_id,
        title: "Claim Approved",
        message: `Your claim for "${claim.item_title}" has been approved by the administrator.`,
        type: "claim_approved",
        reportId: claim.report_id,
        claimId: claim.id,
      });
    } catch (notificationError) {
      console.error("Claim approval notification error:", notificationError);
    }

    return res.status(200).json({
      message: "Claim approved successfully.",
      claimId: claim.id,
      status: "approved",
    });
  } catch (error) {
    await connection.rollback();

    console.error("Approve claim error:", error);

    return res.status(500).json({
      message: "Unable to approve claim.",
    });
  } finally {
    connection.release();
  }
};

// Reject a claim
export const rejectClaim = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { reason } = req.body;

    if (!reason || typeof reason !== "string" || !reason.trim()) {
      return res.status(400).json({
        message: "Please provide a reason for rejecting this claim.",
      });
    }

    await connection.beginTransaction();

    const [claims] = await connection.execute(
      `SELECT
         c.id,
         c.report_id,
         c.claimant_id,
         c.status AS claim_status,
         r.title AS item_title
       FROM claims c
       JOIN reports r ON c.report_id = r.id
       WHERE c.id = ?
       FOR UPDATE`,
      [req.params.id]
    );

    if (claims.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        message: "Claim not found.",
      });
    }

    const claim = claims[0];

    if (claim.claim_status !== "pending") {
      await connection.rollback();

      return res.status(409).json({
        message: "This claim has already been reviewed.",
      });
    }

    await connection.execute(
      `UPDATE claims
       SET status = 'rejected',
           admin_reason = ?,
           reviewed_by = ?,
           reviewed_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [reason.trim(), req.user.id, claim.id]
    );

    await connection.commit();

    // Notify the student who submitted the claim
    try {
      await createNotification({
        userId: claim.claimant_id,
        title: "Claim Not Approved",
        message: `Your claim for "${claim.item_title}" was not approved. Administrator's reason: ${reason.trim()}`,
        type: "claim_rejected",
        reportId: claim.report_id,
        claimId: claim.id,
      });
    } catch (notificationError) {
      console.error("Claim rejection notification error:", notificationError);
    }

    return res.status(200).json({
      message: "Claim rejected successfully.",
      claimId: claim.id,
      status: "rejected",
    });
  } catch (error) {
    await connection.rollback();

    console.error("Reject claim error:", error);

    return res.status(500).json({
      message: "Unable to reject claim.",
    });
  } finally {
    connection.release();
  }
};
