import { sendSuccess } from "../utils/response.js";
import * as analyticsService from "../services/analytics.service.js";
import { getActivityHistory } from "../services/activity.service.js";
import { getStreak as getUserStreak } from "../services/streak.service.js";

export const getDashboard = async (req, res) => {
  try {
    const data = await analyticsService.getDashboardStats(req.user.id);
    return sendSuccess(res, data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const getActivityHeatmap = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 90;
    const data = await getActivityHistory(req.user.id, days);
    return sendSuccess(res, { activity: data });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const getStreak = async (req, res) => {
  try {
    const data = await getUserStreak(req.user.id);
    return sendSuccess(res, { streak: data });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const getFolderInsights = async (req, res) => {
  try {
    const data = await analyticsService.getFolderInsights(req.user.id);
    return sendSuccess(res, { folders: data });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};