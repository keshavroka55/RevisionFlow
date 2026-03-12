import api from "../api/axiosInstance";

export const getTodayRevisionsAPI = () =>
  api.get("/revisions/today");

export const getUpcomingRevisionsAPI = () =>
  api.get("/revisions/upcoming");

export const completeRevisionAPI = (id: string) =>
  api.patch(`/revisions/${id}/complete`);

export const skipRevisionAPI = (id: string) =>
  api.patch(`/revisions/${id}/skip`);

export const updateRevisionTimeAPI = (hour: number, minute: number) =>
  api.patch("/revisions/time", { hour, minute });