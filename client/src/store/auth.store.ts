import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/auth.types";
import { loginAPI, registerAPI, logoutAPI } from "../services/auth.service";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await registerAPI({ name, email, password });
          set({
            user: res.data.user,
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await loginAPI({ email, password });
          set({
            user: res.data.user,
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        const token = get().accessToken;
        try {
          if (token) await logoutAPI(token);
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",       // key in localStorage
      partialize: (state) => ({   // only persist these fields
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// global state with  zustand. better than prop drilling. (understand the full implementations and logic. )