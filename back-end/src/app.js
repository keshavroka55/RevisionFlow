import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config/config.js";
import { errorHandler } from "./middleware/errorHandler.js";
import rateLimit from 'express-rate-limit';

// routes. 
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import folderRoutes from "./routes/folder.routes.js";
import noteRoutes from "./routes/note.routes.js";
import passport from "./config/password.js";
import flashcardRoutes from "./routes/flashcard.routes.js";
import mocktestRoutes from "./routes/mocktest.routes.js";
import revisionRoutes from "./routes/revision.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

//corn 
import { startReminderCron } from "./jobs/reminder.cron.js";


const app = express();


// middleware
app.use(helmet());
app.use(cors({ origin: config.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());  // for jwt token: 

app.use(passport.initialize());

// rate limiting
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use("/api/folders", folderRoutes);
app.use("/api/notes", noteRoutes);

app.use("/api/flashcards", flashcardRoutes);
app.use("/api/mocktests", mocktestRoutes);

app.use("/api/revisions", revisionRoutes);
app.use("/api/analytics", analyticsRoutes);


// health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});


// start cron jobs
startReminderCron();

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

// start cron jobs
startReminderCron();



export default app;
