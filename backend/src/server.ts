import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler } from "./errors/errorHandler";
import { authRouter } from "./routes/auth.routes";
import { leadRouter } from "./routes/lead.routes";

export const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(hpp());
app.use(compression());

const allowedOrigins = env.CORS_ORIGIN.split(",").map((origin) =>
  origin.trim(),
);
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/v1/auth", authRouter);
app.use("/v1/leads", leadRouter);

// Catch-all handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.use(errorHandler);
