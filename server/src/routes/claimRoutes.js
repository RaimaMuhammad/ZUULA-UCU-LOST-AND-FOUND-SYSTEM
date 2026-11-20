
import express from "express";

import {
  createClaim,
  getMyClaims,
  getClaimsForMyReport,
} from "../controllers/claimController.js";

import { authenticate, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// All claim routes require an authenticated student
router.use(authenticate, authorize("student"));

// Get claims submitted by the logged-in student
router.get("/my", getMyClaims);

// Get claims submitted for a report owned by the logged-in student
router.get("/report/:reportId", getClaimsForMyReport);

// Submit a claim with an optional evidence photograph
router.post(
  "/",
  upload.single("evidence_image"),
  createClaim
);

export default router;
