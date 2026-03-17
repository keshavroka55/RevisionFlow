import api from "../api/axiosInstance";
import {
  RevisionSchedule,
  RevisionQueryParams,
  UpdateRevisionTimeInput,
  TodayRevisionsResponse,
} from "../types/revision.types";

export const revisionService = {

  // GET /api/revisions?status=PENDING
  getAll: async (params?: RevisionQueryParams): Promise<RevisionSchedule[]> => {
    const response = await api.get("/revisions", { params });
    return response.data.schedules ?? [];
  },

  // GET /api/revisions/today
  getToday: async (): Promise<TodayRevisionsResponse> => {
    const response = await api.get("/revisions/today");
    return response.data;
  },

  // GET /api/revisions/upcoming
  getUpcoming: async (): Promise<RevisionSchedule[]> => {
    const response = await api.get("/revisions/upcoming");
    const grouped = response.data?.upcoming ?? {};
    return Object.values(grouped).flat() as RevisionSchedule[];
  },

  // PATCH /api/revisions/:id/complete
  complete: async (id: string): Promise<RevisionSchedule> => {
    const response = await api.patch(`/revisions/${id}/complete`);
    return response.data.schedule ?? response.data;
  },

  // PATCH /api/revisions/:id/skip
  skip: async (id: string): Promise<RevisionSchedule> => {
    const response = await api.patch(`/revisions/${id}/skip`);
    return response.data.schedule ?? response.data;
  },

  // PATCH /api/revisions/time
  updateTime: async (data: UpdateRevisionTimeInput): Promise<void> => {
    await api.patch("/revisions/time", data);
  },
};

// Backward-compatible named exports used by some stores/pages
export const getTodayRevisionsAPI = () => revisionService.getToday();
export const getUpcomingRevisionsAPI = () => revisionService.getUpcoming();
export const completeRevisionAPI = (id: string) => revisionService.complete(id);
export const skipRevisionAPI = (id: string) => revisionService.skip(id);
export const updateRevisionTimeAPI = (hour: number, minute: number) =>
  revisionService.updateTime({ hour, minute });