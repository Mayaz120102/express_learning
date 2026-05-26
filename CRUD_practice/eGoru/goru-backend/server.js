import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectGoruDB from "./src/config/goruDB.js";
import goruAuthRoutes from "./src/routes/goruAuthRoutes.js";
import goruCowRoutes from "./src/routes/goruCowRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", goruAuthRoutes);
app.use("/api/cows", goruCowRoutes);

//test
app.get("/api/heath", (req, res) => {
  res.json({
    success: true,
    message: "🐄 E-Goru server is running!",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/goru-info", (req, res) => {
  res.json({
    success: true,
    project: "E-Goru",
    version: "1.0.0",
    description:
      "A modern cattle marketplace for Eid-ul-Adha — buy and sell cows online.",
  });
});

//start server
const startGoruServer = async () => {
  await connectGoruDB();

  app.listen(PORT, () => {
    console.log(`🚀 Goru server running on http://localhost:${PORT}`);
  });
};

startGoruServer();
