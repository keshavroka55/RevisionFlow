import { sendSuccess } from "../utils/response.js";
import * as flashcardService from "../services/flashcard.service.js";

export const generateFlashcards = async (req, res) => {
  try {
    const cards = await flashcardService.generateFlashcards(req.params.noteId, req.user.id);
    return sendSuccess(res, { flashcards: cards }, "Flashcards generated", 201);
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const getFlashcards = async (req, res) => {
  try {
    const cards = await flashcardService.getFlashcards(req.params.noteId, req.user.id);
    return sendSuccess(res, { flashcards: cards, total: cards.length });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const createFlashcard = async (req, res) => {
  try {
    const card = await flashcardService.createFlashcard(req.params.noteId, req.user.id, req.body);
    return sendSuccess(res, { flashcard: card }, "Flashcard created", 201);
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const updateFlashcard = async (req, res) => {
  try {
    const card = await flashcardService.updateFlashcard(req.params.cardId, req.user.id, req.body);
    return sendSuccess(res, { flashcard: card }, "Flashcard updated");
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const deleteFlashcard = async (req, res) => {
  try {
    const result = await flashcardService.deleteFlashcard(req.params.cardId, req.user.id);
    return sendSuccess(res, result, "Flashcard deleted");
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const submitFlashcardSession = async (req, res) => {
  try {
    const { easyCount, okayCount, hardCount } = req.body;
    const session = await flashcardService.submitFlashcardSession(
      req.params.noteId,
      req.user.id,
      { easyCount: easyCount ?? 0, okayCount: okayCount ?? 0, hardCount: hardCount ?? 0 }
    );
    return sendSuccess(res, { session }, "Session saved");
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};