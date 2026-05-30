import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectGoruDB from "./src/config/goruDB.js";
import goruAuthRoutes from "./src/routes/goruAuthRoutes.js";
import goruCowRoutes from "./src/routes/goruCowRoutes.js";
import goruUploadRoutes from "./src/routes/goruUploadRoutes.js";
import goruOrderRoutes from "./src/routes/goruOrderRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

// Root Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🐄 E-Goru API is live!",
  });
});

// Health Check Route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "🐄 E-Goru server is running!",
    timestamp: new Date().toISOString(),
  });
});

// Project Info Route
app.get("/api/goru-info", (req, res) => {
  res.json({
    success: true,
    project: "E-Goru",
    version: "1.0.0",
    description:
      "A modern cattle marketplace for Eid-ul-Adha — buy and sell cows online.",
  });
});

// API Routes
app.use("/api/auth", goruAuthRoutes);
app.use("/api/cows", goruCowRoutes);
app.use("/api/upload", goruUploadRoutes);
app.use("/api/orders", goruOrderRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start Server
const startGoruServer = async () => {
  try {
    await connectGoruDB();

    app.listen(PORT, () => {
      console.log(`🚀 Goru server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startGoruServer();
