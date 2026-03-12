import { create } from "zustand";
import { noteService } from "../services/note.service";
import {
  Note,
  CreateNoteInput,
  UpdateNoteInput,
  UpdateMasteryInput,
  NoteQueryParams,
} from "../types/note.types";

interface LoadingState {
  [key: string]: boolean;
}

interface NoteStore {
  // ─── State ───────────────────────────────────
  notes: Note[];
  selectedNote: Note | null;
  tags: string[];
  total: number;
  page: number;
  error: string | null;
  loadingKeys: LoadingState;

  // ─── Actions ─────────────────────────────────
  fetchNotes: (params?: NoteQueryParams) => Promise<void>;
  fetchNoteById: (id: string) => Promise<void>;
  fetchTags: () => Promise<void>;
  createNote: (data: CreateNoteInput) => Promise<void>;
  updateNote: (id: string, data: UpdateNoteInput) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  updateMastery: (id: string, data: UpdateMasteryInput) => Promise<void>;
  setSelectedNote: (note: Note | null) => void;
  clearError: () => void;
  runWithLoading: <T>(key: string, fn: () => Promise<T>) => Promise<T>;
}

export const useNoteStore = create<NoteStore>((set, get) => ({

  // ─── Initial State ────────────────────────────
  notes: [],
  selectedNote: null,
  tags: [],
  total: 0,
  page: 1,
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

  // ─── fetchNotes ───────────────────────────────
  // Supports search, filter by folder, tags, pagination
  fetchNotes: async (params) => {
    set({ error: null });
    try {
      await get().runWithLoading("note.fetchAll", async () => {
        const result = await noteService.getAll(params);
        set({
          notes: (result.notes ?? []).map((n) => ({ ...n, tags: n.tags ?? [] })),
          total: result.pagination?.total ?? 0,
          page: result.pagination?.page ?? 1,
        });
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to load notes" });
    }
  },

  // ─── fetchNoteById ────────────────────────────
  fetchNoteById: async (id) => {
    set({ error: null });
    try {
      await get().runWithLoading("note.fetchOne", async () => {
        const note = await noteService.getById(id);
        set({ selectedNote: note });
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to load note" });
    }
  },

  // ─── fetchTags ────────────────────────────────
  fetchTags: async () => {
    try {
      await get().runWithLoading("note.fetchTags", async () => {
        const tags = await noteService.getTags();
        set({ tags });
      });
    } catch {
      // tags failing is non-critical — fail silently
    }
  },

  // ─── createNote ───────────────────────────────
  createNote: async (data) => {
    set({ error: null });
    try {
      await get().runWithLoading("note.create", async () => {
        const newNote = await noteService.create(data);
        set((state) => ({
          notes: [newNote, ...state.notes],
          selectedNote: newNote,
        }));
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to create note" });
      throw err;
    }
  },

  // ─── updateNote ───────────────────────────────
  updateNote: async (id, data) => {
    set({ error: null });
    try {
      await get().runWithLoading("note.update", async () => {
        const updated = await noteService.update(id, data);
        set((state) => ({
          notes: state.notes.map((n) => (n.id === id ? updated : n)),
          selectedNote:
            state.selectedNote?.id === id ? updated : state.selectedNote,
        }));
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to update note" });
      throw err;
    }
  },

  // ─── deleteNote ───────────────────────────────
  deleteNote: async (id) => {
    set({ error: null });
    try {
      await get().runWithLoading("note.delete", async () => {
        await noteService.delete(id);
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
          selectedNote:
            state.selectedNote?.id === id ? null : state.selectedNote,
        }));
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to delete note" });
      throw err;
    }
  },

  // ─── updateMastery ────────────────────────────
  updateMastery: async (id, data) => {
    set({ error: null });
    try {
      await get().runWithLoading("note.updateMastery", async () => {
        const updated = await noteService.updateMastery(id, data);
        set((state) => ({
          notes: state.notes.map((n) => (n.id === id ? updated : n)),
          selectedNote:
            state.selectedNote?.id === id ? updated : state.selectedNote,
        }));
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to update mastery" });
      throw err;
    }
  },

  // ─── setSelectedNote ──────────────────────────
  setSelectedNote: (note) => set({ selectedNote: note }),

  // ─── clearError ───────────────────────────────
  clearError: () => set({ error: null }),
}));

// Selector hook
export const useNoteLoading = (key: string): boolean => {
  return useNoteStore((state) => state.loadingKeys[key] ?? false);
};