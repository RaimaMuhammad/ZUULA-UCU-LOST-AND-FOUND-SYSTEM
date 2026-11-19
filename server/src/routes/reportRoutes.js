
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

// Authenticated students: submit a report
router.post(
  "/",
  authenticate,
  authorize("student"),
  createReport
);

// Authenticated students: update their own report
router.put(
  "/:id",
  authenticate,
  authorize("student"),
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
