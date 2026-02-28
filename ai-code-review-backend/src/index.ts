import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { requestLogger } from "./utils/logger";
import { testConnection } from "./config/db";
import authRoutes from "./routes/authRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import logger from "./utils/logger";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5175",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(helmet());
app.use(express.json({ limit: "2mb" })); // code can be large
app.use(requestLogger);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (_, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/", (_, res) => {
  res.json({ message: "AI Code Review API is running 🚀" });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    logger.error("Unhandled error", { error: err.message, stack: err.stack });
    res.status(500).json({ message: "Internal server error" });
  },
);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const dbConnected = await testConnection();
  if (!dbConnected) {
    logger.error("Failed to connect to database. Exiting...");
    process.exit(1);
  }

  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`📖 API docs: http://localhost:${PORT}/api`);
  });
};

startServer();
