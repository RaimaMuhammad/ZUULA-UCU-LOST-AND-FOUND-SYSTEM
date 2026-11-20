
import express from "express";

import {
  getAllClaims,
  getClaimById,
  approveClaim,
  rejectClaim,
} from "../controllers/adminController.js";

import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate, authorize("admin"));

router.get("/claims", getAllClaims);
router.get("/claims/:id", getClaimById);
router.patch("/claims/:id/approve", approveClaim);
router.patch("/claims/:id/reject", rejectClaim);

export default router;
