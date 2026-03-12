import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  generateMockTest, getMockTests,
  getMockTestById, submitMockTest, deleteMockTest,
} from "../controllers/mocktest.controller.js";

const router = Router();
router.use(authenticate);

router.post("/generate/:noteId", generateMockTest);     // POST /api/mocktests/generate/:noteId
router.get("/:noteId", getMockTests);                   // GET  /api/mocktests/:noteId
router.get("/test/:testId", getMockTestById);           // GET  /api/mocktests/test/:testId
router.post("/test/:testId/submit", submitMockTest);    // POST /api/mocktests/test/:testId/submit
router.delete("/test/:testId", deleteMockTest);         // DELETE /api/mocktests/test/:testId

export default router;