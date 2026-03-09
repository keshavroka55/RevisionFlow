import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createNoteSchema, updateNoteSchema } from "../validators/note.validator.js";
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  updateMastery,
  getUserTags,
} from "../controllers/note.controller.js";

const router = Router();

router.use(authenticate);

router.get("/tags", getUserTags);                                         // GET    /api/notes/tags
router.get("/", getNotes);                                                // GET    /api/notes?q=&folderId=&tags=&page=&limit=
router.post("/", validate(createNoteSchema), createNote);                 // POST   /api/notes
router.get("/:id", getNoteById);                                          // GET    /api/notes/:id
router.patch("/:id", validate(updateNoteSchema), updateNote);             // PATCH  /api/notes/:id
router.delete("/:id", deleteNote);                                        // DELETE /api/notes/:id
router.patch("/:id/mastery", updateMastery);                              // PATCH  /api/notes/:id/mastery

export default router;