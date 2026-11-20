
import pool from "../config/db.js";
import { createNotification } from "./notificationController.js";

// GET ALL CLAIMS FOR ADMINISTRATOR REVIEW
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


// GET ONE CLAIM FOR ADMINISTRATOR REVIEW
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
         r.incident_date AS date_found,
         r.private_details,
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


// APPROVE CLAIM AND SEND ITEM COLLECTION INSTRUCTIONS
export const approveClaim = async (req, res) => {
  const {
    collectionLocation,
    collectionDate,
    collectionTime,
    collectionInstructions,
  } = req.body || {};

  // Validate required collection location
  if (
    !collectionLocation ||
    typeof collectionLocation !== "string" ||
    !collectionLocation.trim()
  ) {
    return res.status(400).json({
      message: "Please provide the item collection location.",
    });
  }

  // Validate optional collection details
  if (
    (collectionDate && typeof collectionDate !== "string") ||
    (collectionTime && typeof collectionTime !== "string") ||
    (collectionInstructions &&
      typeof collectionInstructions !== "string")
  ) {
    return res.status(400).json({
      message: "Invalid collection instructions provided.",
    });
  }

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

    // Update claim status
    await connection.execute(
      `UPDATE claims
       SET status = 'approved',
           admin_reason = NULL,
           reviewed_by = ?,
           reviewed_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [req.user.id, claim.id]
    );

    // Mark associated report as claimed
    await connection.execute(
      `UPDATE reports
       SET status = 'claimed'
       WHERE id = ? AND status = 'active'`,
      [claim.report_id]
    );

    await connection.commit();

    // Build the collection notification
    const messageParts = [
      `Your claim for "${claim.item_title}" has been approved.`,
      "",
      `Collection Location: ${collectionLocation.trim()}`,
    ];

    if (collectionDate) {
      messageParts.push(`Collection Date: ${collectionDate}`);
    }

    if (collectionTime) {
      messageParts.push(`Collection Time: ${collectionTime}`);
    }

    if (
      collectionInstructions &&
      collectionInstructions.trim()
    ) {
      messageParts.push(
        `Additional Instructions: ${collectionInstructions.trim()}`
      );
    }

    messageParts.push(
      "",
      "Please follow the collection instructions when picking up your item."
    );

    // Send notification to the student
    try {
      await createNotification({
        userId: claim.claimant_id,
        title: "Claim Approved - Item Ready for Collection",
        message: messageParts.join("\n"),
        type: "item_ready",
        reportId: claim.report_id,
        claimId: claim.id,
      });

    } catch (notificationError) {
      console.error(
        "Item collection notification error:",
        notificationError
      );
    }

    return res.status(200).json({
      message:
        "Claim approved successfully. Collection instructions have been sent to the student.",
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


// REJECT CLAIM
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

    // Notify the student about the rejected claim
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
      console.error(
        "Claim rejection notification error:",
        notificationError
      );
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
