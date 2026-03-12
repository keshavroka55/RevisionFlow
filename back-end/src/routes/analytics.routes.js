import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
    getDashboard,
    getActivityHeatmap,
    getStreak,
    getFolderInsights,
} from "../controllers/analytics.controller.js";

const router = Router();
router.use(authenticate);

router.get("/dashboard", getDashboard);       // GET /api/analytics/dashboard
router.get("/heatmap", getActivityHeatmap); // GET /api/analytics/heatmap?days=90
router.get("/streak", getStreak);          // GET /api/analytics/streak
router.get("/folder-insights", getFolderInsights);  // GET /api/analytics/folder-insights

export default router;