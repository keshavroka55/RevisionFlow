import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  generateFlashcards, getFlashcards,
  createFlashcard, updateFlashcard, deleteFlashcard, submitFlashcardSession
} from "../controllers/flashcard.controller.js";

const router = Router();
router.use(authenticate);

router.post("/generate/:noteId", generateFlashcards);   // POST /api/flashcards/generate/:noteId
router.get("/:noteId", getFlashcards);                  // GET  /api/flashcards/:noteId
router.post("/:noteId", createFlashcard);               // POST /api/flashcards/:noteId
router.post("/:noteId/session", submitFlashcardSession); // POST /api/flashcards/:noteId/session
router.patch("/:cardId", updateFlashcard);              // PATCH /api/flashcards/:cardId
router.delete("/:cardId", deleteFlashcard);             // DELETE /api/flashcards/:cardId

export default router;