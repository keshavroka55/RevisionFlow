import { create } from "zustand";
import { userService } from "../services/user.service";
import {
  UserProfile,
  UpdateProfileInput,
  UpdatedProfile,
  UpdateNotificationPreferencesInput,
  UserNotificationPreferences,
} from "../types/user.types";

interface LoadingState {
  [key: string]: boolean;
}

interface UserStore {
  // ─── State ───────────────────────────────────
  profile: UserProfile | null;
  error: string | null;
  loadingKeys: LoadingState;

  // ─── Actions ─────────────────────────────────
  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileInput) => Promise<UpdatedProfile>;
  updateNotificationPreferences: (
    data: UpdateNotificationPreferencesInput
  ) => Promise<UserNotificationPreferences>;
  clearError: () => void;
  runWithLoading: <T>(key: string, fn: () => Promise<T>) => Promise<T>;
}

export const useUserStore = create<UserStore>((set, get) => ({

  // ─── Initial State ────────────────────────────
  profile: null,
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

  // ─── fetchProfile ─────────────────────────────
  // GET /api/users/me
  fetchProfile: async () => {
    set({ error: null });
    try {
      await get().runWithLoading("user.fetchProfile", async () => {
        const profile = await userService.getMyProfile();
        set({
          profile: {
            ...profile,
            folders: profile.folders ?? [],
            notes: profile.notes ?? [],
          },
        });
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to load profile" });
    }
  },

  // ─── updateProfile ────────────────────────────
  // PUT /api/users/me
  updateProfile: async (data) => {
    set({ error: null });
    try {
      return await get().runWithLoading("user.updateProfile", async () => {
        const updated = await userService.updateMyProfile(data);
        // Merge only the fields the backend returns into the existing profile
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                name: updated.name,
                avatarUrl: updated.avatarUrl,
                timezone: updated.timezone,
                updatedAt: updated.updatedAt,
              }
            : state.profile,
        }));
        return updated;
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to update profile" });
      throw err;
    }
  },

  updateNotificationPreferences: async (data) => {
    set({ error: null });
    try {
      return await get().runWithLoading("user.updateNotificationPreferences", async () => {
        const prefs = await userService.updateMyNotificationPreferences(data);
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                notificationPrefs: prefs,
              }
            : state.profile,
        }));
        return prefs;
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to update notification preferences" });
      throw err;
    }
  },

  // ─── clearError ───────────────────────────────
  clearError: () => set({ error: null }),
}));

// ─── Selector hook ────────────────────────────────
export const useUserLoading = (key: string): boolean => {
  return useUserStore((state) => state.loadingKeys[key] ?? false);
};
