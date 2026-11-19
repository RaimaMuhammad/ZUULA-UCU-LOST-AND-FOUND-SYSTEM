
import express from "express";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";

import {
  register,
  login,
  logout,
  getCurrentUser,
} from "../controllers/authController.js";

import { authenticate } from "../middleware/auth.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many authentication attempts. Please try again later.",
  },
});

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Please check the information you submitted.",
      errors: errors.array().map((error) => error.msg),
    });
  }

  next();
};

// Registration validation
const registrationValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required.")
    .isLength({ max: 150 })
    .withMessage("Full name must not exceed 150 characters."),

  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid email address is required.")
    .isLength({ max: 150 })
    .withMessage("Email must not exceed 150 characters."),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must contain at least 8 characters."),

  body("studentNumber")
    .trim()
    .notEmpty()
    .withMessage("Student number is required.")
    .isLength({ max: 50 })
    .withMessage("Student number must not exceed 50 characters."),
];

// Login validation
const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid email address is required."),

  body("password")
    .notEmpty()
    .withMessage("Password is required."),
];

// Register student
router.post(
  "/register",
  authLimiter,
  registrationValidation,
  validateRequest,
  register
);

// Login
router.post(
  "/login",
  authLimiter,
  loginValidation,
  validateRequest,
  login
);

// Logout
router.post("/logout", logout);

// Get currently authenticated user
router.get("/me", authenticate, getCurrentUser);

export default router;
