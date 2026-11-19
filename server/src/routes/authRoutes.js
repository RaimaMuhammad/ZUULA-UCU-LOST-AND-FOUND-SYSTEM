
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

  body("role")
    .optional()
    .isIn(["student", "admin"])
    .withMessage("Role must be student or admin."),

  body("studentNumber").custom((value, { req }) => {
    const role = req.body.role || "student";

    if (role === "student" && (!value || !value.trim())) {
      throw new Error("Student number is required.");
    }

    if (value && value.length > 50) {
      throw new Error("Student number must not exceed 50 characters.");
    }

    return true;
  }),

  body("accessCode")
    .notEmpty()
    .withMessage("Registration access code is required."),
];

const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid email address is required."),

  body("password")
    .notEmpty()
    .withMessage("Password is required."),
];

router.post(
  "/register",
  authLimiter,
  registrationValidation,
  validateRequest,
  register
);

router.post(
  "/login",
  authLimiter,
  loginValidation,
  validateRequest,
  login
);

router.post("/logout", logout);

router.get("/me", authenticate, getCurrentUser);

export default router;
