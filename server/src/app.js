import express from "express";
import cors from "cors";
import { json, urlencoded } from "express";
import multer from "multer";
import hrRoutes from "./routes/hr.routes.js";
import authRoutes from "./routes/auth.routes.js";
import educationRoutes from "./routes/education.routes.js";
import candidateRoutes from "./routes/candidate.routes.js";
import documentsRouter from "./routes/document.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import keyRoutes from './routes/keys.js';

const app = express();

// ===== Core Middleware =====
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// ===== Request Logger =====
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.path}`);
  next();
});

// ===== Routes =====
console.log("📡 Registering API routes");

app.use("/api/hr", hrRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/documents", documentsRouter);
app.use("/api/chat", chatRoutes);
app.use('/api/keys' ,keyRoutes);
// ===== Health Check =====
app.get("/", (req, res) => {
  res.json({ ok: true, message: "BGV Platform API" });
});

// ===== 404 Handler =====
app.use((req, res) => {
  console.log(`❌ 404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({
    message: "Not found",
    path: req.path
  });
});
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("📛 Multer error:", err.message);
    return res.status(400).json({ message: err.message });
  }
  next(err);
});
// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error("🔥 Unhandled error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
