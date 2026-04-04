import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

import routes from "./routes";
import errorHandler from "./middlewares/errorHandler";

dotenv.config();

// ── Validate required env vars before anything else ──
const REQUIRED_ENV = ["JWT_SECRET", "MONGO_URI", "USDA_API_KEY"];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(
    `FATAL: Missing required environment variables: ${missing.join(", ")}`,
  );
  process.exit(1);
}

const app = express();

// ── Security headers ──
app.use(helmet());

app.use(cors());
// ── Rate limiting ──
// Strict limit on auth routes to prevent brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: "Too many attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API limit — generous but stops abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { message: "Too many requests. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/v1/auth", authLimiter);
app.use("/api/v1", apiLimiter);

// ── Body parsing ──
app.use(express.json({ limit: "10kb" })); // Reject suspiciously large payloads

// ── NoSQL injection sanitization ──
// app.use(mongoSanitize());

// ── Logging (disable in test environments) ──
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// ── Static files ──
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ── API docs ──
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../src/api-docs.html"));
});

// ── Routes ──
app.use("/api/v1", routes);

// ── Error handler (must be last) ──
app.use(errorHandler);

export default app;
