// src/routes/revision.routes.js
import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  getRevisionSchedules,
  getTodayRevisions,
  getUpcomingRevisions,
  completeRevision,
  skipRevision,
  updateRevisionTime,
} from "../controllers/revision.controller.js";

const router = Router();
router.use(authenticate);

router.get("/", getRevisionSchedules);              // GET   /api/revisions?status=PENDING
router.get("/today", getTodayRevisions);             // GET   /api/revisions/today
router.get("/upcoming", getUpcomingRevisions);       // GET   /api/revisions/upcoming
router.patch("/time", updateRevisionTime);           // PATCH /api/revisions/time
router.patch("/:id/complete", completeRevision);     // PATCH /api/revisions/:id/complete
router.patch("/:id/skip", skipRevision);             // PATCH /api/revisions/:id/skip

export default router;