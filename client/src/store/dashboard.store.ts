import { create } from "zustand";
import type { DashboardData, TodayRevision } from "../types/analytics.types";
import { getDashboardAPI } from "../services/analytics.service";
import { getTodayRevisionsAPI, completeRevisionAPI, skipRevisionAPI } from "../services/revision.service";

type DashboardState = {
  dashboard: DashboardData | null;
  todayRevisions: { session1: { schedules: TodayRevision[] }; session2: { schedules: TodayRevision[] }; total: number } | null;
  isLoading: boolean;
  error: string | null;

  fetchDashboard: () => Promise<void>;
  fetchTodayRevisions: () => Promise<void>;
  completeRevision: (id: string) => Promise<void>;
  skipRevision: (id: string) => Promise<void>;
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  dashboard: null,
  todayRevisions: null,
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await getDashboardAPI();
      set({ dashboard: res.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchTodayRevisions: async () => {
    try {
      const today = await getTodayRevisionsAPI();
      const normalize = (items: any[]): TodayRevision[] =>
        items.map((r) => ({
          id: r.id,
          stage: r.stage,
          status: r.status,
          scheduledAt: r.scheduledAt,
          sessionSlot: r.sessionSlot,
          sessionOrder: r.sessionOrder,
          note: {
            id: r.note?.id ?? "",
            title: r.note?.title ?? "Untitled",
            mastery: r.note?.mastery ?? "NEW",
            folder: {
              name: r.note?.folder?.name ?? "Unknown",
              color: r.note?.folder?.color ?? "#4F46E5",
            },
          },
        }));

      set({
        todayRevisions: {
          total: today.total ?? 0,
          session1: { schedules: normalize(today.session1?.schedules ?? []) },
          session2: { schedules: normalize(today.session2?.schedules ?? []) },
        },
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message });
    }
  },

  completeRevision: async (id) => {
    await completeRevisionAPI(id);
    // remove from today's list
    const current = get().todayRevisions;
    if (!current) return;
    const filter = (s: TodayRevision[]) => s.filter((r) => r.id !== id);
    set({
      todayRevisions: {
        ...current,
        session1: { schedules: filter(current.session1.schedules) },
        session2: { schedules: filter(current.session2.schedules) },
        total: current.total - 1,
      },
    });
  },

  skipRevision: async (id) => {
    await skipRevisionAPI(id);
    const current = get().todayRevisions;
    if (!current) return;
    const filter = (s: TodayRevision[]) => s.filter((r) => r.id !== id);
    set({
      todayRevisions: {
        ...current,
        session1: { schedules: filter(current.session1.schedules) },
        session2: { schedules: filter(current.session2.schedules) },
        total: current.total - 1,
      },
    });
  },
}));