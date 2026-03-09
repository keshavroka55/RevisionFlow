// src/controllers/folder.controller.js
import { sendSuccess } from "../utils/response.js";
import * as folderService from "../services/folder.service.js";

export const createFolder = async (req, res) => {
  try {
    const folder = await folderService.createFolder(req.user.id, req.body);
    return sendSuccess(res, { folder }, "Folder created", 201);
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const getFolders = async (req, res) => {
  try {
    const folders = await folderService.getFolders(req.user.id);
    return sendSuccess(res, { folders, total: folders.length });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const getFolderById = async (req, res) => {
  try {
    const folder = await folderService.getFolderById(req.params.id, req.user.id);
    return sendSuccess(res, { folder });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const updateFolder = async (req, res) => {
  try {
    const folder = await folderService.updateFolder(req.params.id, req.user.id, req.body);
    return sendSuccess(res, { folder }, "Folder updated");
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const deleteFolder = async (req, res) => {
  try {
    const cascade = req.query.cascade !== "false";
    const result = await folderService.deleteFolder(req.params.id, req.user.id, { cascade });
    return sendSuccess(res, result, "Folder deleted");
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const reorderFolders = async (req, res) => {
  try {
    const result = await folderService.reorderFolders(req.user.id, req.body.folders);
    return sendSuccess(res, result, "Folders reordered");
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};