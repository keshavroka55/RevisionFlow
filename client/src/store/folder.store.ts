import { create } from "zustand";
import { folderService } from "../services/folder.service";
import {
  Folder,
  CreateFolderInput,
  UpdateFolderInput,
  ReorderFoldersInput,
} from "../types/folder.types";

interface LoadingState {
  [key: string]: boolean;
}

interface FolderStore {
  // ─── State ───────────────────────────────────
  folders: Folder[];
  selectedFolder: Folder | null;
  error: string | null;
  loadingKeys: LoadingState;

  // ─── Actions ─────────────────────────────────
  fetchFolders: () => Promise<void>;
  fetchFolderById: (id: string) => Promise<void>;
  createFolder: (data: CreateFolderInput) => Promise<void>;
  updateFolder: (id: string, data: UpdateFolderInput) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  reorderFolders: (data: ReorderFoldersInput) => Promise<void>;
  setSelectedFolder: (folder: Folder | null) => void;
  clearError: () => void;
  runWithLoading: <T>(key: string, fn: () => Promise<T>) => Promise<T>;
}

export const useFolderStore = create<FolderStore>((set, get) => ({

  // ─── Initial State ────────────────────────────
  folders: [],
  selectedFolder: null,
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

  // ─── fetchFolders ─────────────────────────────
  fetchFolders: async () => {
    set({ error: null });
    try {
      await get().runWithLoading("folder.fetchAll", async () => {
        const folders = await folderService.getAll();
        set({ folders });
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to load folders" });
    }
  },

  // ─── fetchFolderById ──────────────────────────
  fetchFolderById: async (id) => {
    set({ error: null });
    try {
      await get().runWithLoading("folder.fetchOne", async () => {
        const folder = await folderService.getById(id);
        set({ selectedFolder: folder });
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to load folder" });
    }
  },

  // ─── createFolder ─────────────────────────────
  createFolder: async (data) => {
    set({ error: null });
    try {
      await get().runWithLoading("folder.create", async () => {
        const newFolder = await folderService.create(data);
        // Add to list immediately — no need to re-fetch all
        set((state) => ({ folders: [...state.folders, newFolder] }));
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to create folder" });
      throw err;
    }
  },

  // ─── updateFolder ─────────────────────────────
  updateFolder: async (id, data) => {
    set({ error: null });
    try {
      await get().runWithLoading("folder.update", async () => {
        const updated = await folderService.update(id, data);
        // Replace the old folder in the list with the updated one
        set((state) => ({
          folders: state.folders.map((f) => (f.id === id ? updated : f)),
          selectedFolder:
            state.selectedFolder?.id === id ? updated : state.selectedFolder,
        }));
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to update folder" });
      throw err;
    }
  },

  // ─── deleteFolder ─────────────────────────────
  deleteFolder: async (id) => {
    set({ error: null });
    try {
      await get().runWithLoading("folder.delete", async () => {
        await folderService.delete(id);
        // Remove from list immediately
        set((state) => ({
          folders: state.folders.filter((f) => f.id !== id),
          selectedFolder:
            state.selectedFolder?.id === id ? null : state.selectedFolder,
        }));
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to delete folder" });
      throw err;
    }
  },

  // ─── reorderFolders ───────────────────────────
  reorderFolders: async (data) => {
    set({ error: null });
    try {
      await get().runWithLoading("folder.reorder", async () => {
        await folderService.reorder(data);
        // Update sortOrder locally to match what we sent
        set((state) => ({
          folders: state.folders
            .map((f) => {
              const updated = data.folders.find((d) => d.id === f.id);
              return updated ? { ...f, sortOrder: updated.sortOrder } : f;
            })
            .sort((a, b) => a.sortOrder - b.sortOrder),
        }));
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to reorder folders" });
      throw err;
    }
  },

  // ─── setSelectedFolder ────────────────────────
  setSelectedFolder: (folder) => set({ selectedFolder: folder }),

  // ─── clearError ───────────────────────────────
  clearError: () => set({ error: null }),
}));

// Selector hook — same pattern as useAuthLoading
export const useFolderLoading = (key: string): boolean => {
  return useFolderStore((state) => state.loadingKeys[key] ?? false);
};