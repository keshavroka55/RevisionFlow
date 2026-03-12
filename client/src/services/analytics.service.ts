import api from "../api/axiosInstance";

export const getDashboardAPI = () =>
  api.get("/analytics/dashboard");

export const getActivityHeatmapAPI = (days = 90) =>
  api.get("/analytics/heatmap", { params: { days } });

export const getStreakAPI = () =>
  api.get("/analytics/streak");

export const getFolderInsightsAPI = () =>
  api.get("/analytics/folder-insights");