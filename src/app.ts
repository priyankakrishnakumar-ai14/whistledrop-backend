
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";import express from "express";
import helmet from "helmet";
import cors from "cors";

import reportRoutes from "./routes/report.routes";
import trackingRoutes from "./routes/tracking.routes";
import authRoutes from "./routes/auth.routes";
import moderatorReportRoutes from "./routes/moderator-report.routes";

import { errorHandler } from "./middleware/error.middleware";

import {
  publicRateLimiter,
  authRateLimiter,
} from "./middleware/rate-limit.middleware";

const app = express();

app.use(helmet());
app.use(express.json({ limit: "100kb" }));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "100kb" }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/reports", publicRateLimiter, reportRoutes);

app.use("/api/track", publicRateLimiter, trackingRoutes);

app.use("/api/auth", authRateLimiter, authRoutes);

app.use(
  "/api/moderator/reports",
  publicRateLimiter,
  moderatorReportRoutes
);

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "WhistleDrop backend is running",
  });
});

app.use(errorHandler);

export default app;