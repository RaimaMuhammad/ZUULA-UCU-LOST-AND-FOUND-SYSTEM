
import express from "express";

import {
  createReport,
  getAllReports,
  getReportById,
  getMyReports,
  updateReport,
  closeReport,
} from "../controllers/reportController.js";

import { authenticate, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Public: view active reports
router.get("/", getAllReports);

// Authenticated students: view their own reports
router.get(
  "/my",
  authenticate,
  authorize("student"),
  getMyReports
);

// Authenticated students: submit a report with an optional photograph
router.post(
  "/",
  authenticate,
  authorize("student"),
  upload.single("image"),
  createReport
);

// Authenticated students: update their own report and optional photograph
router.put(
  "/:id",
  authenticate,
  authorize("student"),
  upload.single("image"),
  updateReport
);

// Authenticated students: close their own report
router.patch(
  "/:id/close",
  authenticate,
  authorize("student"),
  closeReport
);

// View an individual report
router.get("/:id", getReportById);

export default router;
