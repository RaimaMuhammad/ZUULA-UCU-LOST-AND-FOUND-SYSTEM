
import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import claimRoutes from "./routes/claimRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { testDatabaseConnection } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

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

// Serve uploaded photographs from server/uploads
const uploadDirectory = path.resolve(__dirname, "../uploads");

app.use("/uploads", express.static(uploadDirectory));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

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

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`ZUULA server running on port ${PORT}`);
      console.log(`Serving uploaded images from: ${uploadDirectory}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
