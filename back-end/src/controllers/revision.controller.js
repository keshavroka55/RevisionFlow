// src/controllers/revision.controller.js
import { sendSuccess } from "../utils/response.js";
import * as revisionService from "../services/revision.service.js";

export const getRevisionSchedules = async (req, res) => {
  try {
    const schedules = await revisionService.getRevisionSchedules(req.user.id, req.query);
    return sendSuccess(res, { schedules, total: schedules.length });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const getTodayRevisions = async (req, res) => {
  try {
    const result = await revisionService.getTodayRevisions(req.user.id);
    return sendSuccess(res, result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const getUpcomingRevisions = async (req, res) => {
  try {
    const result = await revisionService.getUpcomingRevisions(req.user.id);
    return sendSuccess(res, { upcoming: result });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const completeRevision = async (req, res) => {
  try {
    const schedule = await revisionService.completeRevision(req.params.id, req.user.id);
    return sendSuccess(res, { schedule }, "Revision completed");
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const skipRevision = async (req, res) => {
  try {
    const schedule = await revisionService.skipRevision(req.params.id, req.user.id);
    return sendSuccess(res, { schedule }, "Revision skipped");
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const updateRevisionTime = async (req, res) => {
  try {
    const { hour, minute } = req.body;

    if (hour === undefined || hour < 0 || hour > 23) {
      return res.status(400).json({ success: false, message: "hour must be 0-23" });
    }
    if (minute !== undefined && minute !== 0 && minute !== 30) {
      return res.status(400).json({ success: false, message: "minute must be 0 or 30" });
    }

    const result = await revisionService.updateRevisionTime(req.user.id, hour, minute ?? 0);
    return sendSuccess(res, result, "Revision time updated");
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};