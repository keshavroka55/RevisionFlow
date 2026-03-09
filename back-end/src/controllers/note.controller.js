import { sendSuccess } from "../utils/response.js";
import * as noteService from "../services/note.service.js";
import { searchNoteSchema } from "../validators/note.validator.js";

export const createNote = async (req, res) => {
  try {
    const note = await noteService.createNote(req.user.id, req.body);
    return sendSuccess(res, { note }, "Note created", 201);
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const getNotes = async (req, res) => {
  try {
    const query = searchNoteSchema.parse(req.query);
    const result = await noteService.getNotes(req.user.id, query);
    return sendSuccess(res, result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const note = await noteService.getNoteById(req.params.id, req.user.id);
    return sendSuccess(res, { note });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const note = await noteService.updateNote(req.params.id, req.user.id, req.body);
    return sendSuccess(res, { note }, "Note updated");
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const result = await noteService.deleteNote(req.params.id, req.user.id);
    return sendSuccess(res, result, "Note deleted");
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const updateMastery = async (req, res) => {
  try {
    const { mastery } = req.body;
    if (!mastery) return res.status(400).json({ success: false, message: "mastery is required" });
    const note = await noteService.updateMastery(req.params.id, req.user.id, mastery);
    return sendSuccess(res, { note }, "Mastery updated");
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const getUserTags = async (req, res) => {
  try {
    const result = await noteService.getUserTags(req.user.id);
    return sendSuccess(res, result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};