
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import pool from "../config/db.js";

const COOKIE_NAME = "zuula_token";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const setAuthCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, {
    ...cookieOptions,
    maxAge: 24 * 60 * 60 * 1000,
  });
};

const publicUser = (user) => ({
  id: user.id,
  fullName: user.full_name,
  email: user.email,
  studentNumber: user.student_number,
  role: user.role,
});

// Verify administrator registration code.
const isValidAdminCode = (providedCode) => {
  const actualCode = process.env.ADMIN_ACCESS_CODE;

  if (!actualCode || !providedCode) {
    return false;
  }

  const providedBuffer = Buffer.from(String(providedCode));
  const actualBuffer = Buffer.from(actualCode);

  if (providedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(providedBuffer, actualBuffer);
};

// REGISTRATION
export const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      studentNumber,
      password,
      role,
      adminCode,
    } = req.body;

    if (
      !fullName?.trim() ||
      !email?.trim() ||
      !studentNumber?.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Please complete all required fields.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters.",
      });
    }

    const selectedRole = role || "student";

    if (!["student", "admin"].includes(selectedRole)) {
      return res.status(400).json({
        message: "Invalid account type selected.",
      });
    }

    // Only administrators need the special access code.
    if (selectedRole === "admin") {
      if (!process.env.ADMIN_ACCESS_CODE) {
        console.error("ADMIN_ACCESS_CODE is not configured.");

        return res.status(503).json({
          message: "Administrator registration is currently unavailable.",
        });
      }

      if (!isValidAdminCode(adminCode)) {
        return res.status(403).json({
          message: "Invalid administrator registration code.",
        });
      }
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedStudentNumber = studentNumber.trim();
    const normalizedFullName = fullName.trim();

    // Check for existing email or account number.
    const [existingUsers] = await pool.execute(
      `SELECT id
       FROM users
       WHERE email = ? OR student_number = ?
       LIMIT 1`,
      [normalizedEmail, normalizedStudentNumber]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "An account with these details already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Save the selected account type.
    const [result] = await pool.execute(
      `INSERT INTO users
       (full_name, email, student_number, password_hash, role)
       VALUES (?, ?, ?, ?, ?)`,
      [
        normalizedFullName,
        normalizedEmail,
        normalizedStudentNumber,
        passwordHash,
        selectedRole,
      ]
    );

    const user = {
      id: result.insertId,
      full_name: normalizedFullName,
      email: normalizedEmail,
      student_number: normalizedStudentNumber,
      role: selectedRole,
    };

    const token = createToken(user);
    setAuthCookie(res, token);

    return res.status(201).json({
      message: "Account registered successfully.",
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "An account with these details already exists.",
      });
    }

    return res.status(500).json({
      message: "Unable to register account.",
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter your email and password.",
      });
    }

    const [users] = await pool.execute(
      `SELECT id, full_name, email, student_number,
              password_hash, role
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const user = users[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = createToken(user);
    setAuthCookie(res, token);

    return res.status(200).json({
      message: "Login successful.",
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Unable to log in.",
    });
  }
};

// LOGOUT
export const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);

  return res.status(200).json({
    message: "Logged out successfully.",
  });
};

// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
  try {
    const [users] = await pool.execute(
      `SELECT id, full_name, email, student_number, role
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User account not found.",
      });
    }

    return res.status(200).json({
      user: publicUser(users[0]),
    });
  } catch (error) {
    console.error("Current user error:", error);

    return res.status(500).json({
      message: "Unable to retrieve account details.",
    });
  }
};
