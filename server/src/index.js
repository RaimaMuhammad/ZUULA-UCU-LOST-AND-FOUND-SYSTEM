
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import { testDatabaseConnection } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Request parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "ZUULA Campus Lost and Found API is running.",
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "ZUULA API is operational.",
  });
});

// Start server
const startServer = async () => {
  try {
    await testDatabaseConnection();

    app.listen(PORT, () => {
      console.log(`ZUULA server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
