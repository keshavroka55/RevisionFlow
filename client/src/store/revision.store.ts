import { create } from "zustand";
import { revisionService } from "../services/revision.service";
import {
  RevisionSchedule,
  RevisionQueryParams,
  UpdateRevisionTimeInput,
} from "../types/revision.types";

interface LoadingState {
  [key: string]: boolean;
}

interface RevisionStore {
  // ─── State ───────────────────────────────────
  revisions: RevisionSchedule[];
  todayRevisions: RevisionSchedule[];
  upcomingRevisions: RevisionSchedule[];
  error: string | null;
  loadingKeys: LoadingState;

  // ─── Actions ─────────────────────────────────
  fetchRevisions: (params?: RevisionQueryParams) => Promise<void>;
  fetchTodayRevisions: () => Promise<void>;
  fetchUpcomingRevisions: () => Promise<void>;
  completeRevision: (id: string) => Promise<void>;
  skipRevision: (id: string) => Promise<void>;
  updateRevisionTime: (data: UpdateRevisionTimeInput) => Promise<void>;
  clearError: () => void;
  runWithLoading: <T>(key: string, fn: () => Promise<T>) => Promise<T>;
}

export const useRevisionStore = create<RevisionStore>((set, get) => ({

  // ─── Initial State ────────────────────────────
  revisions: [],
  todayRevisions: [],
  upcomingRevisions: [],
  error: null,
  loadingKeys: {},

  // ─── runWithLoading ───────────────────────────
  runWithLoading: async <T>(key: string, fn: () => Promise<T>): Promise<T> => {
    set((state) => ({
      loadingKeys: { ...state.loadingKeys, [key]: true },
    }));
    try {
      return await fn();
    } finally {
      set((state) => ({
        loadingKeys: { ...state.loadingKeys, [key]: false },
      }));
    }
  },

  // ─── fetchRevisions ───────────────────────────
  fetchRevisions: async (params) => {
    set({ error: null });
    try {
      await get().runWithLoading("revision.fetchAll", async () => {
        const revisions = await revisionService.getAll(params);
        set({ revisions });
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to load revisions" });
    }
  },

  // ─── fetchTodayRevisions ──────────────────────
  // Used on Dashboard to show "X revisions due today"
  fetchTodayRevisions: async () => {
    set({ error: null });
    try {
      await get().runWithLoading("revision.fetchToday", async () => {
        const today = await revisionService.getToday();
        const todayRevisions = [
          ...(today.session1?.schedules ?? []),
          ...(today.session2?.schedules ?? []),
        ];
        set({ todayRevisions });
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to load today's revisions" });
    }
  },

  // ─── fetchUpcomingRevisions ───────────────────
  fetchUpcomingRevisions: async () => {
    set({ error: null });
    try {
      await get().runWithLoading("revision.fetchUpcoming", async () => {
        const upcomingRevisions = await revisionService.getUpcoming();
        set({ upcomingRevisions });
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to load upcoming revisions" });
    }
  },

  // ─── completeRevision ────────────────────────
  // Called when user finishes a revision session
  // Removes from todayRevisions list immediately (optimistic update)
  completeRevision: async (id) => {
    set({ error: null });
    try {
      await get().runWithLoading("revision.complete", async () => {
        const updated = await revisionService.complete(id);

        set((state) => ({
          // Update status in main list
          revisions: state.revisions.map((r) =>
            r.id === id ? updated : r
          ),
          // Remove from today's list — it's done
          todayRevisions: state.todayRevisions.filter((r) => r.id !== id),
        }));
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to complete revision" });
      throw err;
    }
  },

  // ─── skipRevision ────────────────────────────
  skipRevision: async (id) => {
    set({ error: null });
    try {
      await get().runWithLoading("revision.skip", async () => {
        const updated = await revisionService.skip(id);

        set((state) => ({
          revisions: state.revisions.map((r) =>
            r.id === id ? updated : r
          ),
          // Remove from today's list — skipped for today
          todayRevisions: state.todayRevisions.filter((r) => r.id !== id),
        }));
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to skip revision" });
      throw err;
    }
  },

  // ─── updateRevisionTime ───────────────────────
  // User sets their preferred daily reminder time
  updateRevisionTime: async (data) => {
    set({ error: null });
    try {
      await get().runWithLoading("revision.updateTime", async () => {
        await revisionService.updateTime(data);
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to update revision time" });
      throw err;
    }
  },

  // ─── clearError ───────────────────────────────
  clearError: () => set({ error: null }),
}));

// Selector hook — same pattern as useFolderLoading, useNoteLoading
export const useRevisionLoading = (key: string): boolean => {
  return useRevisionStore((state) => state.loadingKeys[key] ?? false);
};