import { create } from "zustand";
import { authService } from "../services/auth.service";
import { User } from "../types/auth.types";

// loadingKeys tracks which operations are currently running
// e.g. { "auth.login": true, "auth.register": false }
interface LoadingState {
  [key: string]: boolean;
}

interface AuthStore {
  // ─── State ───────────────────────────────────────
  user: User | null;
  error: string | null;
  isAppReady: boolean;    // false until /me check completes on startup
  loadingKeys: LoadingState;

  // ─── Actions ─────────────────────────────────────
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (token: string, newPassword: string) => Promise<string>;
  loginWithGoogle: () => void;
  initializeAuth: () => Promise<void>;  // call on app startup
  clearError: () => void;

  // runWithLoading wraps any async function and tracks its loading key
  // usage: runWithLoading("auth.login", async () => { ... })
  runWithLoading: <T>(key: string, fn: () => Promise<T>) => Promise<T>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({

  // ─── Initial State ──────────────────────────────
  user: null,
  error: null,
  isAppReady: false,
  loadingKeys: {},

  // ─── runWithLoading ─────────────────────────────
  // This is the core utility your components use.
  // It sets the loading key to true, runs the function, then sets it back to false.
  // Components call useAuthLoading("auth.login") to read this.
  runWithLoading: async <T>(key: string, fn: () => Promise<T>): Promise<T> => {
    // Turn loading ON for this key
    set((state) => ({
      loadingKeys: { ...state.loadingKeys, [key]: true },
    }));

    try {
      return await fn(); // run the actual async function
    } finally {
      // Always turn loading OFF — whether success or error
      set((state) => ({
        loadingKeys: { ...state.loadingKeys, [key]: false },
      }));
    }
  },

  // ─── initializeAuth ────────────────────────────
  // Called ONCE when app starts (in main.tsx or App.tsx)
  // Checks if user is already logged in via saved token
  initializeAuth: async () => {
    try {
      const user = await authService.getMe(); // GET /api/auth/me
      set({ user });
    } catch {
      // Token missing or expired — user stays null (not logged in)
      set({ user: null });
    } finally {
      set({ isAppReady: true }); // app is ready to render regardless
    }
  },

  // ─── login ────────────────────────────────────
  login: async (email, password) => {
    set({ error: null });
    try {
      const { user } = await authService.login({ email, password });
      set({ user });
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed";
      set({ error: message });
      throw err; // re-throw so component's catch block runs
    }
  },

  // ─── register ─────────────────────────────────
  register: async (name, email, password) => {
    set({ error: null });
    try {
      await authService.register({ name, email, password });
      // After register, log them in automatically
      const { user } = await authService.login({ email, password });
      set({ user });
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed";
      set({ error: message });
      throw err;
    }
  },

  // ─── logout ───────────────────────────────────
  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // Even if backend call fails, always clear client state
    } finally {
      set({ user: null, error: null });
    }
  },

  // ─── forgotPassword ───────────────────────────
  // Returns the message string so component can display it
  forgotPassword: async (email) => {
    set({ error: null });
    try {
      const response = await authService.forgotPassword(email);
      return response.message;
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong";
      set({ error: message });
      throw err;
    }
  },

  // ─── resetPassword ────────────────────────────
  resetPassword: async (token, newPassword) => {
    set({ error: null });
    try {
      const response = await authService.resetPassword({ token, newPassword });
      return response.message;
    } catch (err: any) {
      const message = err.response?.data?.message || "Reset failed";
      set({ error: message });
      throw err;
    }
  },

  // ─── loginWithGoogle ──────────────────────────
  // Not async — just redirects browser to backend Google OAuth route
  loginWithGoogle: () => {
    set({ error: null });
    try {
      authService.loginWithGoogle();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // ─── clearError ───────────────────────────────
  clearError: () => set({ error: null }),
}));

// ─── Selector Hook ──────────────────────────────────
// This is what your components call: useAuthLoading("auth.login")
// Returns true/false for that specific operation key
export const useAuthLoading = (key: string): boolean => {
  return useAuthStore((state) => state.loadingKeys[key] ?? false);
};